import { Link } from 'react-router-dom'
import albums from '../data/albums'
import club from '../data/club'
import { flags } from '../config/flags'
import { photoUrl } from '../lib/photos'
import { formatDate } from '../lib/dates'
import '../styles/theme.css'
import './Gallery.css'

function AlbumIndex() {
  return (
    <>
      <section className="section section-light">
        <div className="content-container">
          {albums.length === 0 ? (
            <div className="gallery-empty">
              <p className="gallery-empty-text">
                First albums are on their way. Until then, the Facebook group has
                plenty of photos and videos from past runs.
              </p>
              <a
                href={club.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand-red"
              >
                View Photos on Facebook
              </a>
            </div>
          ) : (
            <div className="album-grid">
              {albums.map(album => (
                <Link key={album.id} to={`/gallery/${album.id}`} className="album-card">
                  <img
                    src={photoUrl(album.cover, 'thumb')}
                    alt=""
                    className="album-card-cover"
                    loading="lazy"
                  />
                  <div className="album-card-body">
                    <p className="album-card-date">{formatDate(album.date)}</p>
                    <h3 className="album-card-title">{album.title}</h3>
                    <p className="album-card-count">
                      {album.photos.length} photo{album.photos.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {flags.rigsEnabled && (
        <section className="section section-alt">
          <div className="content-container">
            <p className="section-label text-red">Member Builds</p>
            <h2 className="gallery-rigs-heading">The Rigs</h2>
            <p className="gallery-rigs-body">
              The machines that get us down the trail — lifts, tires, lockers,
              and the choices behind them.
            </p>
            <Link to="/rigs" className="btn-brand-blue">
              Check Out the Rigs
            </Link>
          </div>
        </section>
      )}
    </>
  )
}

function ComingSoon() {
  return (
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
          href={club.social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brand-red"
        >
          View Photos on Facebook
        </a>
      </div>
    </section>
  )
}

export default function Gallery() {
  return (
    <main>
      <section className="page-hero section-dark">
        <div className="content-container">
          <p className="page-hero-label">Trail Photos</p>
          <h1 className="page-hero-title">Gallery</h1>
          {flags.galleryEnabled && (
            <p className="page-hero-subtitle">
              Photo dumps from club runs — straight off the trail, one album per run.
            </p>
          )}
        </div>
      </section>

      {flags.galleryEnabled ? <AlbumIndex /> : <ComingSoon />}
    </main>
  )
}
