#!/usr/bin/env bash
# deploy-preview.sh — build and deploy to preview.mn4x4.org
# Requires: clean git working tree, /var/www/mn4x4 owned by current user.
set -euo pipefail

DEPLOY_ROOT="/var/www/mn4x4"
BUILD_DIR="${DEPLOY_ROOT}/builds"
PREVIEW_LINK="${DEPLOY_ROOT}/preview"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"

cd "$PROJECT_DIR"

# ── 1. Deploy root sanity check ─────────────────────────────────────────────

if [ ! -d "$BUILD_DIR" ] || [ ! -w "$BUILD_DIR" ]; then
    echo "ERROR: ${BUILD_DIR} is missing or not writable."
    echo "Run .pi/skills/deploy/scripts/setup.sh first."
    exit 1
fi

# ── 2. Require clean git working tree ───────────────────────────────────────

if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "ERROR: Uncommitted changes detected. Please commit all changes before deploying."
    echo ""
    git status --short
    exit 1
fi

# ── 3. Gather git metadata ──────────────────────────────────────────────────

GIT_HASH=$(git rev-parse --short HEAD)
GIT_MSG=$(git log -1 --pretty=%s)
BUILD_NAME="build-${GIT_HASH}"
BUILD_PATH="${BUILD_DIR}/${BUILD_NAME}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "=== Deploy to preview: ${GIT_HASH} ==="
echo "    ${GIT_MSG}"
echo ""

# ── 4. Lint ─────────────────────────────────────────────────────────────────

echo "→ Linting..."
npm run lint

# ── 5. Build ────────────────────────────────────────────────────────────────

echo ""
echo "→ Building..."
npm run build

# ── 6. Sync to versioned build dir ──────────────────────────────────────────

echo ""
echo "→ Syncing dist/ → ${BUILD_PATH}/"
mkdir -p "$BUILD_PATH"
rsync -a --delete dist/ "${BUILD_PATH}/"

# Write deploy manifest
cat > "${BUILD_PATH}/deploy.json" <<EOF
{
  "hash": "${GIT_HASH}",
  "message": $(printf '%s' "$GIT_MSG" | python3 -c "import json,sys; print(json.dumps(sys.stdin.read()))"),
  "timestamp": "${TIMESTAMP}",
  "deployed_by": "$(whoami)",
  "environment": "preview"
}
EOF

echo "✓ Build synced"

# ── 7. Point preview symlink at new build ───────────────────────────────────

echo "→ Updating preview symlink..."
ln -sfn "$BUILD_PATH" "$PREVIEW_LINK"

# ── 8. Prune old builds (keep 3, never delete current/previous/preview) ─────

echo "→ Pruning old builds..."
CURRENT_BUILD=$(readlink "${DEPLOY_ROOT}/current" 2>/dev/null || echo "")
PREVIOUS_BUILD=$(readlink "${DEPLOY_ROOT}/previous" 2>/dev/null || echo "")
PREVIEW_BUILD=$(readlink "$PREVIEW_LINK")

# Sort by modification time, skip the 3 newest
mapfile -t ALL_BUILDS < <(ls -dt "${BUILD_DIR}"/build-* 2>/dev/null)
if [ "${#ALL_BUILDS[@]}" -gt 3 ]; then
    for old_build in "${ALL_BUILDS[@]:3}"; do
        if [ "$old_build" != "$CURRENT_BUILD" ] && \
           [ "$old_build" != "$PREVIOUS_BUILD" ] && \
           [ "$old_build" != "$PREVIEW_BUILD" ]; then
            echo "  Removing $(basename "$old_build")"
            rm -rf "$old_build"
        fi
    done
fi

# ── 9. Smoke test ───────────────────────────────────────────────────────────

echo "→ Smoke testing https://preview.mn4x4.org..."
sleep 1  # brief pause for Caddy to pick up the new symlink target

HTTP_BODY=$(mktemp)
HTTP_STATUS=$(curl -sf -L -o "$HTTP_BODY" -w "%{http_code}" \
    --connect-timeout 10 --max-time 20 \
    https://preview.mn4x4.org || echo "000")

if [ "$HTTP_STATUS" != "200" ]; then
    echo "ERROR: Smoke test failed — HTTP ${HTTP_STATUS} from preview.mn4x4.org"
    rm -f "$HTTP_BODY"
    exit 1
fi

if ! grep -qi "4x4" "$HTTP_BODY"; then
    echo "ERROR: Smoke test failed — response body does not look like the mn4x4 site"
    rm -f "$HTTP_BODY"
    exit 1
fi

rm -f "$HTTP_BODY"

# ── 10. Done ─────────────────────────────────────────────────────────────────

echo ""
echo "✓ Preview deployed"
echo "  Commit:  ${GIT_HASH}"
echo "  Message: ${GIT_MSG}"
echo "  URL:     https://preview.mn4x4.org"
echo "  Time:    ${TIMESTAMP}"
