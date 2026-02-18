# Building and Packaging Zenny

This guide explains how to build and package Zenny Markdown Viewer for distribution.

## Prerequisites

- Node.js 18+ (v18.19.1 or higher recommended)
- npm 9+
- Platform-specific requirements (see below)

## Development Build

Run the application in development mode with hot reload:

```bash
npm run dev
```

This starts Vite dev server with Electron and enables hot module replacement.

## Production Build

Build the application for production (without creating installers):

```bash
npm run build
```

This creates optimized production files in the `dist/` directory:
- `dist/main/` - Main process code
- `dist/preload/` - Preload scripts
- `dist/renderer/` - React UI code

## Packaging

### Package Without Installer

Create a packaged app directory without creating an installer (useful for testing):

```bash
npm run package
```

Output: `release/[platform]-unpacked/`

### Build Installers

#### Current Platform Only

Build installer for your current operating system:

```bash
npm run dist
```

#### Windows

Build Windows NSIS installer (can run on Windows, macOS, or Linux):

```bash
npm run dist:win
```

Produces:
- `release/Zenny-Setup-0.1.0.exe` - NSIS installer
- `release/Zenny-0.1.0-win-x64.zip` (if enabled)

Requirements:
- Windows: Build should work out of the box
- macOS/Linux: Requires Wine for NSIS (`brew install wine`)

#### macOS

Build macOS DMG and ZIP (requires macOS):

```bash
npm run dist:mac
```

Produces:
- `release/Zenny-0.1.0.dmg` - DMG installer
- `release/Zenny-0.1.0-mac.zip` - ZIP archive
- Supports both Intel (x64) and Apple Silicon (arm64)

Requirements:
- Must run on macOS
- For code signing: Apple Developer account required
- For notarization: Enable in electron-builder.yml

#### Linux

Build Linux packages (can run on any platform):

```bash
npm run dist:linux
```

Produces:
- `release/Zenny-0.1.0.AppImage` - Portable AppImage
- `release/zenny_0.1.0_amd64.deb` - Debian/Ubuntu package
- `release/zenny-0.1.0.x86_64.rpm` - RedHat/Fedora package

## Application Icons

Before building production installers, add custom icons to `build/icons/`:

- **macOS**: `icon.icns` (1024x1024 with multiple resolutions)
- **Windows**: `icon.ico` (256x256 with multiple resolutions)
- **Linux**: PNG files at various sizes (16x16 through 512x512)

See [build/README.md](build/README.md) for detailed icon requirements.

### Quick Icon Generation

Using a 1024x1024 master PNG:

```bash
npm install -g electron-icon-builder
electron-icon-builder --input=./master-icon.png --output=./build/icons
```

## Configuration

### Application Metadata

Edit `package.json`:
```json
{
  "name": "zenny-md-viewer",
  "productName": "Zenny",
  "version": "0.1.0",
  "description": "Modern markdown viewer and editor",
  "author": "Your Name",
  "license": "MIT"
}
```

### Build Configuration

Edit `electron-builder.yml` to customize:
- App ID and product name
- Icon paths
- Code signing settings
- File associations
- Platform-specific options
- Installer behavior

### Production Optimizations

The `vite.config.ts` includes production optimizations:
- Tree shaking for smaller bundles
- Code splitting (React, CodeMirror, Markdown libraries)
- Minification with esbuild
- Target: Modern Chromium (ESNext)

## Build Output

All build outputs go to `release/` directory:

```
release/
├── Zenny-Setup-0.1.0.exe          # Windows installer
├── Zenny-0.1.0.dmg                # macOS installer
├── Zenny-0.1.0.AppImage           # Linux portable
├── zenny_0.1.0_amd64.deb          # Debian/Ubuntu package
├── zenny-0.1.0.x86_64.rpm         # RedHat/Fedora package
└── builder-effective-config.yaml  # Used config
```

## Code Signing

### macOS Code Signing

1. Purchase Apple Developer Certificate ($99/year)
2. Install certificate in Keychain
3. Update `electron-builder.yml`:
   ```yaml
   mac:
     identity: "Developer ID Application: Your Name (TEAMID)"
     hardenedRuntime: true
   ```
4. For notarization (required for distribution):
   ```yaml
   afterSign: "scripts/notarize.js"
   ```

### Windows Code Signing

1. Purchase code signing certificate
2. Install on build machine
3. electron-builder will auto-detect and use it
4. Or specify in `electron-builder.yml`:
   ```yaml
   win:
     certificateFile: "path/to/cert.pfx"
     certificatePassword: "${CERT_PASSWORD}"
   ```

### Linux

No code signing required. Users can verify with checksums.

## Auto-Updates

Not implemented in Phase 7. For future implementation:

1. Set up release server or use GitHub Releases
2. Install `electron-updater`
3. Configure `publish` in `electron-builder.yml`
4. Add update checking logic to main process

## Troubleshooting

### Build Fails on Windows

- Install Visual Studio Build Tools
- Set up Windows SDK

### macOS Build Fails

- Ensure running on macOS (can't build .dmg on Windows/Linux)
- Check Xcode Command Line Tools installed: `xcode-select --install`

### Large Bundle Size

- Normal for Electron apps (100-200MB due to Chromium)
- Optimized with asar compression
- Installer size reduced with compression

### Code Signing Errors

- Verify certificates installed correctly
- Check environment variables for passwords
- Disable signing for testing: Remove identity from config

### AppImage Won't Run on Linux

- Make executable: `chmod +x Zenny-0.1.0.AppImage`
- For older systems, may need to install FUSE

## CI/CD Integration

For automated builds (GitHub Actions example):

```yaml
# .github/workflows/build.yml
name: Build
on: [push]
jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run dist
      - uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: release/
```

## Testing Builds

1. Install on a clean machine or VM
2. Verify application launches
3. Test file associations (.md files)
4. Check all features work correctly
5. Test uninstall process
6. Verify no security warnings (if signed)

## Release Checklist

- [ ] Update version in `package.json`
- [ ] Update CHANGELOG.md
- [ ] Verify all features working in dev mode
- [ ] Run production build (`npm run build`)
- [ ] Test packaged app (`npm run package`)
- [ ] Build installers for all platforms
- [ ] Test installers on clean machines
- [ ] Create GitHub release with installers
- [ ] Update documentation if needed

## Version Bumping

Follow semantic versioning (MAJOR.MINOR.PATCH):

```bash
# Patch release (bug fixes)
npm version patch  # 0.1.0 -> 0.1.1

# Minor release (new features)
npm version minor  # 0.1.0 -> 0.2.0

# Major release (breaking changes)
npm version major  # 0.1.0 -> 1.0.0
```

This updates `package.json` and creates a git tag.

## File Sizes

Expected installer sizes:
- Windows: ~100-150 MB (NSIS compressed)
- macOS: ~150-200 MB (DMG with both architectures)
- Linux AppImage: ~150-180 MB
- Linux deb/rpm: ~140-170 MB

## Questions?

See the [implementation plan](docs/implementation-plan.md) for comprehensive technical details about the build system and packaging process.
