const club = {
  name: 'Minnesota 4x4 Brothers',
  shortName: 'MN 4x4 Brothers',
  established: 1967,
  tagline: 'Built Tough. Built Together.',
  description:
    'The Minnesota 4x4 Brothers is an off-road club based in the great state of Minnesota. ' +
    'We are a group of passionate four-wheel drive enthusiasts who love exploring trails, ' +
    'getting muddy, and helping each other out on and off the trail. ' +
    'Established in 1967, we have been a fixture in the Minnesota off-road community for decades.',

  about: {
    history:
      'The Minnesota 4x4 Brothers was founded in 1967 by a small group of off-road enthusiasts ' +
      'who wanted to share their love of four-wheeling with like-minded Minnesotans. ' +
      'What started as informal weekend runs has grown into one of Minnesota\'s longest-running ' +
      'four-wheel drive clubs, with members across the state and a tradition of camaraderie ' +
      'that has lasted generations. [More history coming soon]',
    mission:
      'We are dedicated to responsible off-road recreation, trail preservation, and building ' +
      'a community where experienced wheelers and newcomers alike feel welcome.',
    values: [
      { title: 'Community', description: 'We look out for each other on the trail and off.' },
      { title: 'Respect', description: 'Respect the land, the trails, and fellow members.' },
      { title: 'Adventure', description: 'Push limits, try new trails, and never stop exploring.' },
      { title: 'Stewardship', description: 'Leave trails better than we found them.' },
    ],
  },

  membership: {
    howToJoin:
      'The best way to join the 4x4 Brothers is to come out to a run first. ' +
      'We want to meet you on the trail — show us your rig and spend a day wheeling with us. ' +
      'After attending a run, you\'re welcome to apply for membership.',
    requirements: [
      'Attend at least one club run',
      'Be sponsored by an existing member',
      'Agree to the club code of conduct',
      'Annual dues apply after acceptance',
    ],
    ctaText: 'Find us on Facebook to get notified about upcoming runs.',
  },

  social: {
    facebook: 'https://www.facebook.com/groups/253653171083360/',
  },
} as const

export default club
