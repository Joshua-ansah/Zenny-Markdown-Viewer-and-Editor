# Build Resources

This directory contains resources needed for building installers for Zenny Markdown Viewer.

## Icons Directory

The `icons/` subdirectory should contain application icons for different platforms:

### Required Icon Files

#### macOS
- **icon.icns** - macOS application icon
  - Required sizes: 16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024
  - Format: Apple Icon Image (.icns)
  - Can be generated from a 1024x1024 PNG using tools like:
    - `iconutil` (built into macOS)
    - [png2icns](https://github.com/akameco/png2icns)
    - Online converters

#### Windows
- **icon.ico** - Windows application icon
  - Required sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
  - Format: Windows Icon (.ico)
  - Can be generated from PNG files using tools like:
    - [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder)
    - [ImageMagick](https://imagemagick.org/)
    - Online converters

#### Linux
- **PNG files** - Various sizes for different contexts
  - Recommended sizes:
    - icon_16x16.png
    - icon_32x32.png
    - icon_48x48.png
    - icon_64x64.png
    - icon_128x128.png
    - icon_256x256.png
    - icon_512x512.png
  - Format: PNG with transparency
  - electron-builder will automatically use these for AppImage, deb, rpm packages

### Generating Icons

The easiest approach is to:

1. Create a **master icon** at 1024x1024 PNG with transparency
2. Use `electron-icon-builder` to generate all platform icons:

```bash
npm install -g electron-icon-builder

# Generate icons from a master PNG
electron-icon-builder --input=./master-icon.png --output=./build/icons
```

This will generate:
- `icon.icns` for macOS
- `icon.ico` for Windows
- Multiple PNG sizes for Linux

### Design Guidelines

For best results, the application icon should:

- **Simple and recognizable** at small sizes (16x16)
- **Square aspect ratio** with rounded corners optional
- **Transparent background** (PNG/ICNS) or solid color (ICO)
- **Centered content** with padding around edges (10-15% margin)
- **High contrast** for visibility on light and dark backgrounds
- **Represent markdown** - consider using:
  - A stylized "M" or "MD" letter
  - Markdown syntax symbols (# or >)
  - Document/page icon metaphor
  - Pen/pencil for editing concept

### Placeholder Icons

If you don't have custom icons yet, you can use Electron's default icon temporarily:

```bash
# The build will use Electron's default icon if files are missing
# This is fine for development/testing, but not for production releases
```

### License and Attribution

When using custom icons:
- Ensure you have proper rights to use the icon design
- Include attribution if required by the icon's license
- Consider open-source icon sets like:
  - [Heroicons](https://heroicons.com/)
  - [Feather Icons](https://feathericons.com/)
  - [Material Icons](https://fonts.google.com/icons)

## DMG Background (macOS)

Optional: Add a custom background image for macOS DMG installer:
- File: `background/mac-installer-bg.png`
- Size: 540x380 pixels (or 1080x760 for Retina)
- Shows during macOS drag-to-Applications installation

## Code Signing

For production releases, you'll need:

### macOS
- Apple Developer account ($99/year)
- Developer ID Application certificate
- Notarization enabled
- Add these to electron-builder.yml:
  ```yaml
  mac:
    identity: "Developer ID Application: Your Name (TEAMID)"
    hardenedRuntime: true
  ```

### Windows
- Code signing certificate (~$100-500/year)
- Install certificate on build machine
- electron-builder will auto-detect and use it

### Linux
- No code signing required for Linux distributions
- Users can verify checksums instead

## Building Installers

After setting up icons, use these commands:

```bash
# Build for current platform
npm run dist

# Build for specific platform
npm run dist:win    # Windows NSIS installer
npm run dist:mac    # macOS DMG and ZIP
npm run dist:linux  # Linux AppImage, deb, rpm

# Package without creating installer (for testing)
npm run package
```

Output will be in the `release/` directory.
