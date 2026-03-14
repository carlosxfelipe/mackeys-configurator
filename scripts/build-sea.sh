#!/bin/bash
set -e

# Go to project root
cd "$(dirname "$0")/.."

echo "Building Single Executable Application (SEA)..."

# Ensure dist exists and has required files
if [ ! -f dist/bundle.js ]; then
    echo "Dist bundle not found. Running bundle first..."
    npm run bundle
fi

# Generate SEA blob
echo "Generating SEA blob..."
node --experimental-sea-config sea-config.json

# Copy Node binary
echo "Copying Node binary to dist/app..."
cp "$(command -v node)" dist/app

# Inject the SEA blob
echo "Injecting SEA blob using postject..."
npx postject dist/app NODE_SEA_BLOB dist/sea-prep.blob \
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

# Make executable
chmod +x dist/app

echo ""
echo "SEA build complete!"
echo "  Binary: dist/app"
echo "  Native: dist/gtkx.node"
echo ""
echo "To run: ./dist/app"
