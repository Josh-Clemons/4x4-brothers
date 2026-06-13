// Member rigs showcase — hand-curated. Photos live on the server outside
// this repo (served at mn4x4.org/photos/, resized at the Cloudflare edge —
// see src/lib/photos.ts).
// Filenames follow `rig-<ownerslug>-NN.<ext>` — see scripts/add-photo.sh.

export interface RigSpec {
  /** e.g. 'Tires' */
  label: string
  /** e.g. '37" Patagonias' */
  value: string
}

export interface Rig {
  id: string
  owner: string
  /** e.g. '1997 Jeep TJ' */
  vehicle: string
  /** Lift, tires, lockers, armor… rendered in card order. */
  specs: RigSpec[]
  story?: string
  /** Photo filenames; photos[0] is the cover. */
  photos: string[]
}

const rigs: Rig[] = [
  // Example — uncomment and fill in once the photos are uploaded:
  // {
  //   id: 'dusty-tj',
  //   owner: 'Dusty Winegar',
  //   vehicle: '1997 Jeep TJ',
  //   specs: [
  //     { label: 'Lift',    value: '4" long arm' },
  //     { label: 'Tires',   value: '35" MTs' },
  //     { label: 'Lockers', value: 'Front + rear' },
  //   ],
  //   story: 'Two decades of trail seasons in one tub.',
  //   photos: ['rig-dusty-01.jpg', 'rig-dusty-02.jpg'],
  // },
]

export default rigs
