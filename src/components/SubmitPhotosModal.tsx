import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './ReportModal.css'

interface Props {
  open: boolean
  onClose: () => void
  /** Tailors the details prompt to where the modal opened from. */
  variant?: 'gallery' | 'rigs'
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const MAX_FILES = 10
const MAX_FILE_BYTES = 20 * 1024 * 1024 // 20 MB — keep in sync with the Worker
const ACCEPT = 'image/jpeg,image/png,image/webp,image/heic'

// Direct upload needs the photo-upload Worker (workers/photo-upload) deployed
// and a Turnstile site key baked into the build; without the key the modal
// renders the original link-only form.
const TURNSTILE_SITE_KEY: string | undefined = import.meta.env.VITE_TURNSTILE_SITE_KEY

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: {
        sitekey: string
        callback: (token: string) => void
        'expired-callback'?: () => void
      }) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

const TURNSTILE_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  return new Promise((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = TURNSTILE_SRC
      script.async = true
      document.head.appendChild(script)
    }
    script.addEventListener('load', () => resolve())
    script.addEventListener('error', () => reject(new Error('Failed to load the verification widget')))
  })
}

function formatMB(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function SubmitPhotosModal({ open, onClose, variant = 'gallery' }: Props) {
  const location = useLocation()
  const uploadEnabled = Boolean(TURNSTILE_SITE_KEY)

  const [name,           setName]           = useState('')
  const [email,          setEmail]          = useState('')
  const [files,          setFiles]          = useState<File[]>([])
  const [photoLink,      setPhotoLink]      = useState('')
  const [showLink,       setShowLink]       = useState(false)
  const [details,        setDetails]        = useState('')
  const [consent,        setConsent]        = useState(false)
  const [requestUpdates, setRequestUpdates] = useState(false)
  const [website,        setWebsite]        = useState('') // honeypot
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg,  setErrorMsg]  = useState('')
  const [progress,  setProgress]  = useState('')

  const turnstileToken = useRef('')
  const turnstileEl = useRef<HTMLDivElement>(null)
  const turnstileWidget = useRef<string | null>(null)

  // Render the Turnstile widget while the modal is open (upload mode only).
  useEffect(() => {
    if (!open || !uploadEnabled) return
    let cancelled = false
    loadTurnstile()
      .then(() => {
        if (cancelled || !turnstileEl.current || turnstileWidget.current !== null) return
        turnstileWidget.current = window.turnstile!.render(turnstileEl.current, {
          sitekey: TURNSTILE_SITE_KEY!,
          callback: token => { turnstileToken.current = token },
          'expired-callback': () => { turnstileToken.current = '' },
        })
      })
      .catch(() => { /* surfaced at submit time via the missing token */ })
    return () => {
      cancelled = true
      if (turnstileWidget.current !== null && window.turnstile) {
        window.turnstile.remove(turnstileWidget.current)
        turnstileWidget.current = null
        turnstileToken.current = ''
      }
    }
  }, [open, uploadEnabled])

  if (!open) return null

  function addFiles(picked: FileList | null) {
    if (!picked) return
    setErrorMsg('')
    const next = [...files]
    for (const file of Array.from(picked)) {
      if (next.length >= MAX_FILES) {
        setErrorMsg(`Up to ${MAX_FILES} photos per submission — the rest were skipped.`)
        break
      }
      if (file.size > MAX_FILE_BYTES) {
        setErrorMsg(`"${file.name}" is ${formatMB(file.size)} — the limit is 20 MB per photo.`)
        continue
      }
      next.push(file)
    }
    setFiles(next)
  }

  async function uploadFiles(): Promise<string[]> {
    const token = turnstileToken.current
    if (!token) {
      throw new Error('Please complete the verification check above the submit button.')
    }

    const sessionRes = await fetch('/api/photo-upload/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    if (!sessionRes.ok) {
      const data = await sessionRes.json().catch(() => ({}))
      throw new Error((data as { error?: string }).error ?? 'Could not start the upload — try again.')
    }
    const { ticket } = (await sessionRes.json()) as { ticket: string }

    const keys: string[] = []
    for (let i = 0; i < files.length; i++) {
      setProgress(`Uploading ${i + 1} of ${files.length}…`)
      const res = await fetch('/api/photo-upload/file', {
        method: 'POST',
        headers: {
          'X-Upload-Ticket': ticket,
          'X-File-Name': encodeURIComponent(files[i].name),
          'X-File-Index': String(i),
        },
        body: files[i],
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as { error?: string }).error ?? `Upload failed on "${files[i].name}" — try again.`,
        )
      }
      keys.push(((await res.json()) as { key: string }).key)
    }
    return keys
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    const link = photoLink.trim()
    const linkGiven = link.length > 0
    if (uploadEnabled) {
      if (files.length === 0 && !linkGiven) {
        setErrorMsg('Add at least one photo, or paste a link instead.')
        setFormState('error')
        return
      }
    } else if (!linkGiven) {
      setErrorMsg('The photo link needs to be a full URL (starting with http:// or https://).')
      setFormState('error')
      return
    }
    if (linkGiven && !/^https?:\/\/\S+$/i.test(link)) {
      setErrorMsg('The photo link needs to be a full URL (starting with http:// or https://).')
      setFormState('error')
      return
    }
    if (!consent) {
      setErrorMsg('Please confirm you have the right to share these photos.')
      setFormState('error')
      return
    }

    setFormState('submitting')

    try {
      const photoKeys = uploadEnabled && files.length > 0 ? await uploadFiles() : undefined
      setProgress(photoKeys ? 'Finishing up…' : '')

      const body = {
        project:        'mn4x4',
        type:           'photo_submission',
        submitterName:  name.trim(),
        submitterEmail: email.trim() || undefined,
        requestUpdates: Boolean(email.trim()) && requestUpdates,
        photoUrl:       linkGiven ? link : undefined,
        photoKeys,
        consent:        true,
        message:        details.trim(),
        page:           location.pathname,
        website, // honeypot — must be empty
      }

      const res = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_REPORT_SECRET ?? ''}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? `Server error (${res.status})`)
      }

      setFormState('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Try again.')
      setFormState('error')
      // A used ticket may be stale — make the visitor re-verify before retrying.
      if (turnstileWidget.current !== null && window.turnstile) {
        window.turnstile.reset(turnstileWidget.current)
        turnstileToken.current = ''
      }
    } finally {
      setProgress('')
    }
  }

  function handleClose() {
    setName('')
    setEmail('')
    setFiles([])
    setPhotoLink('')
    setShowLink(false)
    setDetails('')
    setConsent(false)
    setRequestUpdates(false)
    setWebsite('')
    setFormState('idle')
    setErrorMsg('')
    setProgress('')
    onClose()
  }

  return (
    <div
      className="report-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-photos-modal-title"
      onClick={e => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div className="report-modal">
        <div className="report-modal-header">
          <h2 id="submit-photos-modal-title" className="report-modal-title">Submit Photos</h2>
          <button className="report-modal-close" onClick={handleClose} aria-label="Close">✕</button>
        </div>

        <div className="report-modal-body">
          {formState === 'success' ? (
            <div className="report-success">
              <p>
                Thanks — {uploadEnabled ? 'photos' : 'link'} received. Every
                submission gets a once-over before anything goes up on the site.
              </p>
              <button className="btn-brand-red" onClick={handleClose}>Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Honeypot — hidden from real users, must stay empty */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                tabIndex={-1}
                aria-hidden="true"
                className="report-honeypot"
                autoComplete="off"
              />

              <p className="report-intro">
                {uploadEnabled
                  ? 'Got trail or rig photos? Upload them right here — up to 10 photos, 20 MB each.'
                  : 'Got trail or rig photos? Host them where we can grab them — Google Photos, Drive, Imgur, a Facebook album — and paste the share link below.'}
              </p>

              <div className="report-field">
                <label htmlFor="submit-photos-name">
                  Your Name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="submit-photos-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  maxLength={128}
                  autoComplete="name"
                />
              </div>

              <div className="report-field">
                <label htmlFor="submit-photos-email">
                  Email <span className="report-optional">(optional)</span>
                </label>
                <input
                  id="submit-photos-email"
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value)
                    if (!e.target.value.trim()) setRequestUpdates(false)
                  }}
                  maxLength={254}
                  autoComplete="email"
                />
              </div>

              {email.trim() && (
                <div className="report-field report-field--checkbox">
                  <label className="report-checkbox-label">
                    <input
                      type="checkbox"
                      checked={requestUpdates}
                      onChange={e => setRequestUpdates(e.target.checked)}
                    />
                    Email me when these get posted
                  </label>
                </div>
              )}

              {uploadEnabled ? (
                <>
                  <div className="report-field">
                    <label htmlFor="submit-photos-files">
                      Your photos <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="submit-photos-files"
                      type="file"
                      accept={ACCEPT}
                      multiple
                      onChange={e => {
                        addFiles(e.target.files)
                        e.target.value = ''
                      }}
                    />
                    {files.length > 0 && (
                      <ul className="report-file-list">
                        {files.map((file, i) => (
                          <li key={`${file.name}-${i}`}>
                            {file.name} <span className="report-optional">({formatMB(file.size)})</span>
                            <button
                              type="button"
                              aria-label={`Remove ${file.name}`}
                              onClick={() => setFiles(files.filter((_, j) => j !== i))}
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="report-field">
                    {showLink ? (
                      <>
                        <label htmlFor="submit-photos-link">
                          Link to your photos <span className="report-optional">(instead of uploading)</span>
                        </label>
                        <input
                          id="submit-photos-link"
                          type="url"
                          value={photoLink}
                          onChange={e => setPhotoLink(e.target.value)}
                          maxLength={512}
                          placeholder="https://photos.app.goo.gl/…"
                          autoComplete="off"
                        />
                      </>
                    ) : (
                      <button
                        type="button"
                        className="report-link-toggle"
                        onClick={() => setShowLink(true)}
                      >
                        …or paste a link to hosted photos instead
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="report-field">
                  <label htmlFor="submit-photos-link">
                    Link to your photos <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="submit-photos-link"
                    type="url"
                    value={photoLink}
                    onChange={e => setPhotoLink(e.target.value)}
                    required
                    maxLength={512}
                    placeholder="https://photos.app.goo.gl/…"
                    autoComplete="off"
                  />
                </div>
              )}

              <div className="report-field">
                <label htmlFor="submit-photos-details">
                  {variant === 'rigs' ? 'Tell us about your rig!' : 'What are they from?'}{' '}
                  <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="submit-photos-details"
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  required
                  maxLength={4000}
                  rows={4}
                  placeholder={variant === 'rigs'
                    ? 'Year, make, mods, the story behind it — whatever belongs on the card.'
                    : 'Which run or event, or whose rig — anything that helps us file them.'}
                />
              </div>

              <p className="report-guidelines">
                Ground rules: the photos must be yours, or you have the owner's
                OK to share them. We strip location data before posting, and
                every submission is reviewed first. We'll credit you by the name
                above — mention it in the notes if you'd rather skip the credit.
              </p>

              <div className="report-field report-field--checkbox">
                <label className="report-checkbox-label">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    required
                  />
                  I have the right to share these photos and they can be posted
                  on mn4x4.org.
                </label>
              </div>

              {uploadEnabled && <div ref={turnstileEl} className="report-field" />}

              {errorMsg && (
                <p className="report-error" role="alert">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="btn-brand-red report-submit"
                disabled={formState === 'submitting'}
              >
                {formState === 'submitting' ? (progress || 'Sending…') : 'Submit Photos'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
