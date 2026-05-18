#!/usr/bin/env bash
# promote.sh — promote the current preview build to production
# Saves the previous production build for one-step rollback.
set -euo pipefail

DEPLOY_ROOT="/var/www/mn4x4"
PREVIEW_LINK="${DEPLOY_ROOT}/preview"
CURRENT_LINK="${DEPLOY_ROOT}/current"
PREVIOUS_LINK="${DEPLOY_ROOT}/previous"

# ── 1. Verify preview exists ────────────────────────────────────────────────

if [ ! -L "$PREVIEW_LINK" ]; then
    echo "ERROR: No preview deployment found. Run deploy-preview.sh first."
    exit 1
fi

PREVIEW_BUILD=$(readlink "$PREVIEW_LINK")
PREVIEW_HASH=$(basename "$PREVIEW_BUILD" | sed 's/build-//')

if [ ! -d "$PREVIEW_BUILD" ]; then
    echo "ERROR: Preview build directory ${PREVIEW_BUILD} no longer exists."
    exit 1
fi

# ── 2. Read current production state ────────────────────────────────────────

if [ -L "$CURRENT_LINK" ]; then
    CURRENT_BUILD=$(readlink "$CURRENT_LINK")
    CURRENT_HASH=$(basename "$CURRENT_BUILD" | sed 's/build-//')

    if [ "$PREVIEW_BUILD" = "$CURRENT_BUILD" ]; then
        echo "ERROR: Preview and production are already on the same build (${CURRENT_HASH})."
        echo "Nothing to promote."
        exit 1
    fi

    HAS_CURRENT=true
else
    CURRENT_BUILD=""
    CURRENT_HASH="(none)"
    HAS_CURRENT=false
fi

# Read promote target's commit message from deploy.json
PROMOTE_MSG=$(python3 -c "
import json, sys
try:
    with open('${PREVIEW_BUILD}/deploy.json') as f:
        print(json.load(f).get('message', ''))
except Exception:
    print('')
" 2>/dev/null || echo "")

echo "=== Promote to production ==="
echo "    ${PREVIEW_HASH}: ${PROMOTE_MSG}"
echo "    (was: ${CURRENT_HASH})"
echo ""

# ── 3. Save current as previous ─────────────────────────────────────────────

if [ "$HAS_CURRENT" = true ]; then
    ln -sfn "$CURRENT_BUILD" "$PREVIOUS_LINK"
fi

# ── 4. Promote preview to current ───────────────────────────────────────────

echo "→ Promoting ${PREVIEW_HASH} to production..."
ln -sfn "$PREVIEW_BUILD" "$CURRENT_LINK"

PROMOTED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Update deploy.json to record promotion
python3 -c "
import json
try:
    with open('${PREVIEW_BUILD}/deploy.json') as f:
        d = json.load(f)
    d['environment'] = 'production'
    d['promoted_at'] = '${PROMOTED_AT}'
    with open('${PREVIEW_BUILD}/deploy.json', 'w') as f:
        json.dump(d, f, indent=2)
except Exception:
    pass
" 2>/dev/null || true

# ── 5. Smoke test — auto-rollback on failure ─────────────────────────────────

echo "→ Smoke testing https://mn4x4.org..."
sleep 1

HTTP_BODY=$(mktemp)
HTTP_STATUS=$(curl -sf -L -o "$HTTP_BODY" -w "%{http_code}" \
    --connect-timeout 10 --max-time 20 \
    https://mn4x4.org || echo "000")

SMOKE_OK=true

if [ "$HTTP_STATUS" != "200" ]; then
    echo "ERROR: Smoke test failed — HTTP ${HTTP_STATUS} from mn4x4.org"
    SMOKE_OK=false
fi

if $SMOKE_OK && ! grep -qi "4x4" "$HTTP_BODY"; then
    echo "ERROR: Smoke test failed — response body does not look like the mn4x4 site"
    SMOKE_OK=false
fi

rm -f "$HTTP_BODY"

if [ "$SMOKE_OK" = false ]; then
    echo ""
    echo "Auto-rolling back to ${CURRENT_HASH}..."
    if [ "$HAS_CURRENT" = true ]; then
        ln -sfn "$CURRENT_BUILD" "$CURRENT_LINK"
        echo "Rolled back. Production is still serving ${CURRENT_HASH}."
    else
        rm -f "$CURRENT_LINK"
        echo "Rolled back (no previous build — production symlink removed)."
    fi
    exit 1
fi

# ── 6. Done ─────────────────────────────────────────────────────────────────

echo ""
echo "✓ Production updated"
echo "  Deployed: ${PREVIEW_HASH} — ${PROMOTE_MSG}"
if [ "$HAS_CURRENT" = true ]; then
    echo "  Previous: ${CURRENT_HASH} (saved for rollback)"
fi
echo "  URL:      https://mn4x4.org"
echo "  Time:     ${PROMOTED_AT}"
