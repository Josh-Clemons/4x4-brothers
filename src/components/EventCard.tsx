import { Link } from 'react-router-dom'
import type { ClubEvent } from '../data/events'
import { albumForEvent } from '../data/albums'
import { flags } from '../config/flags'
import { formatDate, formatDateShort } from '../lib/dates'
import './EventCard.css'

interface Props {
  event: ClubEvent
}

export default function EventCard({ event }: Props) {
  const timing = event.date
    ? event.endDate
      ? `${formatDateShort(event.date)} – ${formatDate(event.endDate)}`
      : formatDate(event.date)
    : event.month
    ? `Every ${event.month}`
    : 'Date TBD'

  const album = flags.galleryEnabled ? albumForEvent(event.id) : undefined

  return (
    <article className="event-card">
      <div className="event-card-header">
        <div className="event-card-timing">{timing}</div>
      </div>

      <h3 className="event-card-title">{event.name}</h3>
      <p className="event-card-location">📍 {event.location}</p>
      <p className="event-card-description">{event.description}</p>

      <div className="event-card-tags">
        {event.tags.map(tag => (
          <span key={tag} className="event-tag">#{tag}</span>
        ))}
      </div>

      {album && (
        <Link to={`/gallery/${album.id}`} className="event-card-photos-link">
          View Photos →
        </Link>
      )}
    </article>
  )
}
