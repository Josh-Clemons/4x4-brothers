const club = {
  name: 'Minnesota 4x4 Brothers',
  shortName: 'MN 4x4 Brothers',
  established: 1967,
  tagline: 'Good Trails. Good People. Since 1967.',
  description:
    'The Minnesota 4x4 Brothers have been at this since 1967. We\'re a family friendly club ' +
    'that likes picking a line and spotting each other through it. ' +
    'New folks are always welcome - show up and we\'ll get you sorted.',

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
      'Our mission is pretty simple: enjoy the trails, treat the land right so it\'s still open ' +
      'to us down the road, and take care of the people we\'re out there with. Everybody\'s ' +
      'welcome — families, new wheelers, folks still learning their rigs. Somebody here has been ' +
      'through whatever you\'re working on and is glad to lend a hand.',
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
      'Easiest way to join is to come to a run and say hi. We\'re not big on paperwork — ' +
      'spend some trail time with us, get to know the crew, and if it feels like a good fit, ' +
      'a current member will sponsor you in. That\'s really all there is to it.',
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
      photo: '/board/presidnt.webp' as string,
    },
    {
      name:  'Kyle Quitter',
      role:  'Vice President',
      bio:   'Bio coming soon.',
      photo: '/board/kyle.webp' as string,
    },
    {
      name:  'Dusty Winegar',
      role:  'Board Member',
      bio:   'Wheeling since before I was born.',
      photo: '/board/dusty.webp' as string,
    },
    {
      name:  'Joe Heinonen',
      role:  'Board Member',
      bio:   'Bio coming soon.',
      photo: '' as string,
    },
    {
      name:  'Stephanie Guzzy',
      role:  'Treasurer',
      bio:   'Go Vikings!',
      photo: '/board/steph.webp' as string,
    },
  ],

  social: {
    facebook: 'https://www.facebook.com/groups/253653171083360/',
  },
} as const

export default club
