#!/bin/bash
set -e

# Go to project root
cd "$(dirname "$0")/.."

APP_NAME="MacKeys-Configurator"
# Use a simple ID that matches the expected desktop file name
APP_ID="com.mackeysconfigurator.app"
APP_DIR="dist/AppDir"

echo "Building AppImage for $APP_NAME..."

# 1. Ensure SEA build is ready
if [ ! -f dist/app ] || [ ! -f dist/gtkx.node ]; then
    echo "SEA build not found. Running build:sea first..."
    npm run build:sea
fi

# 2. Prepare AppDir
echo "Preparing AppDir..."
rm -rf "$APP_DIR"
mkdir -p "$APP_DIR/usr/bin"

# Copy binaries
cp dist/app "$APP_DIR/usr/bin/mackeys-configurator"
cp dist/gtkx.node "$APP_DIR/usr/bin/gtkx.node"

# 3. Handle Assets (Icons and Desktop)
# appimagetool expects at least one .desktop file and one icon in the root
cp "$APP_ID.desktop" "$APP_DIR/mackeys-configurator.desktop"
cp assets/icon.png "$APP_DIR/mackeys-configurator.png"

# 4. Create AppRun (The entry point)
echo "Creating AppRun..."
cat > "$APP_DIR/AppRun" <<EOF
#!/bin/sh
HERE=\$(dirname "\$(readlink -f "\$0")")
export LD_LIBRARY_PATH="\$HERE/usr/lib:\$LD_LIBRARY_PATH"
exec "\$HERE/usr/bin/mackeys-configurator" "\$@"
EOF
chmod +x "$APP_DIR/AppRun"

# 5. Get/Update appimagetool
if [ ! -f ./appimagetool ]; then
    echo "Downloading appimagetool..."
    curl -Lo appimagetool https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage
    chmod +x appimagetool
fi

# 6. Build AppImage
echo "Generating AppImage..."
export ARCH=x86_64
./appimagetool --appimage-extract-and-run "$APP_DIR" "$APP_NAME-x86_64.AppImage"

echo ""
echo "AppImage build complete!"
echo "File: $APP_NAME-x86_64.AppImage"
