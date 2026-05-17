import '../styles/theme.css'
import './Merch.css'

export default function Merch() {
  return (
    <main className="merch-page">
      <section className="page-hero section-dark">
        <div className="content-container">
          <p className="page-hero-label">Rep the Club</p>
          <h1 className="page-hero-title">Merch</h1>
        </div>
      </section>

      <section className="section section-light merch-placeholder">
        <div className="content-container merch-inner">
          <div className="merch-icon" aria-hidden="true">🔧</div>
          <h2 className="merch-heading">Coming Soon</h2>
          <p className="merch-body">
            Club merchandise is in the works. Check back soon — or keep an eye on
            the Facebook group for announcements.
          </p>
          <a
            href="https://www.facebook.com/groups/253653171083360/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand-red"
          >
            Follow on Facebook
          </a>
        </div>
      </section>
    </main>
  )
}
