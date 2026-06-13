import { Link } from 'react-router-dom'
import '../styles/theme.css'

export default function NotFound() {
  return (
    <main>
      <section className="page-hero section-dark">
        <div className="content-container">
          <p className="page-hero-label">Off the Trail</p>
          <h1 className="page-hero-title">404</h1>
        </div>
      </section>

      <section className="section section-light">
        <div className="content-container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">🧭</div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '1rem' }}>
            This line doesn't go anywhere
          </h2>
          <p style={{ color: 'var(--color-muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
            The page you're after isn't here — bad link, old bookmark, or a typo in
            the URL. Let's get you back on the main line.
          </p>
          <Link to="/" className="btn-brand-red">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  )
}
