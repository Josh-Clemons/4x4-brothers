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
  {
    id: 'josh-tina',
    owner: 'Josh C.',
    vehicle: '\'96 Ranger on \'78 Bronco chassis',
    specs: [
      { label: 'Name', value: "Tina" },
      { label: 'Engine',  value: '400M big block' },
    ],
    story:
      'My first rig. Affectionately named Tina (from Napoleon Dynamite), ' +
      'she was best known for making really good dinosaur noises.',
    photos: [
      'rig-josh-01.jpg',
      'rig-josh-02.jpg',
      'rig-josh-03.jpg',
      'rig-josh-04.jpg',
    ],
  },
]

export default rigs
