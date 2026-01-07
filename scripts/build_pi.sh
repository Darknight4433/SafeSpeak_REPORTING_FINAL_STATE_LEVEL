#!/usr/bin/env bash
set -euo pipefail
ARCH=${1:-arm64}

# Usage: ./scripts/build_pi.sh arm64|armv7
# Ensure you have sufficient swap during builds.
export NODE_OPTIONS="--max-old-space-size=4096"

echo "Installing dependencies (no audit, no fund)..."
npm install --no-audit --no-fund

echo "Building web app..."
npm run build

if [ "$ARCH" = "arm64" ]; then
  echo "Building electron (arm64)..."
  npx electron-builder --linux --arm64
else
  echo "Building electron (armv7)..."
  npx electron-builder --linux --armv7
fi

echo "Done. Artifacts are in dist_electron/"
