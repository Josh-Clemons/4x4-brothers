import EventCard from '../components/EventCard'
import events from '../data/events'
import '../styles/theme.css'
import './Events.css'

export default function Events() {
  const recurringEvents = events.filter(e => e.isRecurring)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingEvents  = events.filter(e => {
    if (e.isRecurring || !e.date) return false
    const cutoff = new Date(e.endDate ?? e.date)
    return cutoff >= today
  })

  return (
    <main className="events-page">
      {/* ── Page header ─────────────────────────────────────── */}
      <section className="page-hero section-dark">
        <div className="content-container">
          <p className="page-hero-label">Get Out There</p>
          <h1 className="page-hero-title">Club Events & Runs</h1>
          <p className="page-hero-subtitle">
            We run year-round. Check our Facebook group for meet-up times,
            last-minute changes, and anything that comes up between now and the trailhead.
          </p>
        </div>
      </section>

      {/* ── Specific upcoming ───────────────────────────────── */}
      {upcomingEvents.length > 0 && (
        <section className="section section-light events-section">
          <div className="content-container">
            <h2 className="events-section-heading">2026 Events</h2>
            <hr className="brand-divider" />
            <div className="events-grid">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Annual / recurring ──────────────────────────────── */}
      {recurringEvents.length > 0 && (
        <section className="section events-section" style={{ backgroundColor: 'var(--color-light)' }}>
          <div className="content-container">
            <h2 className="events-section-heading">Annual Runs</h2>
            <hr className="brand-divider" />
            <p className="events-section-body">
              These runs happen every year. Exact dates are announced on our Facebook group
              a few weeks before each event.
            </p>
            <div className="events-grid">
              {recurringEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MN4WD Association calendar ───────────────────────── */}
      <section className="section events-mn4wd">
        <div className="content-container events-mn4wd-inner">
          <div className="events-mn4wd-text">
            <p className="events-mn4wd-label">Minnesota 4WD Association</p>
            <h2 className="events-mn4wd-heading">Regional Events Calendar</h2>
            <p className="events-mn4wd-body">
              4x4 Brothers is a member club of the MN4WD Association. Their annual
              calendar lists regional runs, competitions, and events open to all
              member clubs across the state.
            </p>
          </div>
          <a
            href="https://mn4wda.org/wp-content/uploads/2026/01/2026-Calendar.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand-blue"
          >
            View 2026 MN4WDA Calendar
          </a>
        </div>
      </section>

      {/* ── Facebook CTA ────────────────────────────────────── */}
      <section className="section section-dark events-fb-cta">
        <div className="content-container">
          <h2 className="events-fb-heading">Stay in the Loop</h2>
          <p className="events-fb-body">
            Dates, locations, and last-minute changes are all posted in our Facebook group.
            Join the group to get notified when the next run is announced.
          </p>
          <a
            href="https://www.facebook.com/groups/253653171083360/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand-red"
          >
            Join the Facebook Group
          </a>
        </div>
      </section>
    </main>
  )
}
