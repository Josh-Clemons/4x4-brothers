// Feature flags — gate in-progress work out of production.
//
// Flags default OFF. Enable one by setting the matching env var to "true"
// (e.g. in .env.local or the build environment):
//
//   VITE_FLAG_ABOUT_HISTORY=true
//   VITE_FLAG_ABOUT_MILESTONES=true
//   VITE_FLAG_ABOUT_VALUES=true
//
// Vite inlines import.meta.env at build time, so flag state is fixed per build.
const enabled = (value: string | undefined): boolean => value === 'true'

export const flags = {
  /** About page — "Our History" section. */
  aboutHistory: enabled(import.meta.env.VITE_FLAG_ABOUT_HISTORY),
  /** About page — "Milestones" timeline. */
  aboutMilestones: enabled(import.meta.env.VITE_FLAG_ABOUT_MILESTONES),
  /** About page — "What Drives Us" core values. */
  aboutValues: enabled(import.meta.env.VITE_FLAG_ABOUT_VALUES),
} as const
