import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import './ReportModal.css'

interface Props {
  open: boolean
  onClose: () => void
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function SubmitPhotosModal({ open, onClose }: Props) {
  const location = useLocation()

  const [name,           setName]           = useState('')
  const [email,          setEmail]          = useState('')
  const [photoLink,      setPhotoLink]      = useState('')
  const [details,        setDetails]        = useState('')
  const [consent,        setConsent]        = useState(false)
  const [requestUpdates, setRequestUpdates] = useState(false)
  const [website,        setWebsite]        = useState('') // honeypot
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg,  setErrorMsg]  = useState('')

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (!/^https?:\/\/\S+$/i.test(photoLink.trim())) {
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

    const body = {
      project:        'mn4x4',
      type:           'photo_submission',
      submitterName:  name.trim(),
      submitterEmail: email.trim() || undefined,
      requestUpdates: Boolean(email.trim()) && requestUpdates,
      photoUrl:       photoLink.trim(),
      consent:        true,
      message:        details.trim(),
      page:           location.pathname,
      website, // honeypot — must be empty
    }

    try {
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
    }
  }

  function handleClose() {
    setName('')
    setEmail('')
    setPhotoLink('')
    setDetails('')
    setConsent(false)
    setRequestUpdates(false)
    setWebsite('')
    setFormState('idle')
    setErrorMsg('')
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
                Thanks — link received. Every submission gets a once-over before
                anything goes up on the site.
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
                Got trail or rig photos? Host them where we can grab them —
                Google Photos, Drive, Imgur, a Facebook album — and paste the
                share link below.
              </p>

              <div className="report-field">
                <label htmlFor="submit-photos-name">
                  Name <span aria-hidden="true">*</span>
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

              <div className="report-field">
                <label htmlFor="submit-photos-details">
                  What are they from? <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="submit-photos-details"
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  required
                  maxLength={4000}
                  rows={4}
                  placeholder="Which run or event, or whose rig — anything that helps us file them."
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

              {formState === 'error' && (
                <p className="report-error" role="alert">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="btn-brand-red report-submit"
                disabled={formState === 'submitting'}
              >
                {formState === 'submitting' ? 'Sending…' : 'Submit Photos'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
