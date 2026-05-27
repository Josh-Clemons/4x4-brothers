const club = {
  name: 'Minnesota 4x4 Brothers',
  shortName: 'MN 4x4 Brothers',
  established: 1967,
  tagline: 'Air Down. Show Up. Wheel Clean.',
  description:
    'The Minnesota 4x4 Brothers have been wheeling since 1967 — back when four-wheel drive ' +
    'was a job, not a trim level. We\'re a technical off-road club: we pick our lines, ' +
    'spot each other through the rough stuff, and leave trails in better shape than we found them. ' +
    'If that\'s your kind of Saturday, you\'ll fit right in.',

  about: {
    history:
      'The Minnesota 4x4 Brothers started in 1967 when a handful of guys with dirt on their ' +
      'boots and lockers in their axles decided a club was long overdue. What began as informal ' +
      'weekend runs through the Minnesota backwoods became one of the longest-running four-wheel ' +
      'drive clubs in the state. Decades later, the faces have changed but the approach hasn\'t — ' +
      'we find hard lines, we run them with spotters, and we recover our own. The rigs have gotten ' +
      'bigger and the lifts have gotten taller, but the club still runs on trust, trail knowledge, ' +
      'and a healthy respect for what\'s waiting on the other side of that ridge.',
    mission:
      'We\'re here to wheel — hard when the terrain calls for it, smart always. We protect trail ' +
      'access by using it responsibly, and we build the kind of community where the guy who bent ' +
      'his Dana 44 last spring shows up first to help the new member figure out lockers this fall.',
    values: [
      { title: 'Community',   description: 'We recover together. On the trail and off, you can count on us to show up when it counts.' },
      { title: 'Respect',     description: 'Respect the land or lose it. We tread lightly, pack it out, and leave what we find.' },
      { title: 'Adventure',   description: 'The comfortable line isn\'t always the right one. We push where it matters and back off when it doesn\'t.' },
      { title: 'Stewardship', description: 'We dig water bars, pack out trash, and fight for trail access. The trail doesn\'t maintain itself.' },
    ],
  },

  milestones: [
    { year: 1967, title: 'Club Founded',       description: 'A small crew of dirt-boot regulars formalize what had been loose weekend runs into an official club.' },
    { year: 1975, title: 'First Organized Run', description: 'The club holds its first structured trail run with spotters, recovery gear, and a route sheet.' },
    { year: 1983, title: 'Trail Stewardship',   description: 'Members adopt a stretch of trail and begin organized maintenance — water bars, drainage, and cleanup days.' },
    { year: 1995, title: 'Club Constitution',   description: 'Formal bylaws and a code of conduct adopted, creating the membership sponsorship model still used today.' },
    { year: 2005, title: 'Online Community',    description: 'Forum launched. Run reports, trail conditions, and build threads move online for the first time.' },
    { year: 2018, title: 'Next Generation',     description: 'Membership doubles as the next wave of off-road enthusiasts joins — newer rigs, same commitment to the dirt.' },
  ],

  membership: {
    howToJoin:
      'The best way in is to show up to a run. We don\'t do applications — we do trail time. ' +
      'Come out, meet the crew, wheel your rig, and see if this is your kind of club. ' +
      'If it is, a current member will sponsor you in.',
    requirements: [
      'Attend at least two club runs',
      'Be sponsored by an existing member',
      'Agree to the club code of conduct',
      'Annual dues apply after acceptance',
    ],
    ctaText: 'Follow us on Facebook — that\'s where run details and meet-up times get posted.',
  },

  board: [
    {
      name:  'Matt Clemons',
      role:  'President',
      bio:   'Once commanded a riding mower chariot while wearing a bucket on my head.',
      photo: '/presidnt.jpg' as string,
    },
    {
      name:  'Dusty Sami',
      role:  'Vice President',
      bio:   'Bio coming soon.',
      photo: '' as string,
    },
    {
      name:  'TBD',
      role:  'Treasurer',
      bio:   'Bio coming soon.',
      photo: '' as string,
    },
    {
      name:  'TBD',
      role:  'Board Member',
      bio:   'Bio coming soon.',
      photo: '' as string,
    },
    {
      name:  'TBD',
      role:  'Board Member',
      bio:   'Bio coming soon.',
      photo: '' as string,
    },
  ],

  social: {
    facebook: 'https://www.facebook.com/groups/253653171083360/',
  },
} as const

export default club
