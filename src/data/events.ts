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
      'Four days of open wheeling over Memorial Day weekend at IROHVSRA. ' +
      'One of the biggest multi-day events of the season — camping on-site, mixed terrain, ' +
      'and a full weekend to put your rig to work.',
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
      'A solid Father\'s Day weekend run at Apple Valley Farms with RPM 4x4 Club. ' +
      'Good terrain, good company — a raffle supports MN4WDA trail work.',
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
      'Four days of hard wheeling at IROHVSRA raising money for Multiple Sclerosis research. ' +
      'Technical terrain, great cause. Recovery gear required — this one earns its name.',
    location: 'IROHVSRA & West 40 RV Park, Gilbert, MN',
    isRecurring: false,
    date: '2026-07-16',
    endDate: '2026-07-19',
    tags: ['charity', 'technical', 'camping', 'overnight'],
  },
  {
    id: 'labor-day-weekend',
    name: 'Labor Day Weekend Open Wheeling',
    description:
      'Four days of open wheeling at IROHVSRA to close out summer. ' +
      'Camping on-site, all skill levels, and plenty of iron range terrain to work through.',
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
      'Two-day trail ride at Afton Apple Orchard raising toys for local kids. ' +
      'Bring a new unwrapped toy for entry — great fall event for the whole family.',
    location: 'Afton Apple Orchard, Hastings, MN',
    isRecurring: false,
    date: '2026-10-17',
    endDate: '2026-10-18',
    tags: ['charity', 'family-friendly', 'fall', 'toys-for-tots'],
  },
]

export default events
