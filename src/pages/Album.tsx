import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import { albumById } from '../data/albums'
import { photoUrl } from '../lib/photos'
import { formatDate } from '../lib/dates'
import '../styles/theme.css'
import './Gallery.css'

export default function Album() {
  const { albumId } = useParams()
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const album = albumId ? albumById(albumId) : undefined
  if (!album) return <Navigate to="/gallery" replace />

  return (
    <main>
      <section className="page-hero section-dark">
        <div className="content-container">
          <p className="page-hero-label">{formatDate(album.date)}</p>
          <h1 className="page-hero-title">{album.title}</h1>
        </div>
      </section>

      <section className="section section-light">
        <div className="content-container">
          <Link to="/gallery" className="album-back-link">← All Albums</Link>
          <div className="photo-grid">
            {album.photos.map((photo, i) => (
              <button
                key={photo.file}
                type="button"
                className="photo-thumb"
                onClick={() => setLightboxIndex(i)}
                aria-label={photo.caption ?? `Photo ${i + 1} of ${album.photos.length}`}
              >
                <img src={photoUrl(photo.file, 'thumb')} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={album.photos.map(p => ({
          src: photoUrl(p.file, 'full'),
          description: p.caption,
        }))}
        plugins={[Captions]}
      />
    </main>
  )
}
