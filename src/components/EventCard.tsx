import type { ClubEvent } from '../data/events'
import './EventCard.css'

interface Props {
  event: ClubEvent
}

function formatDate(iso: string) {
  // Parse as local date to avoid UTC-offset day shift
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

function formatDateShort(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric',
  })
}

export default function EventCard({ event }: Props) {
  const timing = event.date
    ? event.endDate
      ? `${formatDateShort(event.date)} – ${formatDate(event.endDate)}`
      : formatDate(event.date)
    : event.month
    ? `Every ${event.month}`
    : 'Date TBD'

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
    </article>
  )
}
