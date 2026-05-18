#!/usr/bin/env bash
# setup.sh — one-time server setup for mn4x4.org deployments
# Run manually. Checks prerequisites and prints Caddy/DNS instructions.
set -euo pipefail

DEPLOY_ROOT="/var/www/mn4x4"
DEPLOY_USER="josh"

echo "=== mn4x4.org Deployment Setup ==="
echo ""

# ── 1. Check deploy root ────────────────────────────────────────────────────

if [ -d "$DEPLOY_ROOT" ] && [ -w "$DEPLOY_ROOT" ]; then
    echo "✓ $DEPLOY_ROOT exists and is writable"
else
    echo "✗ $DEPLOY_ROOT is missing or not writable by $DEPLOY_USER."
    echo ""
    echo "Run these commands first, then re-run this script:"
    echo ""
    echo "  sudo mkdir -p ${DEPLOY_ROOT}/builds"
    echo "  sudo chown -R ${DEPLOY_USER}:${DEPLOY_USER} ${DEPLOY_ROOT}"
    echo ""
    exit 1
fi

# ── 2. Create directory structure ───────────────────────────────────────────

mkdir -p "${DEPLOY_ROOT}/builds"
echo "✓ ${DEPLOY_ROOT}/builds ready"

# ── 3. Check rsync ──────────────────────────────────────────────────────────

if command -v rsync &>/dev/null; then
    echo "✓ rsync available"
else
    echo "✗ rsync not found — install with: sudo apt install rsync"
    exit 1
fi

# ── 4. Caddy config ─────────────────────────────────────────────────────────

echo ""
echo "=== Caddy Configuration ==="
echo ""
echo "All public traffic arrives via Cloudflare Tunnel on http://:8080 and is"
echo "routed by Host header. Both changes go inside the existing http://:8080 block."
echo ""
echo "1. Change the mn4x4.org web root (inside the @root handle):"
echo ""
echo "   -  root * /var/www/mn4x4-site"
echo "   +  root * /var/www/mn4x4/current"
echo ""
echo "2. Add a preview block after the @root handle, before the @chat block:"
echo ""
cat <<'CADDY'
    # ---------- preview.mn4x4.org — Staging preview ----------------------------
    @preview host preview.mn4x4.org
    handle @preview {
        root * /var/www/mn4x4/preview
        try_files {path} /index.html
        file_server
    }
CADDY

echo ""
echo "Then reload Caddy:"
echo ""
echo "  sudo systemctl reload caddy"

# ── 5. Cloudflare Tunnel ────────────────────────────────────────────────────

TUNNEL_ID="b7573553-19da-48f1-bc34-afb459e11b6d"

echo ""
echo "=== Cloudflare Tunnel ==="
echo ""
echo "Add preview.mn4x4.org to /etc/cloudflared/config.yml (before the catch-all):"
echo ""
cat <<'TUNNEL'
  # Staging preview
  - hostname: preview.mn4x4.org
    service: http://localhost:8080
    originRequest:
      httpHostHeader: "preview.mn4x4.org"
TUNNEL
echo ""
echo "Register the DNS CNAME with Cloudflare:"
echo ""
echo "  cloudflared tunnel route dns ${TUNNEL_ID} preview.mn4x4.org"
echo ""
echo "Then restart cloudflared:"
echo ""
echo "  sudo systemctl restart cloudflared"

# ── 6. Done ─────────────────────────────────────────────────────────────────

echo ""
echo "=== Done ==="
echo ""
echo "Once Caddy is configured and DNS has propagated, run your first deploy:"
echo "  .pi/skills/deploy/scripts/deploy-preview.sh"
