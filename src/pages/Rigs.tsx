import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import rigs from '../data/rigs'
import type { Rig } from '../data/rigs'
import club from '../data/club'
import { flags } from '../config/flags'
import { photoUrl } from '../lib/photos'
import SubmitPhotosModal from '../components/SubmitPhotosModal'
import '../styles/theme.css'
import './Rigs.css'

function RigCard({ rig, onOpenLightbox }: {
  rig: Rig
  onOpenLightbox: (rig: Rig, index: number) => void
}) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const count = rig.photos.length

  const step = (delta: number) =>
    setPhotoIndex(i => (i + delta + count) % count)

  return (
    <article className="rig-card" onClick={() => onOpenLightbox(rig, photoIndex)}>
      <div className="rig-card-photo-wrap">
        <button
          type="button"
          className="rig-card-photo-button"
          onClick={e => { e.stopPropagation(); onOpenLightbox(rig, photoIndex) }}
          aria-label={`View photos of ${rig.owner}'s ${rig.vehicle}`}
        >
          <img
            src={photoUrl(rig.photos[photoIndex], 'card')}
            alt={`${rig.owner}'s ${rig.vehicle}`}
            className="rig-card-photo"
            loading="lazy"
          />
        </button>
        {count > 1 && (
          <>
            <button
              type="button"
              className="rig-card-nav rig-card-nav--prev"
              onClick={e => { e.stopPropagation(); step(-1) }}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              className="rig-card-nav rig-card-nav--next"
              onClick={e => { e.stopPropagation(); step(1) }}
              aria-label="Next photo"
            >
              ›
            </button>
            <div className="rig-card-dots" aria-hidden="true">
              {rig.photos.map((file, i) => (
                <span
                  key={file}
                  className={`rig-card-dot${i === photoIndex ? ' rig-card-dot--active' : ''}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="rig-card-body">
        <p className="rig-card-owner">{rig.owner}</p>
        <h3 className="rig-card-vehicle">{rig.vehicle}</h3>
        <dl className="rig-spec-list">
          {rig.specs.map(spec => (
            <div key={spec.label} className="rig-spec">
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
        {rig.story && <p className="rig-card-story">{rig.story}</p>}
      </div>
    </article>
  )
}

export default function Rigs() {
  const [lightbox, setLightbox] = useState<{ rig: Rig; index: number } | null>(null)
  const [submitOpen, setSubmitOpen] = useState(false)

  return (
    <main>
      <section className="page-hero section-dark">
        <div className="content-container">
          <p className="page-hero-label">Member Builds</p>
          <h1 className="page-hero-title">The Rigs</h1>
          <p className="page-hero-subtitle">
            Lifts, tires, lockers, armor — the machines that get us down the trail,
            and the build choices behind them.
          </p>
          {flags.photoSubmitEnabled && (
            <button
              type="button"
              className="btn-brand-red page-hero-cta"
              onClick={() => setSubmitOpen(true)}
            >
              Submit Your Rig
            </button>
          )}
        </div>
      </section>

      <section className="section section-light">
        <div className="content-container">
          {rigs.length === 0 ? (
            <div className="rigs-empty">
              <p className="rigs-empty-text">
                Member builds are on their way. Got a rig that belongs up here?
                Catch us on a run or post it in the Facebook group.
              </p>
              <a
                href={club.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand-red"
              >
                Join the Facebook Group
              </a>
            </div>
          ) : (
            <div className="rigs-grid">
              {rigs.map(rig => (
                <RigCard
                  key={rig.id}
                  rig={rig}
                  onOpenLightbox={(r, index) => setLightbox({ rig: r, index })}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox
        open={lightbox !== null}
        close={() => setLightbox(null)}
        index={lightbox?.index ?? 0}
        slides={(lightbox?.rig.photos ?? []).map(file => ({ src: photoUrl(file, 'full') }))}
      />

      <SubmitPhotosModal variant="rigs" open={submitOpen} onClose={() => setSubmitOpen(false)} />
    </main>
  )
}
