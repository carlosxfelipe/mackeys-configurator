#!/bin/bash
set -e

# Go to project root
cd "$(dirname "$0")/.."

APP_NAME="MacKeys-Configurator"
# Use a simple ID that matches the expected desktop file name
APP_ID="com.mackeysconfigurator.app"
APP_DIR="dist/AppDir"

# 1. Get version from package.json
VERSION=$(node -e "console.log(require('./package.json').version)")
echo "Building AppImage for $APP_NAME version $VERSION..."

# 2. Ensure SEA build is ready
if [ ! -f dist/app ] || [ ! -f dist/gtkx.node ]; then
    echo "SEA build not found. Running build:sea first..."
    npm run build:sea
fi

# 3. Prepare AppDir
echo "Preparing AppDir..."
rm -rf "$APP_DIR"
mkdir -p "$APP_DIR/usr/bin"

# Copy binaries
cp dist/app "$APP_DIR/usr/bin/mackeys-configurator"
cp dist/gtkx.node "$APP_DIR/usr/bin/gtkx.node"

# 4. Handle Assets (Icons and Desktop)
# appimagetool expects at least one .desktop file and one icon in the root
cp "$APP_ID.desktop" "$APP_DIR/mackeys-configurator.desktop"
cp assets/icon.png "$APP_DIR/mackeys-configurator.png"

# Install .desktop also in the standard path (required by appstreamcli)
mkdir -p "$APP_DIR/usr/share/applications"
cp "$APP_ID.desktop" "$APP_DIR/usr/share/applications/$APP_ID.desktop"

# AppStream metadata — must use the component ID as filename to pass validation
mkdir -p "$APP_DIR/usr/share/metainfo"
cp "assets/$APP_ID.appdata.xml" "$APP_DIR/usr/share/metainfo/$APP_ID.appdata.xml"

# 5. Create AppRun (The entry point)
echo "Creating AppRun..."
cat > "$APP_DIR/AppRun" <<EOF
#!/bin/sh
HERE=\$(dirname "\$(readlink -f "\$0")")
export LD_LIBRARY_PATH="\$HERE/usr/lib:\$LD_LIBRARY_PATH"
exec "\$HERE/usr/bin/mackeys-configurator" "\$@"
EOF
chmod +x "$APP_DIR/AppRun"

# 6. Get/Update appimagetool
if [ ! -f ./appimagetool ]; then
    echo "Downloading appimagetool..."
    curl -Lo appimagetool https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage
    chmod +x appimagetool
fi

# 7. Build AppImage
echo "Generating AppImage..."
export ARCH=x86_64
OUTPUT_FILE="$APP_NAME-$VERSION-x86_64.AppImage"
./appimagetool --appimage-extract-and-run "$APP_DIR" "$OUTPUT_FILE"

echo ""
echo "AppImage build complete!"
echo "File: $OUTPUT_FILE"
