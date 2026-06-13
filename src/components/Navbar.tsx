import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/4x4-brothers-words-only.jpg'
import { flags } from '../config/flags'
import '../styles/theme.css'
import './Navbar.css'

const navLinks = [
  { to: '/',        label: 'Home'   },
  { to: '/events',  label: 'Events' },
  { to: '/about',   label: 'About'  },
  { to: '/merch',   label: 'Merch'  },
  { to: '/gallery', label: 'Gallery'},
  ...(flags.rigsEnabled ? [{ to: '/rigs', label: 'Rigs' }] : []),
]

export default function Navbar({ onOpenReport }: { onOpenReport: () => void }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="site-navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={close} aria-label="Minnesota 4x4 Brothers home">
          <img src={logo} alt="MN 4x4 Brothers" height="36" />
        </Link>

        {/* Desktop nav */}
        <nav className="navbar-links-desktop" aria-label="Main navigation">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                'navbar-link' + (isActive ? ' navbar-link--active' : '')
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://www.facebook.com/groups/253653171083360/"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-link navbar-link--fb"
          >
            Facebook
          </a>
          <button
            className="navbar-link navbar-link--feedback"
            onClick={onOpenReport}
          >
            Feedback
          </button>
        </nav>

        {/* Hamburger */}
        <button
          className={`navbar-hamburger${open ? ' is-open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      <nav
        id="mobile-menu"
        className={`navbar-mobile${open ? ' is-open' : ''}`}
        aria-label="Mobile navigation"
      >
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              'navbar-mobile-link' + (isActive ? ' navbar-mobile-link--active' : '')
            }
            onClick={close}
          >
            {label}
          </NavLink>
        ))}
        <a
          href="https://www.facebook.com/groups/253653171083360/"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-mobile-link"
          onClick={close}
        >
          Facebook ↗
        </a>
        <button
          className="navbar-mobile-link navbar-mobile-link--feedback"
          onClick={() => { onOpenReport(); close() }}
        >
          Feedback
        </button>
      </nav>
    </header>
  )
}
