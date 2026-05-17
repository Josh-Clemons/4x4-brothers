import '../styles/theme.css'

export default function Gallery() {
  return (
    <main>
      <section className="page-hero section-dark">
        <div className="content-container">
          <p className="page-hero-label">Trail Photos</p>
          <h1 className="page-hero-title">Gallery</h1>
        </div>
      </section>

      <section className="section section-light">
        <div className="content-container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">📷</div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '1rem' }}>
            Photos Coming Soon
          </h2>
          <p style={{ color: 'var(--color-muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
            We're putting together a gallery of trail photos from past runs.
            In the meantime, check out our Facebook group for photos and videos.
          </p>
          <a
            href="https://www.facebook.com/groups/253653171083360/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand-red"
          >
            View Photos on Facebook
          </a>
        </div>
      </section>
    </main>
  )
}
