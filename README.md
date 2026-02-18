# Zenny Markdown Viewer

A modern, production-ready desktop Markdown viewer built with Electron, React, and TypeScript.

## Features

- 🚀 **Fast and Lightweight** - Built with modern web technologies
- 📝 **Markdown Editing** - Advanced editor with CodeMirror 6 and syntax highlighting
- 👁️ **Live Preview** - Real-time markdown rendering with GitHub-flavored markdown
- 📄 **Split View** - Edit and preview side-by-side with resizable panels
- 💾 **File Management** - Open, save, and track recently opened files
- 📤 **PDF Export** - Export your markdown to professionally formatted PDF
- 🔒 **Secure** - Built with security best practices (context isolation, sandboxing)
- 🖥️ **Cross-Platform** - Windows, macOS, and Linux installers
- ⚡ **Keyboard Shortcuts** - Full keyboard navigation and formatting shortcuts
- 🎨 **Syntax Highlighting** - Code blocks with highlight.js support

## Current Status: Phases 1-7 Complete ✅

All major implementation phases are complete:
- ✅ **Phase 1**: Application Setup & Foundation
- ✅ **Phase 2**: Markdown Editor Integration (CodeMirror 6)
- ✅ **Phase 3**: Preview Rendering (marked + DOMPurify)
- ✅ **Phase 4**: Split View Logic (resizable panels)
- ✅ **Phase 5**: Enhanced File Operations (recent files, Save As)
- ✅ **Phase 6**: Export to PDF (print-optimized rendering)
- ✅ **Phase 7**: Packaging and Installers (electron-builder configuration)

## Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher

### Linux Users: Install System Dependencies

Electron requires certain system libraries on Linux. If you encounter errors like `libnspr4.so: cannot open shared object file`, install the required dependencies:

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install libnspr4 libnss3 libx11-xcb1 libxcb-dri3-0 libdrm2 libgbm1 libasound2
```

**Fedora/RHEL:**
```bash
sudo dnf install nspr nss libX11-xcb libxcb mesa-libgbm alsa-lib
```

**Arch Linux:**
```bash
sudo pacman -S nspr nss libxcb mesa
```

## Installation

1. **Clone the repository** (or navigate to the project folder)

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Development

**Start the development server:**
```bash
npm run dev
```

This will:
- Start Vite development server with hot reload
- Build the Electron main and preload processes
- Launch the Electron application with DevTools open

## Building

**Build for development:**
```bash
npm run build
```

This creates production-ready bundles in the `dist/` directory.

## Packaging

**Package for current platform:**
```bash
npm run package
```

**Create installer for specific platform:**
```bash
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

**Create installers for all platforms:**
```bash
npm run dist
```

Installers will be created in the `release/` directory.

## Project Structure

```
zenny-md-viewer/
├── src/
│   ├── main/              # Electron main process
│   │   └── index.ts       # Main entry point
│   ├── preload/           # Preload scripts
│   │   ├── index.ts       # API bridge
│   │   └── types.ts       # Window API types
│   ├── renderer/          # React application
│   │   ├── index.tsx      # React entry point
│   │   ├── App.tsx        # Root component
│   │   ├── App.css        # Component styles
│   │   └── styles/
│   │       └── global.css # Global styles
│   └── shared/            # Shared code
│       ├── constants/
│       │   └── channels.ts # IPC channel names
│       └── types/
│           └── ipc.ts     # Shared type definitions
├── docs/                  # Documentation
│   └── implementation-plan.md
├── dist/                  # Build output (gitignored)
├── release/               # Packaged installers (gitignored)
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # Base TypeScript config
├── tsconfig.main.json     # Main process TypeScript config
├── tsconfig.renderer.json # Renderer TypeScript config
├── electron-builder.yml   # Packaging configuration
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
└── package.json          # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development mode with hot reload
- `npm run build` - Build for production
- `npm run package` - Package without creating installer
- `npm run dist` - Create installer for current platform
- `npm run dist:win` - Create Windows installer
- `npm run dist:mac` - Create macOS installer
- `npm run dist:linux` - Create Linux installer
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Security Features

This application follows Electron security best practices:

- ✅ **Context Isolation** - Enabled to prevent renderer access to Electron internals
- ✅ **Node Integration Disabled** - Renderer process doesn't have direct Node.js access
- ✅ **Sandbox Mode** - Renderer runs in a sandboxed environment
- ✅ **Preload Script** - Secure API bridge using contextBridge
- ✅ **Content Security Policy** - Strict CSP headers to prevent XSS
- ✅ **Atomic File Writes** - Prevents data corruption during saves

## Technology Stack

- **Electron** 40.x - Desktop application framework
- **React** 19.x - UI framework with hooks
- **TypeScript** 5.x - Type safety and developer experience
- **Vite** 5.x - Fast build tool and dev server
- **CodeMirror** 6.x - Advanced code editor
- **marked** 17.x - Markdown parser (GitHub-flavored)
- **DOMPurify** 3.x - XSS prevention
- **highlight.js** 11.x - Syntax highlighting for code blocks
- **react-resizable-panels** 4.x - Resizable split view
- **electron-builder** 26.x - Cross-platform packaging

## Building and Distribution

The application is production-ready and can be packaged for all platforms.

See [BUILDING.md](BUILDING.md) for comprehensive build and packaging instructions, including:
- Icon requirements
- Code signing setup
- Multi-platform builds
- Troubleshooting

### Quick Start

```bash
# Development
npm run dev

# Build production bundles
npm run build

# Create installer for current platform
npm run dist

# Platform-specific builds
npm run dist:win    # NSIS installer
npm run dist:mac    # DMG + ZIP (Intel + Apple Silicon)
npm run dist:linux  # AppImage + deb + rpm
```

## Keyboard Shortcuts

- **Ctrl/Cmd + N** - New file
- **Ctrl/Cmd + O** - Open file
- **Ctrl/Cmd + S** - Save file
- **Ctrl/Cmd + Shift + S** - Save as
- **Ctrl/Cmd + P** - Export to PDF
- **Ctrl/Cmd + B** - Bold
- **Ctrl/Cmd + I** - Italic
- **Ctrl/Cmd + K** - Insert link
- **Ctrl/Cmd + Shift + C** - Code block
- **Ctrl/Cmd + 1** - Editor-only mode
- **Ctrl/Cmd + 2** - Split view mode
- **Ctrl/Cmd + 3** - Preview-only mode
- **Ctrl/Cmd + \\** - Toggle view mode

## Next Steps: Future Enhancements

Potential future improvements:
- **Auto-updates** - Implement electron-updater with GitHub releases
- **Themes** - Dark mode and custom themes
- **Extensibility** - Plugin system for custom markdown extensions
- **Cloud Sync** - Optional cloud storage integration
- **Collaborative Editing** - Real-time collaboration features
- **Mobile Companion** - Companion mobile app
- **Advanced Export** - Additional export formats (HTML, DOCX)

See [docs/implementation-plan.md](docs/implementation-plan.md) for the complete technical documentation.

## Troubleshooting

### Application won't start on Linux

Install the required system libraries (see Prerequisites section above).

### "Cannot find module" errors

Run `npm install` to ensure all dependencies are installed.

### Hot reload not working

Try stopping the dev server and running `npm run dev` again.

### Build errors

Clear the dist folder and rebuild:
```bash
rm -rf dist/
npm run build
```

## Contributing

This is currently a learning/development project following a structured implementation plan.

## License

MIT

---

**Built with ❤️ following production best practices**
