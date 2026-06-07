import EventCard from '../components/EventCard'
import events from '../data/events'
import '../styles/theme.css'
import './Events.css'

export default function Events() {
  const recurringEvents = events.filter(e => e.isRecurring)
  const scheduledEvents = events.filter(e => !e.isRecurring && e.date)

  return (
    <main className="events-page">
      {/* ── Page header ─────────────────────────────────────── */}
      <section className="page-hero section-dark">
        <div className="content-container">
          <p className="page-hero-label">Get Out There</p>
          <h1 className="page-hero-title">Club Events & Runs</h1>
          <p className="page-hero-subtitle">
            We get out year-round. This page has the schedule — and we'll usually post
            meet-up times and any last-minute changes here or in the Facebook group.
          </p>
        </div>
      </section>

      {/* ── Specific upcoming ───────────────────────────────── */}
      {scheduledEvents.length > 0 && (
        <section className="section section-light events-section">
          <div className="content-container">
            <h2 className="events-section-heading">2026 Events</h2>
            <hr className="brand-divider" />
            <p className="events-section-body">
              These are our main club runs for the year. You'll also find members out at all
              kinds of other events on the MN4WDA calendar — these are just the ones we organize around.
            </p>
            <div className="events-grid">
              {scheduledEvents.map(event => (
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
              We run these every year. We'll post the exact dates a few weeks out —
              keep an eye on this page or the Facebook group.
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
              We're a member club of the MN4WD Association. Their calendar lists runs,
              competitions, and events open to member clubs all over the state. Odds are
              you'll run into some of our members at a good number of them, too.
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
            Keep an eye on this page and the Facebook group — between the two,
            you'll know when the next run is happening.
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
