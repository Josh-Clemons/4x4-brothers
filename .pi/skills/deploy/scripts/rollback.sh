#!/usr/bin/env bash
# rollback.sh — swap production back to the previous build
# Use when something breaks in production and you need to revert immediately.
set -euo pipefail

DEPLOY_ROOT="/var/www/mn4x4"
CURRENT_LINK="${DEPLOY_ROOT}/current"
PREVIOUS_LINK="${DEPLOY_ROOT}/previous"

# ── 1. Verify rollback target exists ────────────────────────────────────────

if [ ! -L "$PREVIOUS_LINK" ]; then
    echo "ERROR: No previous build found. Cannot roll back."
    echo "This happens when there has never been a promotion, or the previous"
    echo "build was already used for a rollback."
    exit 1
fi

PREVIOUS_BUILD=$(readlink "$PREVIOUS_LINK")
PREVIOUS_HASH=$(basename "$PREVIOUS_BUILD" | sed 's/build-//')

if [ ! -d "$PREVIOUS_BUILD" ]; then
    echo "ERROR: Previous build directory ${PREVIOUS_BUILD} no longer exists."
    echo "It may have been pruned. Cannot roll back automatically."
    exit 1
fi

CURRENT_BUILD=$(readlink "$CURRENT_LINK" 2>/dev/null || echo "")
CURRENT_HASH=$(basename "$CURRENT_BUILD" | sed 's/build-//' 2>/dev/null || echo "(unknown)")

PREV_MSG=$(python3 -c "
import json, sys
try:
    with open('${PREVIOUS_BUILD}/deploy.json') as f:
        print(json.load(f).get('message', ''))
except Exception:
    print('')
" 2>/dev/null || echo "")

echo "=== Rolling back production ==="
echo "    From: ${CURRENT_HASH}"
echo "    To:   ${PREVIOUS_HASH}: ${PREV_MSG}"
echo ""

# ── 2. Swap current ↔ previous ──────────────────────────────────────────────

echo "→ Swapping symlinks..."
ln -sfn "$PREVIOUS_BUILD" "$CURRENT_LINK"
# Save the old current as previous so you can re-promote if needed
if [ -n "$CURRENT_BUILD" ] && [ -d "$CURRENT_BUILD" ]; then
    ln -sfn "$CURRENT_BUILD" "$PREVIOUS_LINK"
else
    rm -f "$PREVIOUS_LINK"
fi

ROLLED_BACK_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# ── 3. Smoke test ────────────────────────────────────────────────────────────

echo "→ Smoke testing https://mn4x4.org..."
sleep 1

HTTP_BODY=$(mktemp)
HTTP_STATUS=$(curl -sf -L -o "$HTTP_BODY" -w "%{http_code}" \
    --connect-timeout 10 --max-time 20 \
    https://mn4x4.org || echo "000")

if [ "$HTTP_STATUS" != "200" ]; then
    echo "ERROR: Smoke test failed after rollback — HTTP ${HTTP_STATUS}"
    echo "Something is seriously wrong. Check Caddy and /var/www/mn4x4/ manually."
    rm -f "$HTTP_BODY"
    exit 1
fi

if ! grep -qi "mn4x4" "$HTTP_BODY"; then
    echo "ERROR: Smoke test failed after rollback — response body looks wrong."
    echo "Check Caddy and /var/www/mn4x4/ manually."
    rm -f "$HTTP_BODY"
    exit 1
fi

rm -f "$HTTP_BODY"

# ── 4. Done ─────────────────────────────────────────────────────────────────

echo ""
echo "✓ Rolled back"
echo "  Now serving: ${PREVIOUS_HASH} — ${PREV_MSG}"
echo "  Was serving: ${CURRENT_HASH}"
echo "  URL:         https://mn4x4.org"
echo "  Time:        ${ROLLED_BACK_AT}"
