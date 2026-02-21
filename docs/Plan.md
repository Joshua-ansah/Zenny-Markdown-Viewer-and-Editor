## Role

You are a senior software architect.

## Tech Stack

Build a production-ready, installable desktop Markdown Viewer using:

- Electron
- React
- TypeScript

## Core Capabilities

The application must support:

1. Opening and viewing `.md` / Markdown files
2. Raw Markdown editor view
3. Rendered preview view
4. Split view (editor + preview side-by-side)
5. Exporting Markdown to PDF
6. Generating installable builds (Windows, macOS, Linux)

## Assignment

Create a complete, production-level implementation plan that covers the sections below.

## Section 1 — System Architecture

- Electron main vs renderer process responsibilities
- IPC communication structure
- File system access strategy
- Security best practices (contextIsolation, preload scripts, etc.)
- PDF export architecture
- State management strategy in React
- Markdown parsing engine choice and reasoning

## Section 2 — Project Structure

Provide a clean, scalable folder structure for:

- Electron main process
- Preload scripts
- React app
- Shared types
- Utilities

Include explanations for why each folder exists.

## Section 3 — Feature Implementation Breakdown

Break implementation into phases:

1. App setup
2. Markdown editor integration
3. Preview rendering
4. Split view logic
5. File open/save logic
6. Export to PDF
7. Packaging and installers

For each phase detail:

- Tasks
- Key libraries
- Risks or common pitfalls

## Section 4 — UI/UX Design Plan

- Layout design
- View switching logic (raw | preview | split)
- Toolbar structure
- Menu configuration
- Keyboard shortcuts

## Section 5 — PDF Export Strategy

Explain:

- How to use `webContents.printToPDF`
- Alternative approaches
- Styling for printable Markdown
- Page size configuration
- Margin handling

## Section 6 — Packaging & Distribution

- Using `electron-builder`
- Generating `.exe`, `.dmg`, `.AppImage`
- Code signing overview
- Auto-update option (future phase)

## Section 7 — Future Enhancements

Suggest advanced improvements:

- Sync scrolling
- Themes
- Table of contents
- Drag & drop
- Settings persistence
- Plugin architecture

## Important Requirements

- Be highly detailed
- Think like a real production app
- Avoid generic explanations
- Provide reasoning behind decisions
- Use clear technical language
- Do **not** write code yet—only the architectural plan
