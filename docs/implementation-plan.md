# Zenny Markdown Viewer - Implementation Plan

## Executive Summary

This document outlines a complete, production-ready implementation plan for Zenny, a desktop Markdown viewer built with Electron, React, and TypeScript. The application provides editing, preview, and PDF export capabilities with cross-platform distribution support.

---

## Section 1 — System Architecture

### 1.1 Electron Process Model

#### Main Process Responsibilities
The main process acts as the application's backbone and handles:

- **Window lifecycle management**: Creating, managing, and destroying BrowserWindow instances
- **Native menu bar**: Implementing application and context menus with keyboard shortcuts
- **File system operations**: Reading/writing markdown files via native Node.js APIs
- **IPC request handling**: Processing renderer requests for privileged operations
- **PDF generation**: Using `webContents.printToPDF()` for export functionality
- **Application state**: Managing recent files list and application preferences
- **Native dialogs**: Open/Save file pickers, alerts, and confirmations

**Reasoning**: The main process has full Node.js access and system privileges. Keeping all privileged operations here enforces security boundaries and prevents direct file system access from untrusted renderer code.

#### Renderer Process Responsibilities
The renderer process manages the user interface:

- **React UI rendering**: Component-based interface with state management
- **Markdown editing**: Text input handling with syntax awareness
- **Markdown preview**: Real-time rendering of markdown to HTML
- **View state management**: Editor/preview/split view modes
- **User interactions**: Toolbar actions, keyboard shortcuts, scroll management
- **IPC requests**: Communicating with main process for privileged operations

**Reasoning**: Renderer processes run web content and should be treated as potentially untrusted. Isolating UI logic here with minimal privileges ensures a secure architecture.

### 1.2 IPC Communication Structure

#### Communication Patterns

**1. Invoke/Handle Pattern (Request-Response)**
```
Renderer → Main: file:open → Returns: { content, path, success }
Renderer → Main: file:save → Returns: { success, error }
Renderer → Main: pdf:export → Returns: { success, path, error }
```

**Reasoning**: Use `ipcRenderer.invoke()` and `ipcMain.handle()` for operations requiring immediate responses. This pattern provides automatic promise resolution and error handling.

**2. Send/On Pattern (Fire-and-Forget)**
```
Main → Renderer: menu:toggle-view → No response needed
Main → Renderer: file:opened → Notify of external file open
```

**Reasoning**: Use `ipcRenderer.send()` and `webContents.send()` for notifications that don't require responses, reducing overhead.

**3. Security Channels**
All IPC channels should be explicitly whitelisted in the preload script:

- `file:open` - Open file dialog and read content
- `file:save` - Save current content to disk
- `file:saveAs` - Save with file picker
- `file:getRecent` - Get recent files list
- `pdf:export` - Export to PDF
- `app:getPath` - Get app directories
- `app:setTitle` - Update window title

**Reasoning**: Explicit channel definition prevents arbitrary IPC access and makes security auditing straightforward.

### 1.3 File System Access Strategy

#### Secure File Operations

**Read Strategy**:
1. User triggers file open via menu or keyboard shortcut
2. Main process shows native file dialog with `.md` filter
3. Main process reads file using `fs.promises.readFile()`
4. Content is sent to renderer through IPC
5. Recent files list is updated

**Write Strategy**:
1. Renderer sends save request with content via IPC
2. Main process validates file path
3. Atomic write using `fs.promises.writeFile()` with temp file
4. On success, rename temp to target (atomic operation)
5. Update window title and recent files

**Reasoning**: Never expose direct file system access to renderer. Using atomic writes (write-to-temp-then-rename) prevents data corruption if the write fails. This is critical for data integrity in production applications.

#### Path Handling
- Store absolute paths in main process only
- Display relative or basename in UI for security
- Sanitize all file paths before operations
- Validate file extensions (.md, .markdown)

### 1.4 Security Best Practices

#### Context Isolation
```typescript
webPreferences: {
  contextIsolation: true,  // CRITICAL: Enables context isolation
  nodeIntegration: false,  // CRITICAL: Disables Node in renderer
  sandbox: true,           // Additional protection layer
  preload: path.join(__dirname, 'preload.js')
}
```

**Reasoning**: Context isolation prevents renderer JavaScript from accessing Electron internals or Node.js APIs. This is the single most important security measure in modern Electron apps.

#### Preload Script Pattern
The preload script exposes a safe API bridge:

```typescript
// Expose limited API in isolated context
contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('file:open'),
  saveFile: (content) => ipcRenderer.invoke('file:save', content),
  // ... other safe methods
});
```

**Reasoning**: `contextBridge` creates a secure, type-safe bridge between isolated contexts. Only explicitly exposed methods are available, preventing arbitrary IPC access.

#### Content Security Policy (CSP)
Implement strict CSP headers:
```
default-src 'self'; 
script-src 'self'; 
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
```

**Reasoning**: CSP prevents XSS attacks by restricting resource loading. The `'unsafe-inline'` for styles is necessary for React's styling but should be minimized in production.

#### Input Validation
- Validate all IPC messages in main process handlers
- Sanitize markdown content before rendering (XSS prevention)
- Validate file paths against expected patterns
- Implement rate limiting for IPC calls

### 1.5 PDF Export Architecture

#### Architecture Components

**1. Hidden BrowserWindow for Rendering**
Create an offscreen window to render print-optimized HTML:
```
- Load markdown content into hidden window
- Apply print-specific CSS stylesheets
- Calculate page breaks and spacing
- Render to PDF using webContents.printToPDF()
```

**2. Print Configuration**
- Paper size: Letter/A4 (user configurable)
- Margins: 0.5-1 inch customizable margins
- Page scaling: Fit content to page width
- Header/Footer: Optional page numbers and metadata

**Reasoning**: Using a hidden BrowserWindow allows precise control over rendering and styling without affecting the main UI. It leverages Chromium's excellent print engine.

#### Export Workflow
1. User triggers export via menu or shortcut
2. Main process shows save dialog with `.pdf` filter
3. Create hidden BrowserWindow with print settings
4. Load markdown content with print CSS
5. Call `webContents.printToPDF()` with options
6. Write PDF buffer to selected file path
7. Close hidden window and notify user

### 1.6 State Management Strategy

#### React State Architecture

**1. Local Component State (useState)**
- Editor text content
- Cursor position
- Scroll position
- UI element visibility (tooltips, dropdowns)

**Reasoning**: Use local state for ephemeral UI state that doesn't need to be shared across components.

**2. Context API for Shared State**
```
AppContext:
  - viewMode: 'editor' | 'preview' | 'split'
  - currentFilePath: string | null
  - isDirty: boolean
  - preferences: UserPreferences

FileContext:
  - content: string
  - setContent: (content: string) => void
  - save: () => Promise<void>
  - load: (path: string) => Promise<void>
```

**Reasoning**: Context API is sufficient for this app's complexity. It avoids Redux boilerplate while providing necessary state sharing capabilities.

**3. Custom Hooks for Logic Encapsulation**
- `useFileOperations()` - Open, save, save-as logic
- `useKeyboardShortcuts()` - Global keyboard handling
- `useMarkdownRenderer()` - Markdown parsing and rendering
- `useAutoSave()` - Automatic save functionality

**Reasoning**: Custom hooks encapsulate complex logic, making components cleaner and promoting reusability.

#### State Persistence
- Store preferences in `app.getPath('userData')`
- JSON file for settings: `~/.zenny/preferences.json`
- Recent files list: `~/.zenny/recent.json`
- Window position and size across sessions

### 1.7 Markdown Parsing Engine Choice

#### Selected: **marked** with DOMPurify

**Primary Parser: marked**
- Well-established (10+ years), battle-tested library
- Fast parsing performance for real-time preview
- GFM (GitHub Flavored Markdown) support built-in
- Extensible with custom renderers and plugins
- TypeScript definitions available
- Active maintenance and security updates

**Security Layer: DOMPurify**
- Industry-standard HTML sanitizer
- Prevents XSS attacks from markdown content
- Configurable whitelist for allowed tags
- Actively maintained by security experts

**Alternatives Considered:**

1. **remark/rehype** - More powerful but heavier and more complex. Overkill for our needs.
2. **markdown-it** - Excellent but slightly slower. Marked is faster for real-time preview.
3. **showdown** - Older, less actively maintained.

#### Rendering Pipeline
```
Markdown Text
  ↓
marked.parse() → HTML string
  ↓
DOMPurify.sanitize() → Safe HTML
  ↓
dangerouslySetInnerHTML → DOM
  ↓
Syntax highlighting (highlight.js)
  ↓
Final rendered preview
```

**Reasoning**: This pipeline balances performance, security, and feature richness. The two-step parse-then-sanitize approach is industry best practice for handling user-generated content.

#### Syntax Highlighting
Use **highlight.js** for code blocks:
- Auto-detect language or use fence info
- Support 190+ languages
- Multiple theme options
- Performance optimized for re-rendering

---

## Section 2 — Project Structure

### 2.1 Complete Folder Structure

```
zenny-md-viewer/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── index.ts            # Main entry point
│   │   ├── window.ts           # Window management
│   │   ├── menu.ts             # Application menu
│   │   ├── ipc/                # IPC handlers
│   │   │   ├── file-handlers.ts
│   │   │   ├── pdf-handlers.ts
│   │   │   └── app-handlers.ts
│   │   ├── services/           # Business logic
│   │   │   ├── file-service.ts
│   │   │   ├── pdf-service.ts
│   │   │   └── recent-files.ts
│   │   └── utils/              # Main process utilities
│   │       ├── logger.ts
│   │       └── paths.ts
│   │
│   ├── preload/                # Preload scripts
│   │   ├── index.ts            # Main preload script
│   │   └── types.ts            # Window API types
│   │
│   ├── renderer/               # React application
│   │   ├── index.tsx           # React entry point
│   │   ├── App.tsx             # Root component
│   │   ├── components/         # React components
│   │   │   ├── Editor/
│   │   │   │   ├── Editor.tsx
│   │   │   │   ├── Editor.module.css
│   │   │   │   └── index.ts
│   │   │   ├── Preview/
│   │   │   │   ├── Preview.tsx
│   │   │   │   ├── Preview.module.css
│   │   │   │   └── index.ts
│   │   │   ├── SplitView/
│   │   │   │   ├── SplitView.tsx
│   │   │   │   ├── SplitView.module.css
│   │   │   │   └── index.ts
│   │   │   ├── Toolbar/
│   │   │   │   ├── Toolbar.tsx
│   │   │   │   ├── Toolbar.module.css
│   │   │   │   └── index.ts
│   │   │   └── StatusBar/
│   │   │       ├── StatusBar.tsx
│   │   │       └── index.ts
│   │   ├── contexts/           # React contexts
│   │   │   ├── AppContext.tsx
│   │   │   └── FileContext.tsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useFileOperations.ts
│   │   │   ├── useKeyboardShortcuts.ts
│   │   │   ├── useMarkdownRenderer.ts
│   │   │   └── useAutoSave.ts
│   │   ├── services/           # Renderer services
│   │   │   ├── markdown-parser.ts
│   │   │   └── theme-manager.ts
│   │   ├── styles/             # Global styles
│   │   │   ├── global.css
│   │   │   ├── themes/
│   │   │   │   ├── light.css
│   │   │   │   └── dark.css
│   │   │   └── print.css      # PDF export styles
│   │   └── utils/              # Renderer utilities
│   │       ├── debounce.ts
│   │       └── format.ts
│   │
│   ├── shared/                 # Shared between main & renderer
│   │   ├── types/              # TypeScript definitions
│   │   │   ├── app.ts
│   │   │   ├── file.ts
│   │   │   ├── ipc.ts
│   │   │   └── preferences.ts
│   │   └── constants/          # Shared constants
│   │       ├── channels.ts     # IPC channel names
│   │       ├── shortcuts.ts    # Keyboard shortcuts
│   │       └── defaults.ts     # Default values
│   │
│   └── assets/                 # Static assets
│       ├── icons/              # App icons
│       │   ├── icon.icns       # macOS
│       │   ├── icon.ico        # Windows
│       │   └── icon.png        # Linux
│       └── styles/             # Asset styles
│
├── public/                     # Public assets for renderer
│   ├── index.html              # HTML template
│   └── manifest.json           # Web manifest
│
├── build/                      # Build configuration
│   ├── notarize.js            # macOS notarization
│   ├── entitlements.plist     # macOS entitlements
│   └── entitlements.inherit.plist
│
├── dist/                       # Build output (gitignored)
│   ├── main/                   # Compiled main process
│   ├── preload/                # Compiled preload
│   └── renderer/               # Bundled React app
│
├── release/                    # Packaged installers (gitignored)
│   ├── win/
│   ├── mac/
│   └── linux/
│
├── tests/                      # Test files
│   ├── unit/
│   │   ├── main/
│   │   └── renderer/
│   └── e2e/
│       └── app.spec.ts
│
├── docs/                       # Documentation
│   ├── implementation-plan.md  # This document
│   ├── architecture.md
│   └── user-guide.md
│
├── .vscode/                    # VSCode configuration
│   ├── settings.json
│   ├── launch.json             # Debug configurations
│   └── extensions.json
│
├── package.json                # Dependencies & scripts
├── tsconfig.json               # Base TypeScript config
├── tsconfig.main.json          # Main process config
├── tsconfig.renderer.json      # Renderer config
├── electron-builder.yml        # Packaging configuration
├── .gitignore
├── .eslintrc.js               # Linting rules
├── .prettierrc                 # Code formatting
└── README.md
```

### 2.2 Folder Explanations

#### `/src/main` - Electron Main Process
Houses all Node.js runtime code with system privileges. Separated into logical modules:

- **`ipc/`**: Isolates IPC communication handlers for maintainability. Each handler file corresponds to a domain (files, PDF, app settings).
- **`services/`**: Business logic separate from IPC plumbing. Makes testing easier and promotes reusability.
- **`utils/`**: Helper functions for logging, path manipulation, etc.

**Why separate**: Main process code has different security concerns and runtime environment than renderer. Clear separation prevents accidental mixing of privileged and unprivileged code.

#### `/src/preload` - Security Bridge
Contains the preload script that creates the secure API bridge. Minimal code here—just the API exposure logic.

**Why separate**: Preload runs in special context with access to both main and renderer contexts. Isolating it makes security auditing straightforward.

#### `/src/renderer` - React Application
Complete React application with component-based architecture:

- **`components/`**: Feature-based component organization. Each component folder contains its logic, styles, and exports for modularity.
- **`contexts/`**: Global state providers using Context API.
- **`hooks/`**: Reusable logic extracted into custom hooks following React best practices.
- **`services/`**: Rendering services like markdown parsing that don't fit into components.
- **`styles/`**: Global styles and theming. Component-specific styles live with components.

**Why separate**: Renderer is a complete React SPA. This structure scales well and follows React community conventions.

#### `/src/shared` - Cross-Context Code
Types and constants used by both main and renderer processes. Critical for type safety across IPC boundaries.

- **`types/`**: TypeScript interfaces and types. Ensures request/response shapes match.
- **`constants/`**: IPC channel names, keyboard shortcuts, defaults. Single source of truth prevents typos and mismatches.

**Why separate**: Prevents code duplication and ensures consistency. TypeScript can enforce matching types across processes.

#### `/build` - Build Configuration
Platform-specific build configurations, signing certificates (references), and notarization scripts.

**Why separate**: Build logic shouldn't pollute source code. Separate folder makes CI/CD configuration cleaner.

#### `/tests` - Test Suites
Comprehensive test coverage:

- **`unit/`**: Fast, isolated tests for individual functions and components.
- **`e2e/`**: End-to-end tests using Spectron or Playwright for full application flows.

**Why separate**: Following standard testing conventions. Unit tests should be fast; e2e tests are slow but comprehensive.

---

## Section 3 — Feature Implementation Breakdown

### Phase 1: Application Setup & Foundation

**Duration**: 3-5 days

#### Tasks

1. **Project Initialization**
   - Initialize npm project: `npm init`
   - Install core dependencies: electron, react, react-dom, typescript
   - Install dev dependencies: webpack/vite, @types packages, eslint, prettier
   - Configure TypeScript with three configs (base, main, renderer)
   - Set up ESLint with recommended Electron/React rules
   - Configure Prettier for consistent formatting

2. **Webpack/Vite Configuration**
   - Main process bundler configuration
   - Renderer process bundler with React support
   - Hot module replacement for development
   - Production optimization settings
   - Source map configuration for debugging

3. **Basic Electron Structure**
   - Create main process entry point
   - Implement window creation with security settings
   - Set up basic preload script with contextBridge
   - Create minimal HTML template
   - Configure development environment

4. **Development Scripts**
   - `npm run dev` - Start development mode with hot reload
   - `npm run build` - Build production bundles
   - `npm run start` - Start Electron with compiled code
   - `npm run lint` - Run linting
   - `npm run test` - Run test suite

#### Key Libraries

- **electron** (latest stable): Core framework
- **react** & **react-dom** (18+): UI framework
- **typescript** (5+): Type safety
- **webpack** OR **vite**: Build tooling (Vite recommended for faster builds)
- **webpack-dev-server** OR **vite dev server**: Development server
- **electron-builder**: For packaging (configured but not used yet)

#### Risks & Pitfalls

1. **Build Configuration Complexity**
   - Risk: Webpack configuration for Electron is complex with separate main/renderer configs
   - Mitigation: Use electron-webpack or electron-vite boilerplate. Vite is simpler for React.

2. **TypeScript Path Resolution**
   - Risk: Different path resolution between main (Node) and renderer (browser)
   - Mitigation: Use consistent tsconfig path mappings and webpack aliases

3. **Hot Reload Issues**
   - Risk: Changes to main process require full restart; renderer can hot reload
   - Mitigation: Use electron-reload or nodemon for main process, HMR for renderer

4. **Security Misconfiguration**
   - Risk: Forgetting security settings in development leads to vulnerabilities
   - Mitigation: Create security checklist, use template with secure defaults

**Validation Criteria**: Application launches, displays "Hello World" React component, and hot reload works.

---

### Phase 2: Markdown Editor Integration

**Duration**: 4-6 days

#### Tasks

1. **Choose and Integrate Editor Component**
   - Evaluate options: CodeMirror 6, Monaco Editor, react-textarea-autosize
   - Install chosen editor library
   - Create Editor component wrapper
   - Configure syntax highlighting for Markdown
   - Implement controlled component pattern

2. **Text Editing Features**
   - Real-time text input handling
   - Line numbers display
   - Syntax highlighting for markdown syntax
   - Basic text selection and cursor handling
   - Tab key handling (indent/dedent)
   - Line wrapping configuration

3. **Editor Toolbar**
   - Bold, italic, strikethrough buttons
   - Heading level buttons (H1-H6)
   - Link insertion helper
   - Image insertion helper
   - List formatting (ordered/unordered)
   - Code block insertion

4. **State Management**
   - Connect editor to FileContext
   - Implement debounced state updates (avoid lag)
   - Track dirty state (unsaved changes)
   - Cursor position persistence across view switches

5. **Keyboard Shortcuts in Editor**
   - Ctrl/Cmd+B: Bold
   - Ctrl/Cmd+I: Italic
   - Ctrl/Cmd+K: Insert link
   - Ctrl/Cmd+Shift+C: Insert code block
   - Tab/Shift+Tab: Indent/outdent

#### Key Libraries

**Option 1: CodeMirror 6 (Recommended)**
- **@codemirror/state** & **@codemirror/view**: Core editor
- **@codemirror/lang-markdown**: Markdown language support
- **@codemirror/theme-one-dark**: Theming
- **@codemirror/commands**: Built-in editing commands

**Reasoning**: CodeMirror 6 is modern, lightweight, highly extensible, and designed for web applications. Excellent TypeScript support and performance.

**Option 2: Monaco Editor**
- **@monaco-editor/react**: React wrapper
- **monaco-editor**: Core editor (VSCode's editor)

**Reasoning**: More feature-rich but heavier. Better for power users but overkill for basic markdown editing.

**Recommended: CodeMirror 6** for its balance of features, performance, and bundle size.

#### Risks & Pitfalls

1. **Performance with Large Files**
   - Risk: Lag when editing files >10MB
   - Mitigation: Use virtual scrolling, limit syntax highlighting scope, debounce updates

2. **Markdown-Specific Features**
   - Risk: Generic code editor lacks markdown conveniences
   - Mitigation: Add custom commands for markdown patterns, create toolbar actions

3. **State Synchronization**
   - Risk: Editor state gets out of sync with React state
   - Mitigation: Use controlled component pattern carefully, minimize re-renders

4. **Undo/Redo Complications**
   - Risk: React state updates break editor's native undo stack
   - Mitigation: Let editor manage its own undo/redo, don't override

**Validation Criteria**: Can type markdown, use toolbar buttons, keyboard shortcuts work, large files (1MB+) perform well.

---

### Phase 3: Preview Rendering

**Duration**: 4-5 days

#### Tasks

1. **Markdown Parsing Setup**
   - Install marked and DOMPurify
   - Create markdown-parser service
   - Configure marked options (GFM, breaks, etc.)
   - Set up DOMPurify with safe configuration

2. **Preview Component**
   - Create Preview component
   - Implement safe HTML rendering
   - Style markdown output (typography, spacing)
   - Handle code block rendering
   - Image loading and display
   - Link handling (open in external browser)

3. **Syntax Highlighting for Code Blocks**
   - Install highlight.js
   - Auto-detect code language
   - Apply syntax highlighting to fenced code blocks
   - Support multiple themes
   - Performance optimization (highlight on mount, not every render)

4. **Preview Styling**
   - Create GitHub-flavored markdown CSS
   - Typography: headings, paragraphs, lists
   - Table styling
   - Blockquote styling
   - Code block styling with scrolling
   - Image max-width handling
   - Link styling

5. **Real-time Update**
   - Connect Preview to FileContext
   - Debounce markdown parsing (300ms)
   - Memoize parsed HTML to avoid re-parsing
   - Loading state during parsing

6. **Link Security**
   - Prevent `javascript:` URLs
   - Open external links in browser (not in app)
   - Use Electron shell.openExternal()
   - Sanitize link targets

#### Key Libraries

- **marked** (^9.0.0): Markdown parser
- **DOMPurify** (^3.0.0): HTML sanitizer
- **highlight.js** (^11.0.0): Syntax highlighting
- **github-markdown-css** (optional): Pre-built GitHub-style CSS

#### Risks & Pitfalls

1. **XSS Vulnerabilities**
   - Risk: Markdown can contain malicious HTML/JavaScript
   - Mitigation: ALWAYS sanitize with DOMPurify before rendering. Test with XSS payloads.

2. **Performance with Real-time Updates**
   - Risk: Parsing on every keystroke causes lag
   - Mitigation: Debounce parsing (300ms), use React.memo(), parse in Web Worker for huge files

3. **Image Loading Issues**
   - Risk: Relative image paths don't resolve correctly
   - Mitigation: Resolve relative paths against file's directory in main process

4. **External Link Handling**
   - Risk: Links open in electron window instead of browser
   - Mitigation: Intercept link clicks, use shell.openExternal() for http(s) links

5. **CSS Conflicts**
   - Risk: Preview styles leak to editor or vice versa
   - Mitigation: Use CSS modules or scoped styles, namespace preview styles

**Validation Criteria**: Markdown renders correctly with formatting, code highlighting works, links open in browser, XSS attempts are blocked.

---

### Phase 4: Split View Logic

**Duration**: 2-3 days

#### Tasks

1. **View Mode State Management**
   - Add viewMode to AppContext: `'editor' | 'preview' | 'split'`
   - Create view toggle function
   - Persist view preference to user settings

2. **SplitView Component**
   - Create container component for split layout
   - Implement CSS Grid or Flexbox layout
   - Add resizable divider between editor and preview
   - Handle minimum width constraints
   - Persist split position

3. **View Switching UI**
   - Add view mode buttons to toolbar
   - Keyboard shortcuts: Ctrl/Cmd+1/2/3 for editor/preview/split
   - Visual indicators for active view
   - Menu items for view switching

4. **Responsive Behavior**
   - Handle narrow window widths
   - Switch to stacked layout on small widths
   - Adjust split ratio dynamically

5. **Synchronized Scrolling (Optional but Recommended)**
   - Calculate scroll position in editor (percentage)
   - Apply proportional scroll to preview
   - Debounce scroll events for performance
   - Toggle sync on/off option

#### Key Libraries

- **react-split** OR **react-resizable-panels**: Resizable split panes
- **react-window** (if virtual scrolling needed)

**Recommendation**: **react-resizable-panels** - modern, performant, accessible

#### Risks & Pitfalls

1. **Layout Complexity**
   - Risk: Split view breaks at certain window sizes
   - Mitigation: Thorough testing at various resolutions, use flexible layouts

2. **Scroll Synchronization Challenges**
   - Risk: Editor and preview have different heights, sync is inaccurate
   - Mitigation: Use percentage-based scrolling, not pixel-based. Accept imperfect sync.

3. **Performance with Split View**
   - Risk: Rendering both editor and preview simultaneously causes lag
   - Mitigation: Optimize both components, use memoization, debounce preview updates

4. **State Persistence Issues**
   - Risk: Split position resets on restart
   - Mitigation: Save split ratio to preferences, restore on startup

**Validation Criteria**: Can switch between all three views, split view is resizable, view preference persists, synchronized scrolling works (if implemented).

---

### Phase 5: File Open/Save Logic

**Duration**: 4-5 days

#### Tasks

1. **IPC Channel Setup**
   - Define IPC channels in shared constants
   - Implement handlers in main process
   - Expose API methods in preload script

2. **File Operations in Main Process**
   - **Open File**:
     - Show native file dialog with `.md` filter
     - Read file content asynchronously
     - Handle encoding (UTF-8)
     - Return content and metadata
   - **Save File**:
     - Write content to current file path
     - Atomic write (temp file + rename)
     - Handle write errors gracefully
   - **Save As**:
     - Show save dialog with `.md` default
     - Write to new location
     - Update current file path

3. **File State Management**
   - Current file path tracking
   - Dirty state (hasUnsavedChanges)
   - File watcher for external changes
   - Auto-save implementation (optional)

4. **UI Integration**
   - "Open File" menu item and button
   - "Save" menu item (Ctrl/Cmd+S)
   - "Save As" menu item (Ctrl/Cmd+Shift+S)
   - "New File" menu item (Ctrl/Cmd+N)
   - Dirty indicator in title bar (•)
   - Unsaved changes warning on close

5. **Recent Files**
   - Track recently opened files (last 10)
   - Store in ~/.zenny/recent.json
   - "Open Recent" submenu
   - Clear recent files option

6. **Error Handling**
   - Permission denied errors
   - File not found errors
   - Disk full errors
   - User-friendly error messages
   - Retry mechanisms

7. **Window Title Management**
   - Display filename in title bar
   - Show full path in tooltip/subtitle
   - Indicate dirty state with dot/asterisk
   - Update on save/open

#### Key Libraries

- **Built-in**: Node.js `fs.promises`, `path`, Electron `dialog`
- **chokidar** (optional): Better file watching than fs.watch

#### Risks & Pitfalls

1. **Data Loss from Failed Saves**
   - Risk: Write failure corrupts existing file
   - Mitigation: Atomic writes (write temp then rename). Never overwrite directly.

2. **Encoding Issues**
   - Risk: Files with non-UTF-8 encoding display incorrectly
   - Mitigation: Always use UTF-8, detect and warn about other encodings

3. **Unsaved Changes Warning**
   - Risk: User closes app without saving, loses work
   - Mitigation: Intercept window close event, show confirmation dialog if dirty

4. **Path Security**
   - Risk: Malicious paths like `../../../etc/passwd`
   - Mitigation: Validate and sanitize paths in main process. Use path.resolve().

5. **Large File Performance**
   - Risk: Opening 100MB file freezes app
   - Mitigation: Check file size before reading, warn user, stream large files

6. **Concurrent Save Conflicts**
   - Risk: File changes externally while user is editing
   - Mitigation: Watch file for changes, prompt user to reload or keep their version

**Validation Criteria**: Can open, edit, save files. Unsaved changes warning works. Recent files list functions correctly. Title bar updates. Error messages are clear.

---

### Phase 6: Export to PDF

**Duration**: 3-4 days

#### Tasks

1. **PDF Export Service (Main Process)**
   - Create hidden BrowserWindow for rendering
   - Load markdown content into window
   - Apply print-specific CSS
   - Configure printToPDF options
   - Handle errors and cleanup

2. **Print CSS Stylesheet**
   - Page-break handling for long content
   - Margin and padding adjustments
   - Typography optimization for print
   - Remove unnecessary UI elements
   - Code block page-break handling
   - Image sizing for print

3. **Export Flow**
   - Add "Export to PDF" menu item (Ctrl/Cmd+P)
   - Show save dialog with .pdf filter
   - Display progress indicator
   - Execute PDF generation
   - Save PDF to selected path
   - Show success notification or open PDF

4. **PDF Configuration UI (Optional)**
   - Paper size selector (Letter, A4, Legal)
   - Margin controls
   - Header/footer options
   - Page numbering
   - Custom CSS option

5. **Error Handling**
   - Handle PDF generation failures
   - Disk space checks
   - Permission errors
   - Render timeout handling

#### Key Libraries

- **Built-in**: Electron `webContents.printToPDF()`
- **NO external PDF libraries needed** (Electron handles this)

#### Technical Implementation

**Hidden Window Approach**:
```typescript
// Create offscreen window
const printWindow = new BrowserWindow({
  show: false,
  webPreferences: { offscreen: true }
});

// Load content
await printWindow.loadURL(`data:text/html,${htmlContent}`);

// Generate PDF
const pdfData = await printWindow.webContents.printToPDF({
  marginsType: 1,
  pageSize: 'A4',
  printBackground: true,
  landscape: false
});

// Save to file
await fs.promises.writeFile(outputPath, pdfData);

// Cleanup
printWindow.close();
```

**Print CSS Best Practices**:
```css
@media print {
  body {
    font-size: 12pt;
    line-height: 1.6;
    color: #000;
    background: #fff;
  }
  
  pre, code {
    page-break-inside: avoid;
    white-space: pre-wrap;
  }
  
  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;
  }
  
  img {
    max-width: 100%;
    page-break-inside: avoid;
  }
}
```

#### Risks & Pitfalls

1. **Page Break Issues**
   - Risk: Code blocks or images split awkwardly across pages
   - Mitigation: Use `page-break-inside: avoid`, test with various content types

2. **Missing Styles**
   - Risk: PDF doesn't match preview appearance
   - Mitigation: Load same base styles plus print-specific overrides

3. **Large Content Timeout**
   - Risk: Rendering 500-page document times out
   - Mitigation: Increase timeout, show progress, consider chunking for huge files

4. **Image Resolution**
   - Risk: Images look pixelated in PDF
   - Mitigation: Use high-DPI rendering, set scale factor in printToPDF options

5. **Font Embedding**
   - Risk: Custom fonts don't embed, PDF shows fallback fonts
   - Mitigation: Stick to web-safe fonts or ensure fonts are available system-wide

**Validation Criteria**: Can export to PDF, PDF styling matches expectations, code blocks render correctly, images are included, page breaks are reasonable.

---

### Phase 7: Packaging and Installers

**Duration**: 4-6 days

#### Tasks

1. **electron-builder Configuration**
   - Create `electron-builder.yml` config file
   - Configure app metadata (name, description, version)
   - Set up build directories
   - Configure platform-specific options

2. **Windows Configuration**
   - NSIS installer target
   - Icon: .ico format (256x256, 64x64, 32x32, 16x16)
   - File associations (.md)
   - Start menu shortcuts
   - Desktop shortcut option
   - Uninstaller

3. **macOS Configuration**
   - DMG and/or PKG target
   - Icon: .icns format (multiple resolutions)
   - Entitlements for hardened runtime
   - File associations (.md, .markdown)
   - Notarization setup (for distribution)
   - Code signing certificate configuration

4. **Linux Configuration**
   - AppImage and/or snap target
   - Icon: .png format (512x512, 256x256, 128x128)
   - Desktop entry file
   - File associations via MIME types
   - Category: Office or TextEditor

5. **Build Scripts**
   - `npm run package` - Build without packaging
   - `npm run dist` - Build and package for current platform
   - `npm run dist:win` - Build Windows installer
   - `npm run dist:mac` - Build macOS DMG
   - `npm run dist:linux` - Build Linux AppImage
   - `npm run dist:all` - Build for all platforms (requires cross-platform build setup)

6. **Testing Installers**
   - Install on clean VM or machine
   - Verify file associations work
   - Check app launches correctly
   - Test uninstall process
   - Verify shortcuts and menus

7. **Release Preparation**
   - Version bumping strategy (semantic versioning)
   - Changelog generation
   - Release notes template
   - GitHub releases integration

#### Key Libraries & Tools

- **electron-builder**: Primary packaging tool
- **electron-notarize** (macOS): For macOS notarization
- **electron-builder-notarize**: Helper for notarization

#### electron-builder Configuration Example

```yaml
appId: com.zenny.mdviewer
productName: Zenny
copyright: Copyright © 2026

directories:
  output: release
  buildResources: build

files:
  - dist/**/*
  - package.json

extraMetadata:
  main: dist/main/index.js

mac:
  category: public.app-category.productivity
  icon: src/assets/icons/icon.icns
  hardenedRuntime: true
  gatekeeperAssess: false
  entitlements: build/entitlements.plist
  entitlementsInherit: build/entitlements.inherit.plist
  target:
    - dmg
    - zip

dmg:
  contents:
    - x: 130
      y: 220
    - x: 410
      y: 220
      type: link
      path: /Applications

win:
  icon: src/assets/icons/icon.ico
  target:
    - nsis
  publisherName: Your Name

nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: true
  createStartMenuShortcut: true

linux:
  icon: src/assets/icons/
  category: Office
  target:
    - AppImage
    - snap

fileAssociations:
  - ext: md
    name: Markdown File
    role: Editor
  - ext: markdown
    name: Markdown Document
    role: Editor
```

#### Risks & Pitfalls

1. **Code Signing Complexity**
   - Risk: Unsigned apps trigger security warnings
   - Mitigation: 
     - macOS: Purchase Apple Developer certificate ($99/year), set up notarization
     - Windows: Purchase code signing certificate (~$100-500/year)
     - Linux: No code signing required

2. **Cross-Platform Building**
   - Risk: Building macOS app on Windows/Linux or vice versa
   - Mitigation: Use CI/CD (GitHub Actions) with multiple runners, or use macOS for all builds

3. **Large Bundle Size**
   - Risk: Electron apps are 100-200MB+
   - Mitigation: Optimize dependencies, use asar compression, consider lazy loading

4. **Auto-Updater Complexity**
   - Risk: Implementing auto-updates requires server infrastructure
   - Mitigation: Phase 1: manual updates. Phase 2: use electron-updater with GitHub releases

5. **File Association Conflicts**
   - Risk: Other apps also register for .md files
   - Mitigation: Allow user choice during installation, don't force association

6. **Permission Issues**
   - Risk: macOS/Linux require special permissions for file access
   - Mitigation: Configure entitlements correctly, request permissions at runtime

**Validation Criteria**: Installers build successfully for all platforms, install and launch correctly, file associations work, app doesn't trigger security warnings (if signed).

---

## Section 4 — UI/UX Design Plan

### 4.1 Layout Design

#### Main Application Window

**Dimensions**:
- Default size: 1200x800px
- Minimum size: 800x600px
- Remember last size and position

**Layout Structure**:
```
┌────────────────────────────────────────┐
│  Title Bar (native or custom)         │
├────────────────────────────────────────┤
│  Toolbar (view controls, actions)     │
├─────────────────┬──────────────────────┤
│                 │                      │
│   Editor Pane   │   Preview Pane      │
│                 │                      │
│   (in split view mode)                │
│                 │                      │
├─────────────────┴──────────────────────┤
│  Status Bar (word count, line/col)    │
└────────────────────────────────────────┘
```

**View-Specific Layouts**:

1. **Editor-Only Mode**: Editor fills entire content area
2. **Preview-Only Mode**: Preview fills entire content area
3. **Split Mode**: Resizable divider between editor (left) and preview (right)

#### Color Scheme

**Light Theme** (default):
- Background: #FFFFFF
- Editor background: #F8F9FA
- Text: #24292E
- Border: #E1E4E8
- Accent: #0969DA (blue)

**Dark Theme**:
- Background: #0D1117
- Editor background: #161B22
- Text: #C9D1D9
- Border: #30363D
- Accent: #58A6FF (blue)

**Reasoning**: Follow GitHub's color palette for familiarity with markdown users.

### 4.2 View Switching Logic

#### View Modes

**Three Primary Modes**:
1. **Editor Mode**: Full-width text editor
2. **Preview Mode**: Full-width rendered preview
3. **Split Mode**: Side-by-side editor and preview

#### State Management

Store current view mode in `AppContext`:
```typescript
type ViewMode = 'editor' | 'preview' | 'split';
const [viewMode, setViewMode] = useState<ViewMode>('split');
```

#### Switching Behavior

- Switching preserves content and scroll position
- Last used mode is remembered across sessions
- Smooth transition without flashing

#### Responsive Behavior

- Window width < 800px: Force single-pane view (editor or preview)
- Show mode toggle even in forced single-pane
- Restore split when window expands

### 4.3 Toolbar Structure

#### Toolbar Components (Left to Right)

**File Operations** (leftmost):
- New File button (icon: document-plus)
- Open File button (icon: folder-open)
- Save button (icon: floppy-disk)
  - Disabled if no unsaved changes
  - Shows keyboard shortcut tooltip

**View Controls** (center):
- Segmented control or button group:
  - [ Editor ] [ Split ] [ Preview ]
  - Active view is highlighted
  - Keyboard shortcuts shown in tooltips

**Actions** (right):
- Export to PDF button (icon: arrow-down-tray)
- Settings button (icon: cog)
- Theme toggle (icon: sun/moon)

#### Toolbar Styling
- Height: 48px
- Background: Slightly darker/lighter than main background
- Icons: 20x20px, clear and recognizable
- Tooltips on hover with keyboard shortcuts
- Adequate spacing (8-12px between grouped buttons)

### 4.4 Menu Configuration

#### Application Menu (macOS) / Window Menu (Windows/Linux)

**File Menu**:
- New File (Cmd/Ctrl+N)
- Open File... (Cmd/Ctrl+O)
- Open Recent ▸ (submenu with last 10 files)
  - Recent file 1
  - Recent file 2
  - ...
  - Clear Recent Files
- ─────────
- Save (Cmd/Ctrl+S)
- Save As... (Cmd/Ctrl+Shift+S)
- ─────────
- Export to PDF... (Cmd/Ctrl+P)
- ─────────
- Close Window (Cmd/Ctrl+W)
- Quit (Cmd/Ctrl+Q) [macOS only]

**Edit Menu**:
- Undo (Cmd/Ctrl+Z)
- Redo (Cmd/Ctrl+Shift+Z)
- ─────────
- Cut (Cmd/Ctrl+X)
- Copy (Cmd/Ctrl+C)
- Paste (Cmd/Ctrl+V)
- Select All (Cmd/Ctrl+A)
- ─────────
- Find (Cmd/Ctrl+F)
- Replace (Cmd/Ctrl+H)

**View Menu**:
- Editor Only (Cmd/Ctrl+1)
- Split View (Cmd/Ctrl+2)
- Preview Only (Cmd/Ctrl+3)
- ─────────
- Toggle Fullscreen (F11 / Cmd+Ctrl+F)
- ─────────
- Zoom In (Cmd/Ctrl++)
- Zoom Out (Cmd/Ctrl+-)
- Reset Zoom (Cmd/Ctrl+0)
- ─────────
- Toggle Developer Tools (Cmd/Ctrl+Shift+I)

**Format Menu** (Markdown-specific):
- Bold (Cmd/Ctrl+B)
- Italic (Cmd/Ctrl+I)
- Strikethrough (Cmd/Ctrl+Shift+X)
- ─────────
- Heading 1 (Cmd/Ctrl+Shift+1)
- Heading 2 (Cmd/Ctrl+Shift+2)
- Heading 3 (Cmd/Ctrl+Shift+3)
- ─────────
- Insert Link (Cmd/Ctrl+K)
- Insert Image (Cmd/Ctrl+Shift+I)
- Insert Code Block (Cmd/Ctrl+Shift+C)
- ─────────
- Ordered List
- Unordered List
- Task List

**Window Menu** (macOS):
- Minimize (Cmd+M)
- Zoom
- ─────────
- Bring All to Front

**Help Menu**:
- Documentation
- Keyboard Shortcuts
- ─────────
- Report Issue
- ─────────
- About Zenny

#### Context Menu (Right-click)

**In Editor**:
- Cut / Copy / Paste
- ─────────
- Bold / Italic / Link
- ─────────
- Select All

**In Preview**:
- Copy
- ─────────
- Reload Preview
- ─────────
- Open Link in Browser (if URL clicked)

### 4.5 Keyboard Shortcuts

#### Global Shortcuts

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| New File | Cmd+N | Ctrl+N |
| Open File | Cmd+O | Ctrl+O |
| Save | Cmd+S | Ctrl+S |
| Save As | Cmd+Shift+S | Ctrl+Shift+S |
| Export to PDF | Cmd+P | Ctrl+P |
| Close Window | Cmd+W | Ctrl+W |
| Quit | Cmd+Q | Ctrl+Q |

#### View Shortcuts

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| Editor Only | Cmd+1 | Ctrl+1 |
| Split View | Cmd+2 | Ctrl+2 |
| Preview Only | Cmd+3 | Ctrl+3 |
| Toggle Fullscreen | Cmd+Ctrl+F | F11 |

#### Editing Shortcuts

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| Bold | Cmd+B | Ctrl+B |
| Italic | Cmd+I | Ctrl+I |
| Strikethrough | Cmd+Shift+X | Ctrl+Shift+X |
| Insert Link | Cmd+K | Ctrl+K |
| Insert Code Block | Cmd+Shift+C | Ctrl+Shift+C |
| Heading 1-6 | Cmd+Shift+1-6 | Ctrl+Shift+1-6 |

#### Editor Shortcuts (CodeMirror default)

| Action | Keys |
|--------|------|
| Find | Cmd/Ctrl+F |
| Replace | Cmd/Ctrl+H |
| Find Next | Cmd/Ctrl+G |
| Go to Line | Cmd/Ctrl+L |
| Undo | Cmd/Ctrl+Z |
| Redo | Cmd/Ctrl+Shift+Z |

#### Implementation

- Define shortcuts in shared constants file
- Register in Electron menu accelerators
- Also register local handlers in renderer for toolbar buttons
- Display shortcuts in tooltips and menu items
- Make shortcuts configurable in future (Phase 2)

### 4.6 User Experience Considerations

#### Loading States
- Show spinner when opening large files
- Progress indicator for PDF export
- Skeleton loading for preview rendering

#### Error Feedback
- Toast notifications for errors (non-blocking)
- Modal dialogs for critical errors requiring action
- Clear, actionable error messages

#### Accessibility
- All interactive elements keyboard accessible
- Proper ARIA labels for screen readers
- Focus indicators for keyboard navigation
- High contrast mode support

#### Performance Indicators
- Debounce preview updates (300ms) to avoid lag
- Show "Rendering..." message for slow previews
- Virtualize long documents if needed

---

## Section 5 — PDF Export Strategy

### 5.1 Using webContents.printToPDF

#### Core Approach

Electron's `webContents.printToPDF()` leverages Chromium's print engine to convert web content to PDF. This is the most reliable method for Electron apps.

**Why this approach**:
- Built into Electron, no additional dependencies
- Guaranteed compatibility with rendered preview
- Supports CSS print media queries
- Handles complex layouts, images, and styling
- Produces high-quality, vector-based PDFs

#### Implementation Architecture

**Two-Window Pattern**:
1. **Main Window**: User's visible editor/preview
2. **Print Window**: Hidden, offscreen window for PDF generation

**Why separate windows**:
- Doesn't disrupt user's current view
- Can apply print-specific styling without affecting UI
- Allows cancellation without side effects
- Supports background PDF generation

#### Step-by-Step Flow

1. **User initiates export** (menu or Cmd/Ctrl+P)
2. **Main process shows save dialog** with .pdf filter
3. **Create hidden BrowserWindow**:
   ```typescript
   const printWindow = new BrowserWindow({
     show: false,
     width: 800,
     height: 1200,
     webPreferences: {
       offscreen: true,
       contextIsolation: true,
       nodeIntegration: false
     }
   });
   ```
4. **Load markdown content** with print stylesheet:
   ```typescript
   const html = `
     <!DOCTYPE html>
     <html>
       <head>
         <meta charset="utf-8">
         <link rel="stylesheet" href="file://${pathToPrintCSS}">
       </head>
       <body>
         ${renderedMarkdownHTML}
       </body>
     </html>
   `;
   await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
   ```
5. **Wait for content to render**:
   ```typescript
   await printWindow.webContents.executeJavaScript(`
     new Promise(resolve => {
       if (document.readyState === 'complete') resolve();
       else window.addEventListener('load', resolve);
     })
   `);
   ```
6. **Generate PDF**:
   ```typescript
   const pdfBuffer = await printWindow.webContents.printToPDF({
     marginsType: 1,        // Custom margins
     pageSize: 'A4',        // or 'Letter', 'Legal', etc.
     printBackground: true, // Include background colors/images
     landscape: false,
     scaleFactor: 100
   });
   ```
7. **Save to disk**:
   ```typescript
   await fs.promises.writeFile(selectedPath, pdfBuffer);
   ```
8. **Cleanup**:
   ```typescript
   printWindow.destroy();
   ```
9. **Notify user** of success or failure

#### printToPDF Options

**Key Options**:
```typescript
interface PrintToPDFOptions {
  marginsType?: number;        // 0: default, 1: no margins, 2: minimum
  pageSize?: string | Size;    // 'A4', 'Letter', 'Legal', or {width, height}
  printBackground?: boolean;   // Include CSS backgrounds
  printSelectionOnly?: boolean; // Only print selected content
  landscape?: boolean;         // Orientation
  scaleFactor?: number;        // 100 = 100%
  pageRanges?: string;         // e.g., '1-5, 8, 11-13'
  headerTemplate?: string;     // HTML for header
  footerTemplate?: string;     // HTML for footer
  preferCSSPageSize?: boolean; // Use CSS @page size
  margins?: {                  // Custom margins in microns
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}
```

**Recommended Defaults**:
```typescript
{
  marginsType: 1,
  pageSize: 'A4',
  printBackground: true,
  landscape: false,
  scaleFactor: 100,
  margins: {
    top: 25400,    // 1 inch in microns
    bottom: 25400,
    left: 19050,   // 0.75 inch
    right: 19050
  }
}
```

### 5.2 Alternative Approaches

#### Option 1: Direct HTML-to-PDF Libraries

**Libraries**: puppeteer-core, pdfkit, jsPDF

**Pros**:
- More control over PDF structure
- Can generate PDFs programmatically without rendering
- Smaller dependencies (some are lightweight)

**Cons**:
- Requires reimplementing rendering logic
- Won't match preview appearance exactly
- More complex to maintain
- Possible discrepancies between preview and PDF

**Verdict**: Not recommended. webContents.printToPDF already uses Chromium's engine, which is battle-tested and reliable.

#### Option 2: Server-Side Rendering

**Approach**: Send markdown to external service (Puppeteer Cloud, DocRaptor, etc.)

**Pros**:
- Offloads processing from client
- Can handle very large documents

**Cons**:
- Requires internet connection
- Privacy concerns (content leaves user's machine)
- Additional cost for service
- Latency

**Verdict**: Not suitable for desktop app. Users expect offline functionality.

#### Option 3: Native PDFKit-based Generation

**Approach**: Use pdfkit to generate PDF directly from markdown AST

**Pros**:
- Full control over PDF structure
- Smaller bundle size
- Fast generation

**Cons**:
- Must manually implement all markdown elements
- No CSS support
- Won't match preview styling
- High maintenance burden

**Verdict**: Too much work for limited benefit. Stick with webContents.printToPDF.

**Recommendation: Use webContents.printToPDF** - it's the most reliable, maintains visual fidelity, and is well-supported.

### 5.3 Styling for Printable Markdown

#### Print Stylesheet Strategy

**Separate Print CSS**: Create `print.css` with `@media print` rules

**Core Principles**:
1. **Simplify**: Remove UI chrome (buttons, toolbars)
2. **Optimize Typography**: Use serif fonts, good line height, appropriate sizing
3. **Control Page Breaks**: Prevent awkward splits
4. **Preserve Meaning**: Ensure links, code, and emphasis are distinguishable
5. **Print Background**: Enable background colors for code blocks

#### Essential Print Styles

**Base Typography**:
```css
@media print {
  body {
    font-family: "Georgia", "Times New Roman", serif;
    font-size: 12pt;
    line-height: 1.6;
    color: #000000;
    background: #ffffff;
    margin: 0;
    padding: 0;
  }
  
  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: "Arial", "Helvetica", sans-serif;
    font-weight: bold;
    page-break-after: avoid;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }
  
  h1 { font-size: 24pt; }
  h2 { font-size: 20pt; }
  h3 { font-size: 16pt; }
  h4 { font-size: 14pt; }
  h5 { font-size: 12pt; }
  h6 { font-size: 12pt; font-weight: normal; font-style: italic; }
  
  /* Paragraphs */
  p {
    margin: 0.5em 0;
    orphans: 3;
    widows: 3;
  }
}
```

**Code Blocks**:
```css
@media print {
  pre, code {
    font-family: "Courier New", "Courier", monospace;
    font-size: 10pt;
    page-break-inside: avoid;
  }
  
  pre {
    background: #f6f8fa !important;
    border: 1px solid #d0d7de;
    padding: 12pt;
    margin: 0.5em 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  code {
    background: #f6f8fa !important;
    padding: 2pt 4pt;
    border-radius: 3pt;
  }
  
  pre code {
    background: none !important;
    padding: 0;
  }
}
```

**Lists**:
```css
@media print {
  ul, ol {
    margin: 0.5em 0;
    padding-left: 2em;
  }
  
  li {
    margin: 0.25em 0;
    page-break-inside: avoid;
  }
}
```

**Tables**:
```css
@media print {
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.5em 0;
    page-break-inside: avoid;
  }
  
  th, td {
    border: 1px solid #d0d7de;
    padding: 6pt 12pt;
    text-align: left;
  }
  
  th {
    background: #f6f8fa !important;
    font-weight: bold;
  }
  
  tr {
    page-break-inside: avoid;
  }
}
```

**Images**:
```css
@media print {
  img {
    max-width: 100%;
    height: auto;
    page-break-inside: avoid;
    display: block;
    margin: 0.5em 0;
  }
}
```

**Links**:
```css
@media print {
  a {
    color: #0969da;
    text-decoration: underline;
  }
  
  /* Show URLs after links */
  a[href^="http"]:after {
    content: " (" attr(href) ")";
    font-size: 9pt;
    color: #666;
  }
  
  /* Don't show URLs for anchor links */
  a[href^="#"]:after {
    content: "";
  }
}
```

**Blockquotes**:
```css
@media print {
  blockquote {
    border-left: 4pt solid #d0d7de;
    padding-left: 1em;
    margin: 0.5em 0;
    color: #666;
    page-break-inside: avoid;
  }
}
```

**Horizontal Rules**:
```css
@media print {
  hr {
    border: none;
    border-top: 1px solid #d0d7de;
    margin: 1em 0;
    page-break-after: avoid;
  }
}
```

### 5.4 Page Size Configuration

#### Supported Paper Sizes

**Standard Sizes** (passed as strings):
- `'Letter'`: 8.5" × 11" (216mm × 279mm) - US standard
- `'A4'`: 8.27" × 11.69" (210mm × 297mm) - International standard
- `'Legal'`: 8.5" × 14" (216mm × 356mm) - US legal
- `'Tabloid'`: 11" × 17" (279mm × 432mm)
- `'A3'`: 11.69" × 16.54" (297mm × 420mm)

**Custom Sizes** (passed as object in microns):
```typescript
pageSize: {
  width: 210000,  // 210mm in microns
  height: 297000  // 297mm in microns
}
```

**User Configuration**:
Store preferred paper size in user preferences:
```typescript
interface PDFPreferences {
  pageSize: 'Letter' | 'A4' | 'Legal' | 'A3' | 'Tabloid';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;    // in mm
    bottom: number;
    left: number;
    right: number;
  };
  includePageNumbers: boolean;
  includeDate: boolean;
}
```

**Default Selection Logic**:
```typescript
// Detect region and set default
const defaultPageSize = Intl.DateTimeFormat()
  .resolvedOptions()
  .locale.startsWith('en-US') ? 'Letter' : 'A4';
```

### 5.5 Margin Handling

#### Margin Types

**Electron's marginsType options**:
- `0`: Default margins (~1cm all sides)
- `1`: No margins (0cm)
- `2`: Minimum margins (~0.5cm all sides)

**Custom Margins** (more control):
```typescript
margins: {
  top: 25400,     // 1 inch = 25400 microns
  bottom: 25400,
  left: 19050,    // 0.75 inch = 19050 microns
  right: 19050
}
```

**Conversion Helper**:
```typescript
function mmToMicrons(mm: number): number {
  return mm * 1000;
}

function inchToMicrons(inch: number): number {
  return inch * 25400;
}
```

#### Recommended Margin Presets

**Standard** (default):
- Top/Bottom: 25mm (1 inch)
- Left/Right: 20mm (0.75 inch)

**Narrow** (more content):
- All sides: 13mm (0.5 inch)

**Wide** (more whitespace):
- Top/Bottom: 32mm (1.25 inch)
- Left/Right: 25mm (1 inch)

**Custom**: User-defined values

#### UI for Margin Selection

**Settings Dialog**:
- Dropdown for presets: Standard / Narrow / Wide / Custom
- If Custom selected, show number inputs for each side
- Live preview (optional): small preview pane showing page layout
- Units toggle: mm / inches

#### Implementation in Code

```typescript
async function exportToPDF(content: string, preferences: PDFPreferences) {
  const pdfOptions: PrintToPDFOptions = {
    pageSize: preferences.pageSize,
    landscape: preferences.orientation === 'landscape',
    printBackground: true,
    margins: {
      top: mmToMicrons(preferences.margins.top),
      bottom: mmToMicrons(preferences.margins.bottom),
      left: mmToMicrons(preferences.margins.left),
      right: mmToMicrons(preferences.margins.right)
    }
  };
  
  if (preferences.includePageNumbers) {
    pdfOptions.headerTemplate = '<div></div>'; // Empty header
    pdfOptions.footerTemplate = `
      <div style="font-size: 9pt; text-align: center; width: 100%;">
        <span class="pageNumber"></span> / <span class="totalPages"></span>
      </div>
    `;
  }
  
  // ... rest of PDF generation
}
```

#### Header and Footer Templates

**Special CSS Classes** (Chromium provides these):
- `.pageNumber`: Current page number
- `.totalPages`: Total number of pages
- `.date`: Current date
- `.title`: Document title
- `.url`: Document URL

**Example Footer with Date and Page Numbers**:
```html
<div style="font-size: 9pt; width: 100%; padding: 0 20pt;">
  <span style="float: left;" class="date"></span>
  <span style="float: right;">
    Page <span class="pageNumber"></span> of <span class="totalPages"></span>
  </span>
</div>
```

**Important Notes**:
- Header/footer templates must use inline styles
- Template height is automatically determined
- Margin space must account for header/footer height

---

## Section 6 — Packaging & Distribution

### 6.1 Using electron-builder

#### Why electron-builder?

**electron-builder** is the de facto standard for packaging Electron apps. It provides:
- Multi-platform support (Windows, macOS, Linux)
- Multiple target formats per platform
- Code signing integration
- Auto-update support
- File associations
- Customizable installers
- Active maintenance and community

**Alternatives**:
- **electron-packager**: Lower level, less features, more manual work
- **electron-forge**: Good alternative, but electron-builder is more popular and feature-rich

**Recommendation**: Use electron-builder for its comprehensive feature set and excellent documentation.

### 6.2 Configuration Structure

#### electron-builder.yml

**Why YAML**: Cleaner than JSON for complex configurations, supports comments

**Basic Structure**:
```yaml
appId: com.zenny.mdviewer
productName: Zenny
copyright: Copyright © 2026 Your Name

# Directories
directories:
  output: release          # Where installers go
  buildResources: build    # Icons, certificates, etc.

# What to include in package
files:
  - dist/**/*
  - package.json
  - "!**/*.map"            # Exclude source maps
  - "!**/node_modules/*/{CHANGELOG.md,README.md}"

extraMetadata:
  main: dist/main/index.js

# File associations
fileAssociations:
  - ext: md
    name: Markdown File
    description: Markdown Document
    role: Editor
    icon: icons/markdown.icns  # Platform-specific icon
  - ext: markdown
    name: Markdown File
    description: Markdown Document
    role: Editor

# Update configuration (optional)
publish:
  provider: github
  owner: your-username
  repo: zenny-md-viewer

# Platform-specific configs below
mac:
  # ...

win:
  # ...

linux:
  # ...
```

### 6.3 Windows Packaging

#### Configuration

```yaml
win:
  target:
    - nsis           # Primary installer format
    - portable       # Optional: portable .exe
  icon: src/assets/icons/icon.ico
  publisherName: Your Name or Company
  verifyUpdateCodeSignature: false  # Set true if code signing

nsis:
  # Installer behavior
  oneClick: false                    # Allow installation path choice
  allowElevation: true               # Allow admin installation
  allowToChangeInstallationDirectory: true
  
  # Shortcuts
  createDesktopShortcut: always
  createStartMenuShortcut: true
  
  # Metadata
  installerIcon: build/installerIcon.ico
  uninstallerIcon: build/uninstallerIcon.ico
  installerHeaderIcon: build/installerHeaderIcon.ico
  
  # License
  license: LICENSE.txt
  
  # UI
  warningsAsErrors: false
  deleteAppDataOnUninstall: false   # Keep user data on uninstall
  
  # Advanced
  perMachine: false                 # Per-user installation (no admin needed)
  runAfterFinish: true              # Launch app after install
```

#### Icon Requirements

**Format**: .ico file with multiple resolutions embedded:
- 256×256 (for Windows 10/11)
- 64×64
- 48×48
- 32×32
- 16×16

**Creation**:
- Use online converter or ImageMagick
- Start with high-res PNG (512×512 or 1024×1024)
- Command: `convert icon.png -define icon:auto-resize=256,64,48,32,16 icon.ico`

#### NSIS vs. Squirrel

**NSIS** (Recommended):
- Traditional Windows installer
- Full customization
- Users understand it
- Supports installation path choice

**Squirrel**:
- Modern, silent installations
- Required for auto-updates on Windows
- Less user control
- Good for frequently updating apps

**Recommendation**: Start with NSIS. Add Squirrel later if auto-updates are needed.

### 6.4 macOS Packaging

#### Configuration

```yaml
mac:
  target:
    - dmg            # Drag-to-install disk image
    - zip            # For auto-updates
  category: public.app-category.productivity
  icon: src/assets/icons/icon.icns
  
  # Hardened runtime (required for notarization)
  hardenedRuntime: true
  gatekeeperAssess: false
  
  # Code signing
  identity: "Developer ID Application: Your Name (TEAM_ID)"
  entitlements: build/entitlements.plist
  entitlementsInherit: build/entitlements.inherit.plist
  
  # App details
  darkModeSupport: true
  minimumSystemVersion: "10.15.0"  # Catalina

dmg:
  title: "${productName} ${version}"
  icon: build/icon.icns
  iconSize: 100
  window:
    width: 540
    height: 380
  contents:
    - x: 130
      y: 220
    - x: 410
      y: 220
      type: link
      path: /Applications
  background: build/dmg-background.png  # Optional custom background
```

#### Icon Requirements

**Format**: .icns file with multiple resolutions:
- 512×512@1x and 512×512@2x (1024×1024)
- 256×256@1x and 256×256@2x (512×512)
- 128×128@1x and 128×128@2x (256×256)
- 32×32@1x and 32×32@2x (64×64)
- 16×16@1x and 16×16@2x (32×32)

**Creation**:
```bash
# Create iconset folder
mkdir icon.iconset

# Convert and rename PNGs
cp icon-1024.png icon.iconset/icon_512x512@2x.png
cp icon-512.png icon.iconset/icon_512x512.png
cp icon-512.png icon.iconset/icon_256x256@2x.png
cp icon-256.png icon.iconset/icon_256x256.png
# ... etc

# Convert to icns
iconutil -c icns icon.iconset
```

#### Entitlements

**entitlements.plist** (for main app):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.cs.allow-jit</key>
  <true/>
  <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
  <true/>
  <key>com.apple.security.cs.disable-library-validation</key>
  <true/>
  <key>com.apple.security.files.user-selected.read-write</key>
  <true/>
</dict>
</plist>
```

**entitlements.inherit.plist** (for child processes):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.cs.allow-jit</key>
  <true/>
  <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
  <true/>
  <key>com.apple.security.cs.disable-library-validation</key>
  <true/>
</dict>
</plist>
```

**Why needed**: macOS hardened runtime requires explicit entitlements for JIT compilation (V8), dynamic code, etc.

### 6.5 Linux Packaging

#### Configuration

```yaml
linux:
  target:
    - AppImage        # Universal, self-contained
    - snap            # Ubuntu app store
    - deb             # Debian/Ubuntu packages
    - rpm             # Fedora/Red Hat packages
  category: Office
  icon: src/assets/icons/
  synopsis: Modern markdown viewer and editor
  description: |
    Zenny is a powerful markdown viewer and editor with live preview,
    split view, and PDF export capabilities.
  
  # Desktop entry
  desktop:
    Name: Zenny
    GenericName: Markdown Editor
    Comment: View and edit markdown files
    Categories: Office;TextEditor;Development;
    Keywords: markdown;editor;preview;
    MimeType: text/markdown;text/x-markdown;

appImage:
  license: LICENSE.txt

snap:
  confinement: strict
  grade: stable
  summary: Modern markdown viewer and editor
  plugs:
    - home              # Access user files
    - removable-media   # Access external drives
```

#### Icon Requirements

**Format**: PNG files at multiple resolutions:
- 512×512 (primary)
- 256×256
- 128×128
- 64×64
- 48×48
- 32×32
- 16×16

**Structure**:
```
src/assets/icons/
  512x512.png
  256x256.png
  128x128.png
  64x64.png
  48x48.png
  32x32.png
  16x16.png
```

**Naming**: electron-builder auto-detects by resolution in filename

#### AppImage vs. Snap vs. Deb/RPM

**AppImage** (Recommended as primary):
- Self-contained, portable
- No installation required
- Works on all distros
- No automatic updates (user managed)

**Snap**:
- Ubuntu app store distribution
- Automatic updates
- Sandboxed (may limit file access)
- Slower startup due to sandboxing

**Deb/RPM**:
- Traditional package managers
- Better system integration
- Requires separate builds for different distros
- Users familiar with this format

**Recommendation**: Provide AppImage as primary, plus deb and snap for users who prefer those formats.

### 6.6 Code Signing

#### Why Code Sign?

**Security**:
- Verifies publisher identity
- Prevents tampering detection
- Required for macOS notarization (mandatory on macOS 10.15+)

**User Trust**:
- No "Unknown Publisher" warnings on Windows
- No GateKeeper blocks on macOS
- Professional appearance

**Mandatory**:
- macOS: Required for notarization (enforced by OS)
- Windows: Not required but strongly recommended

#### macOS Code Signing

**Requirements**:
1. Apple Developer account ($99/year)
2. "Developer ID Application" certificate
3. macOS machine for signing (can use CI)

**Setup**:
1. Enroll in Apple Developer Program
2. Create certificate in Apple Developer portal
3. Download and install in Keychain
4. Configure electron-builder:
   ```yaml
   mac:
     identity: "Developer ID Application: Your Name (TEAM_ID)"
   ```

**Notarization**:
Required for macOS 10.15+. Submits app to Apple for malware scan.

**notarize.js** (automation script):
```javascript
const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') return;

  const appName = context.packager.appInfo.productFilename;
  
  return await notarize({
    appBundleId: 'com.zenny.mdviewer',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID
  });
};
```

**electron-builder.yml**:
```yaml
afterSign: build/notarize.js
```

**Environment Variables** (keep secret):
```bash
export APPLE_ID="your@email.com"
export APPLE_ID_PASSWORD="app-specific-password"  # Not your Apple ID password!
export APPLE_TEAM_ID="ABCD123456"
```

**Note**: Notarization takes 5-15 minutes per build.

#### Windows Code Signing

**Requirements**:
1. Code signing certificate (~$100-500/year)
2. Certificate from trusted CA (DigiCert, Sectigo, etc.)
3. Physical USB token or cloud signing service

**Types**:
- **EV Certificate** (Extended Validation): Best, instant reputation
- **Standard Certificate**: Slower to build reputation

**Setup**:
1. Purchase certificate
2. Install on machine or set up cloud signing
3. Configure electron-builder:
   ```yaml
   win:
     certificateFile: path/to/cert.p12
     certificatePassword: ${env.WIN_CSC_PASSWORD}
   ```

**Automatic Signing**:
electron-builder detects certificate and signs automatically if configured.

#### Linux Code Signing

**Not Required**: Linux doesn't have a code signing infrastructure like macOS/Windows.

**Alternative**: GPG signatures for packages (optional, for advanced users only)

### 6.7 Build Scripts

#### package.json Scripts

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:renderer\" \"npm run dev:main\"",
    "dev:renderer": "vite",
    "dev:main": "tsc -p tsconfig.main.json && electron .",
    
    "build": "npm run build:renderer && npm run build:main",
    "build:renderer": "vite build",
    "build:main": "tsc -p tsconfig.main.json",
    
    "package": "npm run build && electron-builder --dir",
    "dist": "npm run build && electron-builder",
    "dist:win": "npm run build && electron-builder --win",
    "dist:mac": "npm run build && electron-builder --mac",
    "dist:linux": "npm run build && electron-builder --linux",
    "dist:all": "npm run build && electron-builder -mwl",
    
    "release": "npm run build && electron-builder --publish always"
  }
}
```

#### CI/CD with GitHub Actions

**.github/workflows/build.yml**:
```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Package (macOS)
        if: matrix.os == 'macos-latest'
        run: npm run dist:mac
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_ID_PASSWORD: ${{ secrets.APPLE_ID_PASSWORD }}
          APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
      
      - name: Package (Windows)
        if: matrix.os == 'windows-latest'
        run: npm run dist:win
        env:
          WIN_CSC_PASSWORD: ${{ secrets.WIN_CSC_PASSWORD }}
      
      - name: Package (Linux)
        if: matrix.os == 'ubuntu-latest'
        run: npm run dist:linux
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}
          path: release/*
      
      - name: Release
        uses: softprops/action-gh-release@v1
        if: startsWith(github.ref, 'refs/tags/')
        with:
          files: release/*
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 6.8 Auto-Update Strategy (Future Phase)

#### Why Auto-Updates?

**Benefits**:
- Users always have latest features and security fixes
- Reduces support burden (fewer old version issues)
- Professional app experience

**Implementation Complexity**: Medium-high

#### Update Architecture

**Components**:
1. **Update server**: Hosts update manifest and installers
2. **electron-updater**: Client library for checking and installing updates
3. **GitHub Releases**: Free update hosting

**Flow**:
1. App checks for updates on startup (or periodically)
2. If newer version available, download in background
3. Prompt user to install and restart
4. Install update and relaunch

#### Configuration

**electron-builder.yml**:
```yaml
publish:
  provider: github
  owner: your-username
  repo: zenny-md-viewer
  releaseType: release  # or 'draft', 'prerelease'
```

**Code Integration**:
```typescript
import { autoUpdater } from 'electron-updater';

// Check for updates on startup
app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

// Update events
autoUpdater.on('update-available', () => {
  // Show notification
});

autoUpdater.on('update-downloaded', () => {
  // Prompt user to restart
});
```

**Recommendation**: Implement in Phase 2 after initial release. Focus on stable builds first.

---

## Section 7 — Future Enhancements

### 7.1 Synchronized Scrolling

#### Feature Description
When in split view, scrolling the editor causes the preview to scroll proportionally, keeping the user's context visible in both panes.

#### Implementation Approach

**Algorithm**:
1. Listen to editor scroll events
2. Calculate scroll percentage: `scrollPercent = scrollTop / (scrollHeight - clientHeight)`
3. Apply same percentage to preview: `preview.scrollTop = scrollPercent * (preview.scrollHeight - preview.clientHeight)`
4. Debounce to avoid janky performance

**Challenges**:
- Editor and preview heights differ (markdown is more compact than rendered HTML)
- Smooth scrolling can conflict with sync scrolling
- Performance overhead with large documents

**Solution**:
- Percentage-based scrolling works reasonably well
- Add toggle to enable/disable sync scrolling
- Use line markers (hidden elements) for more accurate syncing

**Priority**: High - greatly improves user experience in split view

**Effort**: Medium (2-3 days)

---

### 7.2 Themes and Customization

#### Feature Description
Allow users to customize editor and preview appearance with themes.

#### Themes to Support

**Built-in Themes**:
- Light (default)
- Dark
- High Contrast Light
- High Contrast Dark
- Solarized Light/Dark (popular among developers)

**Custom Themes**:
- JSON-based theme files
- User can create and import custom themes
- Theme includes:
  - Editor colors (background, text, syntax highlighting)
  - Preview colors and typography
  - UI colors (toolbar, status bar)

#### Implementation

**Theme System**:
- CSS variables for all colors
- Theme selector in settings
- Store preference in user config
- Live theme switching (no restart needed)

**Theme Format**:
```json
{
  "name": "Custom Theme",
  "type": "dark",
  "colors": {
    "editor.background": "#1e1e1e",
    "editor.foreground": "#d4d4d4",
    "preview.background": "#252526",
    "preview.text": "#cccccc",
    "ui.toolbar": "#333333"
  }
}
```

**Priority**: Medium-High - users appreciate customization

**Effort**: High (4-5 days)

---

### 7.3 Table of Contents (TOC)

#### Feature Description
Auto-generate clickable table of contents from markdown headings.

#### Display Options
- Sidebar panel (collapsible)
- Dropdown menu
- Overlay panel

#### Implementation

**TOC Generation**:
1. Parse markdown and extract headings (H1-H6)
2. Build hierarchical tree structure
3. Generate anchor links for each heading
4. Render as nested list with indentation

**Interactivity**:
- Click TOC item → scroll to heading in editor/preview
- Highlight current section in TOC (based on scroll position)
- Search/filter TOC entries

**Markdown Processing**:
```typescript
// Add IDs to headings during markdown rendering
const renderer = new marked.Renderer();
renderer.heading = (text, level, raw) => {
  const id = raw.toLowerCase().replace(/[^\w]+/g, '-');
  return `<h${level} id="${id}">${text}</h${level}>`;
};
```

**Priority**: Medium - very useful for long documents

**Effort**: Medium (3-4 days)

---

### 7.4 Drag and Drop

#### Feature Description
Drag files and images into the app to open or insert them.

#### Behaviors

**Drag Markdown File onto Window**:
- Opens file in editor (if no unsaved changes, or prompt)

**Drag Image onto Editor**:
- Uploads image to assets folder (or configured location)
- Inserts markdown image syntax: `![](path/to/image.png)`
- Alternatively, embed as base64 data URI (for self-contained documents)

**Drag Multiple Files**:
- Open first file, or show file picker

#### Implementation

**Drop Zones**:
- Entire window accepts file drops
- Editor accepts image drops
- Visual feedback (highlight drop zone)

**Code**:
```typescript
// Prevent default drag behavior
window.addEventListener('dragover', (e) => {
  e.preventDefault();
});

// Handle drop
window.addEventListener('drop', async (e) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  
  const mdFile = files.find(f => f.name.endsWith('.md'));
  if (mdFile) {
    await openFile(mdFile.path);
  }
  
  const images = files.filter(f => f.type.startsWith('image/'));
  if (images.length) {
    await insertImages(images);
  }
});
```

**Priority**: Medium - nice convenience feature

**Effort**: Low-Medium (2-3 days)

---

### 7.5 Settings Persistence

#### Feature Description
Persistent user preferences across sessions.

#### Settings to Persist

**Editor Settings**:
- Font family and size
- Line wrapping on/off
- Line numbers on/off
- Tab size (spaces)
- Auto-save interval

**Preview Settings**:
- Font family and size
- Code block theme
- Render math (KaTeX) on/off

**UI Settings**:
- Theme (light/dark)
- View mode (editor/preview/split)
- Split pane ratio
- Window size and position
- Toolbar visibility

**PDF Settings**:
- Default paper size
- Default margins
- Include page numbers
- Header/footer preferences

**File Settings**:
- Recent files list
- Last opened file (restore on launch option)
- Auto-save enabled/disabled

#### Storage Location

**macOS**: `~/Library/Application Support/Zenny/preferences.json`
**Windows**: `%APPDATA%/Zenny/preferences.json`
**Linux**: `~/.config/Zenny/preferences.json`

**Access**: Use Electron's `app.getPath('userData')`

#### Implementation

**Settings Service**:
```typescript
class SettingsService {
  private settings: Settings;
  private filePath: string;

  constructor() {
    this.filePath = path.join(app.getPath('userData'), 'preferences.json');
    this.load();
  }

  load() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.settings = JSON.parse(data);
    } catch {
      this.settings = getDefaultSettings();
    }
  }

  save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.settings, null, 2));
  }

  get<T>(key: string): T {
    return this.settings[key];
  }

  set(key: string, value: any) {
    this.settings[key] = value;
    this.save();
  }
}
```

**Settings UI**:
- Preferences dialog (Cmd+, / Ctrl+,)
- Categorized tabs: Editor, Preview, PDF, Advanced
- Search settings feature
- Reset to defaults button

**Priority**: High - essential for good UX

**Effort**: Medium (3-4 days)

---

### 7.6 Plugin Architecture

#### Feature Description
Extensibility system allowing third-party plugins.

#### Plugin Capabilities

**Markdown Extensions**:
- Custom markdown syntax (e.g., [[wikilinks]], @mentions)
- Custom renderers (e.g., mermaid diagrams, math, charts)

**Editor Extensions**:
- Custom commands
- Snippets
- Autocomplete providers

**UI Extensions**:
- Custom toolbar buttons
- Side panels
- Context menu items

**Export Extensions**:
- Custom export formats (e.g., HTML, DOCX, LaTeX)

#### Plugin API

**Plugin Structure**:
```typescript
interface ZennyPlugin {
  id: string;
  name: string;
  version: string;
  activate(api: PluginAPI): void;
  deactivate(): void;
}

interface PluginAPI {
  registerMarkdownExtension(extension: MarkdownExtension): void;
  registerCommand(id: string, handler: () => void): void;
  registerExporter(exporter: Exporter): void;
  getEditor(): EditorAPI;
  getPreview(): PreviewAPI;
}
```

**Plugin Loading**:
- Plugins live in `~/.zenny/plugins/` directory
- Each plugin in its own folder with `package.json` and entry point
- Load plugins on startup
- Enable/disable via settings

#### Security Considerations

**Sandboxing**:
- Plugins run in renderer process (limited privileges)
- No direct file system access (use plugin API)
- Review plugins before installation

**Plugin Store**:
- Official plugin registry (future)
- Verified plugins badge
- Community ratings and reviews

**Priority**: Low - complex feature, nice-to-have

**Effort**: Very High (2-3 weeks)

---

### 7.7 Additional Future Enhancements

#### Find and Replace
- Ctrl/Cmd+F: Find in editor
- Ctrl/Cmd+H: Find and replace
- Regex support
- Case sensitivity toggle
- Multi-file search (future+)

**Priority**: High | **Effort**: Low-Medium (2 days)

---

#### Multi-Tab Editing
- Open multiple files in tabs
- Drag to reorder tabs
- Split tabs into panes
- Restore tabs on startup

**Priority**: Medium | **Effort**: High (1 week)

---

#### Version Control Integration
- Git status indicators in editor
- Commit and push from app
- Diff view for changes
- Branch switching

**Priority**: Low-Medium | **Effort**: Very High (2+ weeks)

---

#### Cloud Sync
- Sync files across devices
- Conflict resolution
- Offline mode
- Integration with Dropbox, Google Drive, or custom backend

**Priority**: Low | **Effort**: Very High (3+ weeks)

---

#### Collaboration Features
- Real-time collaborative editing (like Google Docs)
- Comments and suggestions
- Share links to documents
- Requires backend infrastructure

**Priority**: Low | **Effort**: Extremely High (months)

---

#### Markdown Extensions
- WikiLinks: `[[page]]`
- Footnotes: `[^1]`
- Task lists: `- [ ] Task`
- Math: `$E=mc^2$` (KaTeX)
- Mermaid diagrams
- Admonitions/callouts

**Priority**: Medium | **Effort**: Medium (1-2 days per extension)

---

#### Export to Other Formats
- HTML export (standalone with CSS)
- DOCX export (via pandoc)
- LaTeX export
- Slideshows (reveal.js, remark)

**Priority**: Medium | **Effort**: High per format (3-5 days)

---

#### Presentation Mode
- Convert markdown to slides
- Speaker notes
- Timer and slide counter
- Export to reveal.js

**Priority**: Low | **Effort**: High (1-2 weeks)

---

## Implementation Timeline

### MVP (Minimum Viable Product) - 4-5 weeks

**Week 1**:
- Phase 1: App setup
- Basic Electron window
- Security configuration
- Development environment

**Week 2-3**:
- Phase 2: Markdown editor integration
- Phase 3: Preview rendering
- Phase 4: Split view logic

**Week 3-4**:
- Phase 5: File open/save logic
- Phase 6: PDF export
- Testing and bug fixes

**Week 5**:
- Phase 7: Packaging and installers
- Documentation
- Release preparation

### Post-MVP Enhancements

**Version 1.1** (1-2 weeks after MVP):
- Settings persistence
- Synchronized scrolling
- Find and replace
- Table of contents

**Version 1.2** (1 month after MVP):
- Themes and customization
- Drag and drop
- Improved PDF export options
- Performance optimizations

**Version 2.0** (3+ months after MVP):
- Multi-tab editing
- Plugin architecture
- Advanced markdown extensions
- Auto-update system

---

## Risk Mitigation Summary

### Technical Risks

| Risk | Mitigation Strategy |
|------|---------------------|
| Security vulnerabilities | Follow Electron security checklist, enable all security features, regular audits |
| Build configuration complexity | Use templates, test early and often, document thoroughly |
| Cross-platform bugs | Test on all platforms regularly, use VMs or CI/CD |
| Performance with large files | Optimize rendering, use virtual scrolling, streaming for huge files |
| PDF export quality issues | Test with diverse markdown content, iterate on print CSS |

### Project Risks

| Risk | Mitigation Strategy |
|------|---------------------|
| Scope creep | Stick to MVP plan, defer enhancements to post-MVP |
| Underestimating complexity | Add 20% buffer to estimates, prioritize ruthlessly |
| Dependency vulnerabilities | Regular `npm audit`, automated security scanning |
| Code signing costs | Factor into budget, consider alternatives for initial release |
| Platform-specific issues | Cross-platform testing cadence, community beta testing |

---

## Success Criteria

### MVP Success Metrics

**Functionality**:
✅ Opens and displays Markdown files correctly
✅ Editor allows comfortable text editing with syntax highlighting
✅ Preview renders markdown accurately and securely
✅ Split view provides side-by-side editing and preview
✅ PDF export produces high-quality, printable documents
✅ Installers install and launch successfully on all platforms

**Performance**:
✅ Handles files up to 1MB without lag
✅ Preview updates within 300ms of typing
✅ App launches in <3 seconds
✅ PDF export completes in <10 seconds for typical documents

**Quality**:
✅ No critical bugs
✅ All keyboard shortcuts work
✅ File operations are reliable (no data loss)
✅ User interface is intuitive and polished

**Distribution**:
✅ Installers available for Windows, macOS, and Linux
✅ No security warnings (if signed)
✅ File associations work correctly

---

## Conclusion

This implementation plan provides a comprehensive roadmap for building Zenny, a production-ready Markdown viewer built with Electron, React, and TypeScript. The plan balances feature richness with development pragmatism, prioritizing security, user experience, and code quality.

By following this phased approach, starting with a solid MVP and iterating with enhancements, the project can deliver value quickly while building toward a fully-featured application. The architectural decisions—security-first design, clear process separation, robust state management—ensure the codebase remains maintainable and scalable.

The estimated timeline of 4-5 weeks for the MVP is aggressive but achievable with focused effort. Post-MVP enhancements will transform the application from functional to exceptional, adding convenience features and customization options that users expect from professional desktop software.

**Next Steps**:
1. Review and approve this plan
2. Set up development environment
3. Begin Phase 1: Application Setup
4. Maintain regular progress reviews and adapt as needed

Good luck building Zenny! 🚀
