import EventCard from '../components/EventCard'
import events from '../data/events'
import '../styles/theme.css'
import './Events.css'

export default function Events() {
  const recurringEvents = events.filter(e => e.isRecurring)
  const upcomingEvents  = events.filter(e => !e.isRecurring && e.date)

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
