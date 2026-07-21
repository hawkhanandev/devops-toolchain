#!/usr/bin/env bash
# =============================================================================
# install-docker.sh
# Installs Docker Engine on Ubuntu / Debian using the official Docker apt repo.
# Reference: https://docs.docker.com/engine/install/ubuntu/
#
# Usage:
#   chmod +x install-docker.sh
#   ./install-docker.sh
# =============================================================================

set -euo pipefail

# ── Colour helpers ────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

# ── Root check ────────────────────────────────────────────────────────────────
if [[ "$EUID" -ne 0 ]]; then
  error "Please run as root:  sudo ./install-docker.sh"
fi

# ── Detect OS ─────────────────────────────────────────────────────────────────
if [[ ! -f /etc/os-release ]]; then
  error "Cannot detect OS. /etc/os-release not found."
fi
source /etc/os-release
info "Detected OS: $NAME ($ID)"

if [[ "$ID" != "ubuntu" && "$ID" != "debian" ]]; then
  warn "This script targets Ubuntu/Debian. Detected: $ID. Proceeding anyway..."
fi

# ── Step 1 — Remove old / conflicting packages ───────────────────────────────
info "[1/6] Removing any old Docker packages..."
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do
  apt-get remove -y "$pkg" 2>/dev/null || true
done

# ── Step 2 — Install prerequisites ───────────────────────────────────────────
info "[2/6] Installing prerequisites..."
apt-get update -y
apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  apt-transport-https

# ── Step 3 — Add Docker's official GPG key ───────────────────────────────────
info "[3/6] Adding Docker GPG key..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL "https://download.docker.com/linux/${ID}/gpg" \
  | gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# ── Step 4 — Add Docker apt repository ───────────────────────────────────────
info "[4/6] Adding Docker apt repository..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/${ID} \
$(lsb_release -cs) stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y

# ── Step 5 — Install Docker Engine, CLI, Containerd & Docker Compose ─────────
info "[5/6] Installing Docker Engine..."
apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin

# ── Step 6 — Post-install setup ───────────────────────────────────────────────
info "[6/6] Post-install configuration..."

# Enable and start Docker service
systemctl enable docker
systemctl start docker

# Add the invoking (non-root) user to the docker group so sudo is not needed
INVOKING_USER="${SUDO_USER:-$USER}"
if [[ -n "$INVOKING_USER" && "$INVOKING_USER" != "root" ]]; then
  usermod -aG docker "$INVOKING_USER"
  info "User '$INVOKING_USER' added to the 'docker' group."
  warn "Log out and back in (or run 'newgrp docker') for group membership to take effect."
fi

# ── Verify installation ───────────────────────────────────────────────────────
echo ""
info "============================================================"
info " Docker installation complete! Versions installed:"
info "============================================================"
docker --version
docker compose version
echo ""
info "Run a smoke test:  docker run --rm hello-world"
info "============================================================"
