# Application Icons

Place the following icon files in this directory before building installers:

## Required Files

- `icon.icns` - macOS application icon
- `icon.ico` - Windows application icon
- `icon_16x16.png` through `icon_512x512.png` - Linux icons

## How to Generate Icons

See the [../README.md](../README.md) for detailed instructions on generating icons.

Quick method using electron-icon-builder:

```bash
npm install -g electron-icon-builder
electron-icon-builder --input=./your-master-icon.png --output=./build/icons
```

## Temporary Solution

For development/testing, electron-builder will use Electron's default icon if these files are missing.

For production releases, custom icons are strongly recommended for branding and professionalism.
