// Event photo albums — hand-curated. Photos live on the server outside this
// repo (served at mn4x4.org/photos/, resized at the Cloudflare edge — see
// src/lib/photos.ts).
//
// Albums are self-contained: they carry their own id/title/date rather than
// joining against events.ts, because events.ts is a pruned schedule of
// *upcoming* runs with year-less ids (next year's Memorial Rally will reuse
// 'memorial-rally'). `eventId` is only an optional back-link that puts a
// "View Photos" button on the matching event card while that event is listed.
//
// Photo filenames follow `<albumId>-NN.<ext>` — see scripts/add-photo.sh.

export interface AlbumPhoto {
  /** Photo filename, e.g. 'memorial-rally-2026-01.jpg' */
  file: string
  caption?: string
}

export interface Album {
  /** Year-scoped slug — also the /gallery/:albumId route param. */
  id: string
  title: string
  /** ISO date of the run's first day — used for sorting and display. */
  date: string
  /** Optional ClubEvent.id back-link for the Events page "View Photos" button. */
  eventId?: string
  /** Cover photo filename shown on the gallery index. */
  cover: string
  photos: AlbumPhoto[]
}

const albums: Album[] = [
  // Example — uncomment and fill in once the photos are added:
  // {
  //   id: 'memorial-rally-2026',
  //   title: 'Memorial Total Off-Road Rally 2026',
  //   date: '2026-05-22',
  //   eventId: 'memorial-rally',
  //   cover: 'memorial-rally-2026-01.jpg',
  //   photos: [
  //     { file: 'memorial-rally-2026-01.jpg', caption: 'Airing down at the trailhead' },
  //     { file: 'memorial-rally-2026-02.jpg' },
  //   ],
  // },
]

// Newest run first so the gallery leads with the latest album
export default [...albums].sort((a, b) => b.date.localeCompare(a.date))

export const albumById = (id: string) => albums.find(a => a.id === id)

export const albumForEvent = (eventId: string) =>
  albums.find(a => a.eventId === eventId)
