import type { ClubEvent } from '../data/events'
import './EventCard.css'

interface Props {
  event: ClubEvent
}

const difficultyLabel: Record<ClubEvent['difficulty'], string> = {
  Easy:     'Easy',
  Moderate: 'Moderate',
  Hard:     'Hard',
}

const difficultyClass: Record<ClubEvent['difficulty'], string> = {
  Easy:     'badge-easy',
  Moderate: 'badge-moderate',
  Hard:     'badge-hard',
}

export default function EventCard({ event }: Props) {
  const timing = event.date
    ? new Date(event.date).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : event.month
    ? `Every ${event.month}`
    : 'Date TBD'

  return (
    <article className="event-card">
      <div className="event-card-header">
        <div className="event-card-timing">{timing}</div>
        <span className={`badge-difficulty ${difficultyClass[event.difficulty]}`}>
          {difficultyLabel[event.difficulty]}
        </span>
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
