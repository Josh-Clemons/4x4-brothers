import { Link } from 'react-router-dom'
import club from '../data/club'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <p className="footer-club-name">{club.shortName}</p>
          <p className="footer-est">Est. {club.established}</p>
          <p className="footer-tagline">{club.tagline}</p>
        </div>

        {/* Nav */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <p className="footer-nav-heading">Pages</p>
          <Link to="/"        className="footer-link">Home</Link>
          <Link to="/events"  className="footer-link">Events</Link>
          <Link to="/about"   className="footer-link">About</Link>
          <Link to="/merch"   className="footer-link">Merch</Link>
          <Link to="/gallery" className="footer-link">Gallery</Link>
        </nav>

        {/* Social */}
        <div className="footer-social">
          <p className="footer-nav-heading">Connect</p>
          <a
            href={club.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Facebook Group ↗
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} {club.name}. All rights reserved.</p>
      </div>
    </footer>
  )
}
