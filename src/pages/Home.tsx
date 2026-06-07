import { Link } from 'react-router-dom'
import clubLogo from '../assets/4x4-brothers.jpg'
import EventCard from '../components/EventCard'
import events from '../data/events'
import club from '../data/club'
import '../styles/theme.css'
import './Home.css'

export default function Home() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const featuredEvents = events
    .filter(e => {
      if (e.isRecurring || !e.date) return false
      const cutoff = new Date(e.endDate ?? e.date)
      return cutoff >= today
    })
    .slice(0, 3)

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="hero" aria-label="Welcome">
        <div className="hero-bg" />
        <div className="hero-content">
          <img
            src={clubLogo}
            alt="Minnesota 4x4 Brothers logo"
            className="hero-logo"
          />
          <p className="hero-tagline">{club.tagline}</p>
          <div className="hero-actions">
            <Link to="/events" className="btn-brand-red">See Our Events</Link>
            <a
              href={club.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-white"
            >
              Find Us on Facebook
            </a>
          </div>
        </div>
      </section>

      {/* ── About blurb ───────────────────────────────────────── */}
      <section className="section section-light home-about">
        <div className="content-container">
          <p className="home-about-est">Est. {club.established}</p>
          <h2 className="home-about-heading">Minnesota's Off-Road Brotherhood</h2>
          <hr className="brand-divider" />
          <p className="home-about-body">{club.description}</p>
          <Link to="/about" className="btn-brand-blue">About the Club</Link>
        </div>
      </section>

      {/* ── Upcoming Events teaser ────────────────────────────── */}
      <section className="section home-events-section">
        <div className="content-container">
          <h2 className="home-section-heading">Upcoming Runs</h2>
          <hr className="brand-divider" />
          <div className="home-events-grid">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="home-events-cta">
            <Link to="/events" className="btn-brand-red">View All Events</Link>
          </div>
        </div>
      </section>

      {/* ── Join CTA ──────────────────────────────────────────── */}
      <section className="section section-dark home-join">
        <div className="content-container home-join-inner">
          <div>
            <h2 className="home-join-heading">Come Out Sometime</h2>
            <p className="home-join-body">
              No signup form, no hoops. Come to a run, say hello, and see if it's
              your kind of crowd. That's how just about everybody here got started.
            </p>
          </div>
          <div className="home-join-actions">
            <a
              href={club.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand-red"
            >
              Join the Facebook Group
            </a>
            <Link to="/about" className="btn-outline-white">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
