#!/usr/bin/env bash
# Add a photo to the site's photo store — /var/www/mn4x4/photos, served at
# mn4x4.org/photos/ and resized at the Cloudflare edge (see src/lib/photos.ts).
#
# Usage:
#   scripts/add-photo.sh <photo-name> <source-file>
#
# Example:
#   scripts/add-photo.sh memorial-rally-2026-01.jpg ~/photos/IMG_4821.jpg
#
# Naming conventions (see src/data/albums.ts, rigs.ts, club.ts):
#   board-<name>.<ext>      board-kyle.webp
#   <albumId>-NN.<ext>      memorial-rally-2026-01.jpg
#   rig-<owner>-NN.<ext>    rig-dusty-01.jpg
#
# Before anything hits the web root, the photo is:
#   - auto-oriented (bakes EXIF rotation into the pixels, so stripping
#     metadata doesn't leave phone photos sideways)
#   - stripped of all metadata — EXIF/GPS never reaches the web root
#   - capped at 2560px on the longest edge — bounds what Cloudflare pulls
#     through the home tunnel on a cache miss (largest delivered size is 1600)
set -euo pipefail

PHOTOS_DIR="${PHOTOS_DIR:-/var/www/mn4x4/photos}"

if [[ $# -ne 2 ]]; then
  echo "usage: $0 <photo-name> <source-file>" >&2
  exit 1
fi

name="$1"
src="$2"
[[ -f "$src" ]] || { echo "no such file: $src" >&2; exit 1; }
[[ -d "$PHOTOS_DIR" ]] || {
  echo "photos dir missing: $PHOTOS_DIR (create it or set PHOTOS_DIR)" >&2
  exit 1
}

if command -v magick >/dev/null 2>&1; then
  im=(magick)
elif command -v convert >/dev/null 2>&1; then
  im=(convert)
else
  echo "ImageMagick not found — install it first (apt install imagemagick)" >&2
  exit 1
fi

dest="$PHOTOS_DIR/$name"
# Photo names are effectively immutable: the edge caches them for a year.
[[ -e "$dest" ]] && { echo "already exists: $dest (pick a new name)" >&2; exit 1; }

"${im[@]}" "$src" -auto-orient -strip -resize '2560x2560>' "$dest"
echo "added: $dest"
echo "url:   https://mn4x4.org/photos/$name"
