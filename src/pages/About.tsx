import club from '../data/club'
import '../styles/theme.css'
import './About.css'

export default function About() {
  return (
    <main className="about-page">
      {/* ── Page hero ───────────────────────────────────────── */}
      <section className="page-hero section-dark">
        <div className="content-container">
          <p className="page-hero-label">Who We Are</p>
          <h1 className="page-hero-title">About the Club</h1>
          <p className="page-hero-subtitle">
            Minnesota's longest-running 4x4 club — built on dirty axles, honest spotting, and showing up when it counts.
          </p>
        </div>
      </section>

      {/* ── History ─────────────────────────────────────────── */}
      <section className="section section-light about-section">
        <div className="content-container about-two-col">
          <div>
            <p className="section-label">Since {club.established}</p>
            <h2 className="about-heading">Our History</h2>
            <hr className="brand-divider" />
            <p className="about-body">{club.about.history}</p>
          </div>
          <div className="about-est-badge" aria-hidden="true">
            <span className="about-est-year">{club.established}</span>
            <span className="about-est-label">Est.</span>
          </div>
        </div>
      </section>

      {/* ── Mission ─────────────────────────────────────────── */}
      <section className="section about-section" style={{ backgroundColor: 'var(--color-dark-alt)', color: 'var(--color-white)' }}>
        <div className="content-container">
          <p className="section-label text-red">What We Stand For</p>
          <h2 className="about-heading" style={{ color: 'var(--color-white)' }}>Our Mission</h2>
          <hr className="brand-divider" />
          <p className="about-body" style={{ color: '#d1d5db', maxWidth: '680px' }}>
            {club.about.mission}
          </p>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────── */}
      <section className="section section-light about-section">
        <div className="content-container">
          <p className="section-label">Core Values</p>
          <h2 className="about-heading">What Drives Us</h2>
          <hr className="brand-divider" />
          <div className="values-grid">
            {club.about.values.map(v => (
              <div key={v.title} className="value-card">
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Board ───────────────────────────────────────────── */}
      <section className="section section-light about-section">
        <div className="content-container">
          <p className="section-label">Leadership</p>
          <h2 className="about-heading">The Board</h2>
          <hr className="brand-divider" />
          <div className="board-grid">
            {club.board.map((member, i) => (
              <div key={i} className="board-card">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="board-card-photo"
                  />
                ) : (
                  <div className="board-card-photo-placeholder" aria-hidden="true">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="8" r="4" fill="#4B5563" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                <div className="board-card-body">
                  <p className="board-card-role">{member.role}</p>
                  <h3 className="board-card-name">{member.name}</h3>
                  <p className="board-card-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Membership ──────────────────────────────────────── */}
      <section className="section section-dark about-section">
        <div className="content-container">
          <p className="section-label text-red">Get Involved</p>
          <h2 className="about-heading" style={{ color: 'var(--color-white)' }}>How to Join</h2>
          <hr className="brand-divider" />
          <p className="about-body" style={{ color: '#d1d5db', maxWidth: '640px' }}>
            {club.membership.howToJoin}
          </p>
          <ul className="membership-list">
            {club.membership.requirements.map(req => (
              <li key={req} className="membership-item">{req}</li>
            ))}
          </ul>
          <p className="about-body membership-cta-text" style={{ color: '#d1d5db' }}>
            {club.membership.ctaText}
          </p>
          <a
            href={club.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand-red"
          >
            Find Us on Facebook
          </a>
        </div>
      </section>
    </main>
  )
}
