#!/bin/bash
set -e

# Go to project root
cd "$(dirname "$0")/.."

echo "Building Flatpak..."

# Check if flatpak-builder is installed
if ! command -v flatpak-builder &> /dev/null; then
    echo "Error: flatpak-builder is not installed."
    exit 1
fi

# Ensure we have the bundle
if [ ! -f dist/bundle.cjs ]; then
    echo "Dist bundle not found. Running bundle first..."
    npm run bundle
fi

# Build Flatpak
flatpak-builder --force-clean --user --install --repo=repo build-dir com.mackeysconfigurator.app.yaml

echo ""
echo "Flatpak build complete!"
echo "If successful, you can run it with: flatpak run com.mackeysconfigurator.app"
