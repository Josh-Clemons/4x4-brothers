// Feature flags — gate in-progress work out of production.
//
// Flags default OFF. Enable one by setting the matching env var to "true"
// (e.g. in .env.local or the build environment):
//
//   VITE_FLAG_EVENTS=true
//   VITE_FLAG_ABOUT_HISTORY=true
//   VITE_FLAG_ABOUT_MILESTONES=true
//   VITE_FLAG_ABOUT_VALUES=true
//   VITE_FLAG_GALLERY=true
//   VITE_FLAG_RIGS=true
//   VITE_FLAG_PHOTO_SUBMIT=true
//
// Vite inlines import.meta.env at build time, so flag state is fixed per build.
const enabled = (value: string | undefined): boolean => value === 'true'

export const flags = {
  /**
   * Events — /events route, nav/footer links, and the Home page hero CTA +
   * "Upcoming Runs" teaser. Off = no event content anywhere on the site.
   */
  eventsEnabled: enabled(import.meta.env.VITE_FLAG_EVENTS),
  /** About page — "Our History" section. */
  aboutHistory: enabled(import.meta.env.VITE_FLAG_ABOUT_HISTORY),
  /** About page — "Milestones" timeline. */
  aboutMilestones: enabled(import.meta.env.VITE_FLAG_ABOUT_MILESTONES),
  /** About page — "What Drives Us" core values. */
  aboutValues: enabled(import.meta.env.VITE_FLAG_ABOUT_VALUES),
  /**
   * Gallery — /gallery route, /gallery/:albumId views, nav/footer links, and
   * "View Photos" links on event cards. Off = no gallery anywhere on the site.
   */
  galleryEnabled: enabled(import.meta.env.VITE_FLAG_GALLERY),
  /** Member rigs showcase — /rigs route plus its nav/footer links. */
  rigsEnabled: enabled(import.meta.env.VITE_FLAG_RIGS),
  /**
   * "Submit Photos" buttons on the Gallery/Rigs heroes + the submission
   * modal. Keep off until report-service accepts type 'photo_submission'
   * (see docs/photo-submissions.md), or submissions will 400. Direct upload
   * additionally needs the photo-upload Worker deployed and
   * VITE_TURNSTILE_SITE_KEY set; without the key the modal falls back to the
   * link-only form.
   */
  photoSubmitEnabled: enabled(import.meta.env.VITE_FLAG_PHOTO_SUBMIT),
} as const
