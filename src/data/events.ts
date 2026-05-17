export interface ClubEvent {
  id: string
  name: string
  description: string
  location: string
  difficulty: 'Easy' | 'Moderate' | 'Hard'
  isRecurring: boolean
  /** Month name for annual/recurring events, e.g. "June" */
  month?: string
  /** ISO date string for specific upcoming events, e.g. "2025-07-12" */
  date?: string
  tags: string[]
}

const events: ClubEvent[] = [
  {
    id: 'mud-bogs',
    name: 'Spring Mud Bogs',
    description:
      'Kick off the season with a classic mud run. Open to all builds — stock rigs welcome, lockers encouraged.',
    location: 'TBD — Central MN',
    difficulty: 'Moderate',
    isRecurring: true,
    month: 'April',
    tags: ['mud', 'spring', 'family-friendly'],
  },
  {
    id: 'memorial-run',
    name: 'Memorial Weekend Run',
    description:
      'Our biggest annual gathering. Multi-day camping and wheeling over Memorial Day weekend. A club tradition since the early days.',
    location: 'TBD — Northern MN',
    difficulty: 'Moderate',
    isRecurring: true,
    month: 'May',
    tags: ['camping', 'overnight', 'annual'],
  },
  {
    id: 'summer-trail',
    name: 'Summer Trail Ride',
    description:
      'A scenic mid-summer cruise through forest trails. Great for newer members and families looking for a laid-back outing.',
    location: 'TBD — Northern MN',
    difficulty: 'Easy',
    isRecurring: true,
    month: 'July',
    tags: ['trail', 'family-friendly', 'beginner'],
  },
  {
    id: 'rock-crawl',
    name: 'Fall Rock Crawl',
    description:
      'Technical rock crawling for the more experienced wheelers. Spotters available, recovery gear required.',
    location: 'TBD — Western WI',
    difficulty: 'Hard',
    isRecurring: true,
    month: 'September',
    tags: ['rock crawl', 'technical', 'experienced'],
  },
  {
    id: 'fall-colors',
    name: 'Fall Colors Cruise',
    description:
      'A relaxed end-of-season trail run to enjoy the Minnesota fall foliage before the snow flies.',
    location: 'TBD — Northeastern MN',
    difficulty: 'Easy',
    isRecurring: true,
    month: 'October',
    tags: ['trail', 'scenic', 'family-friendly'],
  },
  {
    id: 'winter-run',
    name: 'Winter Snow Run',
    description:
      'For those who refuse to garage their rigs all winter. Snow wheeling in the frozen north — chains and lockers welcome.',
    location: 'TBD — Northern MN',
    difficulty: 'Moderate',
    isRecurring: true,
    month: 'January',
    tags: ['snow', 'winter', 'cold-weather'],
  },
]

export default events
