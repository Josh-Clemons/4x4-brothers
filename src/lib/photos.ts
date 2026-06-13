// Photo delivery via Cloudflare Image Transformations (free tier).
//
// Content photos live on the server OUTSIDE this repo — /var/www/mn4x4/photos,
// served by Caddy at mn4x4.org/photos/ (ingest: scripts/add-photo.sh). The
// /cdn-cgi/image/ prefix has Cloudflare resize, convert (WebP/AVIF), and
// edge-cache them on the way out.
//
// Data files store bare filenames (e.g. 'board-kyle.webp',
// 'memorial-rally-2026-01.jpg'); this is the only place that turns a
// filename into a URL. URLs are absolute so dev/preview builds load photos
// from the production zone.
const ZONE = 'https://mn4x4.org'

/**
 * Delivery sizes. All fit=scale-down — CSS does the cropping, so a
 * server-side crop never fights an object-position override (e.g. Kyle's
 * top-anchored board photo). metadata=none strips EXIF/GPS on delivery
 * (originals are already stripped on ingest — belt and suspenders).
 *
 *   thumb — 400px  (grid thumbnails)
 *   card  — 800px  (board/rig cards)
 *   full  — 1600px (lightbox)
 */
export type ImageVariant = 'thumb' | 'card' | 'full'

const VARIANT_WIDTH: Record<ImageVariant, number> = {
  thumb: 400,
  card: 800,
  full: 1600,
}

export const photoUrl = (file: string, variant: ImageVariant = 'card') =>
  `${ZONE}/cdn-cgi/image/width=${VARIANT_WIDTH[variant]},fit=scale-down,format=auto,metadata=none/photos/${file}`
