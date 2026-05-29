import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import './ReportModal.css'

interface Props {
  open: boolean
  onClose: () => void
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ReportModal({ open, onClose }: Props) {
  const location = useLocation()

  const [name,           setName]           = useState('')
  const [email,          setEmail]          = useState('')
  const [message,        setMessage]        = useState('')
  const [requestUpdates, setRequestUpdates] = useState(false)
  const [website,        setWebsite]        = useState('') // honeypot
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg,  setErrorMsg]  = useState('')

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormState('submitting')
    setErrorMsg('')

    const body = {
      project:        'mn4x4',
      type:           'other',
      submitterName:  name.trim(),
      submitterEmail: email.trim() || undefined,
      requestUpdates: Boolean(email.trim()) && requestUpdates,
      message:        message.trim(),
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
    setMessage('')
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
      aria-labelledby="report-modal-title"
      onClick={e => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div className="report-modal">
        <div className="report-modal-header">
          <h2 id="report-modal-title" className="report-modal-title">Feedback</h2>
          <button className="report-modal-close" onClick={handleClose} aria-label="Close">✕</button>
        </div>

        <div className="report-modal-body">
          {formState === 'success' ? (
            <div className="report-success">
              <p>Thanks — got it. We'll take a look.</p>
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

              <div className="report-field">
                <label htmlFor="report-name">
                  Name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="report-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  maxLength={128}
                  autoComplete="name"
                />
              </div>

              <div className="report-field">
                <label htmlFor="report-email">
                  Email <span className="report-optional">(optional)</span>
                </label>
                <input
                  id="report-email"
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
                    Notify me via email when this is addressed
                  </label>
                </div>
              )}

              <div className="report-field">
                <label htmlFor="report-message">
                  Message <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="report-message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  maxLength={4000}
                  rows={5}
                />
              </div>

              {formState === 'error' && (
                <p className="report-error" role="alert">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="btn-brand-red report-submit"
                disabled={formState === 'submitting'}
              >
                {formState === 'submitting' ? 'Sending…' : 'Send Feedback'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
