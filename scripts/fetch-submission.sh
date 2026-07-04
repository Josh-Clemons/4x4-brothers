#!/usr/bin/env bash
# Fetch directly-uploaded photo submissions from the private R2 quarantine
# bucket (mn4x4-photo-submissions, written by workers/photo-upload) so they
# can be reviewed and ingested with add-photo.sh.
#
# Usage:
#   scripts/fetch-submission.sh <key>...
#
# Keys come straight off the 📸 Matrix card, e.g.:
#   scripts/fetch-submission.sh 'submissions/2026-07-04-a1b2c3d4/00-my-rig.jpg'
#
# Files land in ~/photo-submissions/<submissionId>/ — review them there, then
# run add-photo.sh per photo as usual. Objects in the bucket auto-delete after
# 60 days, so unclaimed submissions clean themselves up.
set -euo pipefail

BUCKET="mn4x4-photo-submissions"
OUT_ROOT="${OUT_ROOT:-$HOME/photo-submissions}"
WORKER_DIR="$(cd "$(dirname "$0")/../workers/photo-upload" && pwd)"

if [[ $# -lt 1 ]]; then
  echo "usage: $0 <key>..." >&2
  exit 1
fi

for key in "$@"; do
  if [[ ! "$key" =~ ^submissions/[A-Za-z0-9._/-]+$ ]]; then
    echo "skipping suspicious key: $key" >&2
    continue
  fi
  submission_id="$(basename "$(dirname "$key")")"
  outdir="$OUT_ROOT/$submission_id"
  mkdir -p "$outdir"
  outfile="$outdir/$(basename "$key")"
  echo "→ $key"
  # Run from the worker dir so wrangler resolves the account from wrangler.toml
  (cd "$WORKER_DIR" && npx wrangler r2 object get "$BUCKET/$key" --file "$outfile")
done

echo
echo "Done. Review in $OUT_ROOT, then ingest with scripts/add-photo.sh."
