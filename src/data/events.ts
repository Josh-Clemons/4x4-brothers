export interface ClubEvent {
  id: string
  name: string
  description: string
  location: string
  isRecurring: boolean
  /** Month name for annual/recurring events, e.g. "June" */
  month?: string
  /** ISO date string for specific upcoming events, e.g. "2026-05-22" */
  date?: string
  /** ISO date string for end of multi-day events */
  endDate?: string
  tags: string[]
}

const events: ClubEvent[] = [
  {
    id: 'memorial-rally',
    name: 'Memorial Total Off-Road Rally',
    description:
      'Four days of open wheeling at IROHVSRA over Memorial Day weekend. ' +
      'One of the bigger events of the season — camping on-site, mixed terrain, ' +
      'and a full weekend to get out and run.',
    location: 'IROHVSRA, Gilbert, MN',
    isRecurring: false,
    date: '2026-05-22',
    endDate: '2026-05-25',
    tags: ['camping', 'overnight', 'open-wheeling', 'memorial-weekend'],
  },
  {
    id: 'fathers-day-wheeling',
    name: "Father's Day Weekend Wheeling",
    description:
      'A Father\'s Day weekend run at Apple Valley Farms with the RPM 4x4 Club. ' +
      'Good wheeling, good folks, and a raffle that helps fund MN4WDA trail work.',
    location: 'Apple Valley Farms, Chetek, WI',
    isRecurring: false,
    date: '2026-06-13',
    endDate: '2026-06-14',
    tags: ['weekend', 'raffle', 'mn4wda'],
  },
  {
    id: 'crawl-for-the-cure',
    name: 'Crawl for the Cure',
    description:
      'Four days of harder wheeling at IROHVSRA, raising money for MS research. ' +
      'Technical terrain for a good cause — bring your recovery gear for this one.',
    location: 'IROHVSRA & West 40 RV Park, Gilbert, MN',
    isRecurring: false,
    date: '2026-07-16',
    endDate: '2026-07-19',
    tags: ['charity', 'technical', 'camping', 'overnight'],
  },
  {
    id: 'avf-july',
    name: 'AVF Summer Wheeling',
    description:
      'Another weekend at Apple Valley Farms with the RPM 4x4 Club. ' +
      'Same good terrain and good company, plus a raffle for MN4WDA trail work.',
    location: 'Apple Valley Farms, Chetek, WI',
    isRecurring: false,
    date: '2026-07-25',
    endDate: '2026-07-26',
    tags: ['weekend', 'raffle', 'mn4wda'],
  },
  {
    id: 'labor-day-weekend',
    name: 'Labor Day Weekend Open Wheeling',
    description:
      'Four days at IROHVSRA to send off the summer. ' +
      'Camping on-site, all skill levels welcome, and plenty of iron range terrain to work through.',
    location: 'IROHVSRA, Gilbert, MN',
    isRecurring: false,
    date: '2026-09-04',
    endDate: '2026-09-07',
    tags: ['camping', 'overnight', 'open-wheeling', 'labor-day'],
  },
  {
    id: 'toys-for-tots',
    name: 'Toys for Tots Trail Ride',
    description:
      'A two-day trail ride at Afton Apple Orchard collecting toys for local kids. ' +
      'Bring a new, unwrapped toy to get in — a nice fall outing for the whole family.',
    location: 'Afton Apple Orchard, Hastings, MN',
    isRecurring: false,
    date: '2026-10-17',
    endDate: '2026-10-18',
    tags: ['charity', 'family-friendly', 'fall', 'toys-for-tots'],
  },
]

// Always export sorted by date so authoring order doesn't matter
export default [...events].sort((a, b) => {
  if (!a.date && !b.date) return 0
  if (!a.date) return 1
  if (!b.date) return -1
  return a.date.localeCompare(b.date)
})
