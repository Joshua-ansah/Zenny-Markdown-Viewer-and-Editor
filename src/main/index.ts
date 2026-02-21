import { app, BrowserWindow, ipcMain, dialog, shell, Menu } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import { IPC_CHANNELS } from '../shared/constants/channels';
import type {
  FileOperationResult,
  SaveFileOptions,
  PDFExportOptions,
  PDFExportResult,
  RecentFile,
  RecentFilesResult,
  ResolvePathOptions,
  ResolvePathResult,
  ReadDirectoryResult,
  DirectoryNode,
} from '../shared/types/ipc';

let mainWindow: BrowserWindow | null = null;

// Recent Files Management
const MAX_RECENT_FILES = 10;
let recentFiles: RecentFile[] = [];
const recentFilesPath = path.join(app.getPath('userData'), 'recent-files.json');

async function loadRecentFiles(): Promise<void> {
  try {
    const data = await fs.readFile(recentFilesPath, 'utf-8');
    recentFiles = JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or error reading, start with empty array
    recentFiles = [];
  }
}

async function saveRecentFiles(): Promise<void> {
  try {
    await fs.mkdir(path.dirname(recentFilesPath), { recursive: true });
    await fs.writeFile(recentFilesPath, JSON.stringify(recentFiles, null, 2));
  } catch (error) {
    console.error('Failed to save recent files:', error);
  }
}

async function addRecentFile(filePath: string): Promise<void> {
  const fileName = path.basename(filePath);
  
  // Remove if already exists (to update timestamp)
  recentFiles = recentFiles.filter(f => f.path !== filePath);
  
  // Add to front
  recentFiles.unshift({
    path: filePath,
    name: fileName,
    lastOpened: Date.now(),
  });
  
  // Keep only MAX_RECENT_FILES
  recentFiles = recentFiles.slice(0, MAX_RECENT_FILES);
  
  await saveRecentFiles();
}

// PDF Export Helper - Single File
function generatePDFHTML(htmlContent: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PDF Export</title>
  <style>
    /* Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica', 'Arial', sans-serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #24292e;
      background: #ffffff;
      padding: 20px;
      max-width: none;
    }

    /* Headings */
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
      page-break-after: avoid;
    }

    h1 { font-size: 24pt; border-bottom: 1px solid #eaecef; padding-bottom: 8px; }
    h2 { font-size: 20pt; border-bottom: 1px solid #eaecef; padding-bottom: 6px; }
    h3 { font-size: 16pt; }
    h4 { font-size: 14pt; }
    h5 { font-size: 12pt; }
    h6 { font-size: 11pt; color: #6a737d; }

    /* Paragraphs and Text */
    p {
      margin-top: 0;
      margin-bottom: 10px;
    }

    /* Links */
    a {
      color: #0366d6;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    /* Lists */
    ul, ol {
      margin-top: 0;
      margin-bottom: 10px;
      padding-left: 24px;
    }

    li {
      margin-bottom: 4px;
    }

    /* Code */
    code {
      font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', monospace;
      font-size: 10pt;
      padding: 2px 4px;
      background-color: rgba(27, 31, 35, 0.05);
      border-radius: 3px;
    }

    pre {
      font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', monospace;
      font-size: 10pt;
      padding: 12px;
      background-color: #f6f8fa;
      border-radius: 6px;
      overflow-x: auto;
      margin-bottom: 10px;
      page-break-inside: avoid;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    pre code {
      padding: 0;
      background-color: transparent;
      border-radius: 0;
    }

    /* Blockquotes */
    blockquote {
      padding: 0 16px;
      color: #6a737d;
      border-left: 4px solid #dfe2e5;
      margin-bottom: 10px;
    }

    /* Tables */
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 10px;
      page-break-inside: avoid;
    }

    table th,
    table td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }

    table th {
      font-weight: 600;
      background-color: #f6f8fa;
    }

    table tr:nth-child(2n) {
      background-color: #f6f8fa;
    }

    /* Images */
    img {
      max-width: 100%;
      height: auto;
      page-break-inside: avoid;
      margin-bottom: 10px;
    }

    /* Horizontal Rule */
    hr {
      height: 2px;
      padding: 0;
      margin: 24px 0;
      background-color: #e1e4e8;
      border: 0;
    }

    /* Print-specific styles */
    @media print {
      body {
        padding: 0;
      }

      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
      }

      pre, code, blockquote, table, img {
        page-break-inside: avoid;
      }

      a {
        color: #0366d6;
        text-decoration: underline;
      }
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
  `.trim();
}

// PDF Export Helper - Multi-File with TOC
function generateMultiFilePDFHTML(files: { content: string; title: string; path: string }[]): string {
  // Generate table of contents with chapter numbers
  const tocItems = files
    .map((file, index) => {
      const chapterNum = index + 1;
      const sanitizedTitle = file.title.replace(/[^a-zA-Z0-9-_]/g, '-');
      const fileId = `chapter-${chapterNum}-${sanitizedTitle}`;
      return `        <li class="toc-item">
          <span class="toc-chapter">Chapter ${chapterNum}</span>
          <a href="#${fileId}" class="toc-link">${file.title}</a>
          <span class="toc-dots"></span>
          <span class="toc-page">${chapterNum}</span>
        </li>`;
    })
    .join('\n');

  // Generate file sections as chapters with page breaks
  const fileSections = files
    .map((file, index) => {
      const chapterNum = index + 1;
      const sanitizedTitle = file.title.replace(/[^a-zA-Z0-9-_]/g, '-');
      const fileId = `chapter-${chapterNum}-${sanitizedTitle}`;
      const pageBreak = index < files.length - 1 ? '<div class="chapter-break"></div>' : '';

      return `
    <div id="${fileId}" class="chapter">
      <div class="chapter-header">
        <div class="chapter-number">Chapter ${chapterNum}</div>
        <h1 class="chapter-title">${file.title}</h1>
      </div>
      <div class="chapter-content">
        ${file.content}
      </div>
    </div>
    ${pageBreak}`;
    })
    .join('\n');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documentation Export</title>
  <style>
    /* Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.8;
      color: #2c3e50;
      background: #ffffff;
      padding: 40px 60px;
      max-width: none;
    }

    /* Cover Page & Table of Contents */
    .toc {
      page-break-after: always;
      padding: 20px 0;
    }

    .toc h1 {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 36pt;
      font-weight: bold;
      text-align: center;
      margin-bottom: 50px;
      margin-top: 80px;
      color: #1a252f;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .toc ul {
      list-style-type: none;
      padding: 0;
      margin-top: 30px;
    }

    .toc-item {
      margin-bottom: 16px;
      padding: 8px 0;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      align-items: baseline;
      position: relative;
    }

    .toc-chapter {
      font-size: 9pt;
      color: #7f8c8d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-right: 12px;
      min-width: 90px;
      font-weight: 600;
    }

    .toc-link {
      font-size: 13pt;
      color: #2c3e50;
      text-decoration: none;
      font-weight: 500;
      flex-shrink: 0;
    }

    .toc-dots {
      flex-grow: 1;
      border-bottom: 2px dotted #bdc3c7;
      margin: 0 10px 4px 10px;
      min-width: 20px;
    }

    .toc-page {
      font-size: 11pt;
      color: #7f8c8d;
      min-width: 30px;
      text-align: right;
    }

    .toc-link:hover {
      color: #3498db;
    }

    /* Chapter Styling */
    .chapter {
      page-break-inside: avoid;
      margin-bottom: 40px;
    }

    .chapter-header {
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #34495e;
    }

    .chapter-number {
      font-size: 11pt;
      font-weight: 600;
      color: #7f8c8d;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 12px;
      font-family: 'Arial', sans-serif;
    }

    .chapter-title {
      font-size: 32pt;
      font-weight: bold;
      color: #1a252f;
      line-height: 1.3;
      margin: 0;
      font-family: 'Georgia', 'Times New Roman', serif;
    }

    .chapter-content {
      padding-top: 20px;
    }

    .chapter-break {
      page-break-before: always;
    }

    /* Headings in Chapter Content */
    .chapter-content h1,
    .chapter-content h2,
    .chapter-content h3,
    .chapter-content h4,
    .chapter-content h5,
    .chapter-content h6 {
      font-family: 'Georgia', 'Times New Roman', serif;
      margin-top: 28px;
      margin-bottom: 14px;
      font-weight: 600;
      line-height: 1.4;
      page-break-after: avoid;
      color: #2c3e50;
    }

    .chapter-content h1 {
      font-size: 20pt;
      border-bottom: 2px solid #34495e;
      padding-bottom: 10px;
      margin-top: 36px;
    }

    .chapter-content h2 {
      font-size: 17pt;
      border-bottom: 1px solid #bdc3c7;
      padding-bottom: 8px;
    }

    .chapter-content h3 { font-size: 14pt; }
    .chapter-content h4 { font-size: 12pt; }
    .chapter-content h5 { font-size: 11pt; }
    .chapter-content h6 { font-size: 10pt; color: #7f8c8d; }

    /* Paragraphs */
    p {
      margin-bottom: 14px;
      text-align: justify;
      orphans: 3;
      widows: 3;
    }

    /* Links */
    a {
      color: #3498db;
      text-decoration: none;
      font-weight: 500;
    }

    a:hover {
      text-decoration: underline;
    }

    /* Lists */
    ul, ol {
      margin: 14px 0;
      padding-left: 28px;
    }

    li {
      margin-bottom: 8px;
      line-height: 1.7;
    }

    /* Code Blocks */
    code {
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 9.5pt;
      padding: 3px 6px;
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 3px;
      color: #e74c3c;
    }

    pre {
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 9pt;
      padding: 16px;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-left: 4px solid #3498db;
      border-radius: 4px;
      overflow-x: auto;
      margin: 18px 0;
      page-break-inside: avoid;
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.5;
    }

    pre code {
      padding: 0;
      background: transparent;
      border: none;
      color: inherit;
    }

    /* Blockquotes */
    blockquote {
      padding: 12px 20px;
      margin: 18px 0;
      color: #5a6c7d;
      background-color: #f8f9fa;
      border-left: 5px solid #3498db;
      font-style: italic;
      page-break-inside: avoid;
    }

    blockquote p:last-child {
      margin-bottom: 0;
    }

    /* Tables */
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 20px 0;
      page-break-inside: avoid;
      font-size: 10pt;
    }

    table th,
    table td {
      padding: 10px 14px;
      border: 1px solid #bdc3c7;
      text-align: left;
    }

    table th {
      font-weight: 600;
      background-color: #34495e;
      color: #ffffff;
      text-transform: uppercase;
      font-size: 9pt;
      letter-spacing: 0.5px;
    }

    table tr:nth-child(even) {
      background-color: #f8f9fa;
    }

    table tr:hover {
      background-color: #ecf0f1;
    }

    /* Images */
    img {
      max-width: 100%;
      height: auto;
      page-break-inside: avoid;
      margin: 20px 0;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      display: block;
    }

    /* Horizontal Rules */
    hr {
      height: 2px;
      padding: 0;
      margin: 32px 0;
      background: linear-gradient(to right, #34495e, #bdc3c7, #34495e);
      border: 0;
    }

    /* Print-specific Styles */
    @media print {
      body {
        padding: 30px 40px;
      }

      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
      }

      .chapter-header {
        page-break-after: avoid;
      }

      pre, code, blockquote, table, img {
        page-break-inside: avoid;
      }

      a {
        color: #3498db;
        text-decoration: underline;
      }

      .chapter-break {
        page-break-before: always;
      }

      .toc {
        page-break-after: always;
      }
    }
  </style>
</head>
<body>
  <div class="toc">
    <h1>Table of Contents</h1>
    <ul>
${tocItems}
    </ul>
  </div>
${fileSections}
</body>
</html>
  `.trim();
}

function createMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools();
            }
          }
        },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow() {
  // Create the application menu
  createMenu();

  // Determine icon path
  const iconPath = process.env.VITE_DEV_SERVER_URL
    ? path.join(__dirname, '../../build/icon.png')
    : path.join(process.resourcesPath, 'icon.png');

  // Create the browser window with security settings
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: iconPath,
    webPreferences: {
      // Security: Enable context isolation
      contextIsolation: true,
      // Security: Disable Node integration in renderer
      nodeIntegration: false,
      // Security: Enable sandbox
      sandbox: true,
      // Preload script
      preload: path.join(__dirname, '../preload/index.js'),
    },
    title: 'Zenny',
    backgroundColor: '#ffffff',
  });

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    // Development mode
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    // Production mode
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle window close - check for unsaved changes
  mainWindow.on('close', async (e) => {
    // This will be handled by renderer - renderer can send a message to prevent close
    // For now, allow close. In the future, add IPC to check dirty state
  });
}

// App lifecycle
app.whenReady().then(async () => {
  await loadRecentFiles();
  createWindow();

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS, keep app running until Cmd+Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers

// File: Open
ipcMain.handle(IPC_CHANNELS.FILE_OPEN, async (): Promise<FileOperationResult> => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Markdown Files', extensions: ['md', 'markdown'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, error: 'No file selected' };
    }

    const filePath = result.filePaths[0];
    const content = await fs.readFile(filePath, 'utf-8');
    const name = path.basename(filePath);

    // Add to recent files
    await addRecentFile(filePath);

    return {
      success: true,
      data: {
        content,
        path: filePath,
        name,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

// File: Save
ipcMain.handle(
  IPC_CHANNELS.FILE_SAVE,
  async (_, options: SaveFileOptions): Promise<FileOperationResult> => {
    try {
      let filePath = options.path;

      // If no path provided, show save dialog
      if (!filePath) {
        const result = await dialog.showSaveDialog({
          filters: [
            { name: 'Markdown Files', extensions: ['md'] },
            { name: 'All Files', extensions: ['*'] },
          ],
        });

        if (result.canceled || !result.filePath) {
          return { success: false, error: 'Save cancelled' };
        }

        filePath = result.filePath;
      }

      // Atomic write: write to temp file first, then rename
      const tempPath = `${filePath}.tmp`;
      await fs.writeFile(tempPath, options.content, 'utf-8');
      await fs.rename(tempPath, filePath);

      const name = path.basename(filePath);

      return {
        success: true,
        data: {
          content: options.content,
          path: filePath,
          name,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
);

// File: Save As
ipcMain.handle(
  IPC_CHANNELS.FILE_SAVE_AS,
  async (_, options: SaveFileOptions): Promise<FileOperationResult> => {
    try {
      // Always show save dialog for Save As
      const result = await dialog.showSaveDialog({
        filters: [
          { name: 'Markdown Files', extensions: ['md', 'markdown'] },
          { name: 'Text Files', extensions: ['txt'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      });

      if (result.canceled || !result.filePath) {
        return {
          success: false,
          error: 'Save canceled',
        };
      }

      // Write file atomically
      const tempPath = `${result.filePath}.tmp`;
      await fs.writeFile(tempPath, options.content, 'utf-8');
      await fs.rename(tempPath, result.filePath);

      return {
        success: true,
        data: {
          content: options.content,
          path: result.filePath,
          name: path.basename(result.filePath),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
);

// PDF: Export Dialog
ipcMain.handle(IPC_CHANNELS.PDF_EXPORT_DIALOG, async (): Promise<{ choice: number | null }> => {
  try {
    const result = await dialog.showMessageBox({
      type: 'question',
      title: 'PDF Export Options',
      message: 'Choose export option:',
      detail: 'Select how you want to export your markdown files to PDF.',
      buttons: [
        'Export Entire Directory',
        'Export Current Page Only',
        'Cancel'
      ],
      defaultId: 0,
      cancelId: 2,
      noLink: true,
    });

    // Return 1, 2, or null based on button clicked
    if (result.response === 2) {
      return { choice: null }; // Cancel
    }
    return { choice: result.response + 1 }; // 1 or 2
  } catch (error) {
    console.error('Failed to show PDF export dialog:', error);
    return { choice: null };
  }
});

// PDF: Export
ipcMain.handle(
  IPC_CHANNELS.PDF_EXPORT,
  async (_, options: PDFExportOptions): Promise<PDFExportResult> => {
    let pdfWindow: BrowserWindow | null = null;

    try {
      // Show save dialog first
      const result = await dialog.showSaveDialog({
        filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
        defaultPath: 'document.pdf',
      });

      if (result.canceled || !result.filePath) {
        return { success: false, error: 'Export cancelled' };
      }

      const outputPath = result.filePath;

      // Generate complete HTML with print styles
      let fullHTML: string;

      if (options.includeLinkedFiles && options.htmlContents && options.htmlContents.length > 0) {
        // Multi-file export with TOC
        fullHTML = generateMultiFilePDFHTML(options.htmlContents);
      } else if (options.htmlContent) {
        // Single file export
        fullHTML = generatePDFHTML(options.htmlContent);
      } else {
        return { success: false, error: 'No content provided for export' };
      }

      // Create hidden window for PDF rendering
      pdfWindow = new BrowserWindow({
        show: false,
        webPreferences: {
          offscreen: true,
          contextIsolation: true,
          nodeIntegration: false,
          sandbox: true,
        },
      });

      // Load HTML content
      await pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(fullHTML)}`);

      // Wait for content to fully render (longer for multi-file)
      const renderDelay = options.includeLinkedFiles ? 1000 : 500;
      await new Promise(resolve => setTimeout(resolve, renderDelay));

      // Configure PDF options
      const pdfOptions: Electron.PrintToPDFOptions = {
        pageSize: options.pageSize || 'A4',
        printBackground: true,
        printSelectionOnly: false,
        landscape: false,
      };

      // If custom margins provided, use them
      if (options.margins) {
        pdfOptions.margins = {
          top: options.margins.top || 0.5,
          bottom: options.margins.bottom || 0.5,
          left: options.margins.left || 0.5,
          right: options.margins.right || 0.5,
        };
      }

      // Generate PDF
      const pdfData = await pdfWindow.webContents.printToPDF(pdfOptions);

      // Save PDF to file
      await fs.writeFile(outputPath, pdfData);

      // Clean up
      pdfWindow.close();
      pdfWindow = null;

      return {
        success: true,
        path: outputPath,
      };
    } catch (error) {
      // Clean up window if error occurred
      if (pdfWindow && !pdfWindow.isDestroyed()) {
        pdfWindow.close();
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
);

// App: Set window title
ipcMain.handle(IPC_CHANNELS.APP_SET_TITLE, async (_, title: string) => {
  if (mainWindow) {
    mainWindow.setTitle(title);
  }
});

// App: Open external link in browser
ipcMain.handle(IPC_CHANNELS.APP_OPEN_EXTERNAL, async (_, url: string) => {
  try {
    // Validate URL before opening
    const urlObj = new URL(url);
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      await shell.openExternal(url);
    } else {
      throw new Error('Only HTTP and HTTPS URLs are allowed');
    }
  } catch (error) {
    console.error('Failed to open external link:', error);
    throw error;
  }
});

// File: Get recent files
ipcMain.handle(IPC_CHANNELS.FILE_GET_RECENT, async (): Promise<RecentFilesResult> => {
  try {
    return {
      success: true,
      files: recentFiles,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

// File: Clear recent files
ipcMain.handle(IPC_CHANNELS.FILE_CLEAR_RECENT, async (): Promise<RecentFilesResult> => {
  try {
    recentFiles = [];
    await saveRecentFiles();
    return {
      success: true,
      files: [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

// File: Open recent file
ipcMain.handle(
  IPC_CHANNELS.FILE_OPEN_RECENT,
  async (_, filePath: string): Promise<FileOperationResult> => {
    try {
      // Check if file still exists
      await fs.access(filePath);
      
      const content = await fs.readFile(filePath, 'utf-8');
      const name = path.basename(filePath);

      // Update recent files list (move to top)
      await addRecentFile(filePath);

      return {
        success: true,
        data: {
          content,
          path: filePath,
          name,
        },
      };
    } catch (error) {
      // File doesn't exist anymore, remove from recent files
      recentFiles = recentFiles.filter(f => f.path !== filePath);
      await saveRecentFiles();
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'File not found',
      };
    }
  }
);

// App: Resolve relative path
ipcMain.handle(
  IPC_CHANNELS.APP_RESOLVE_PATH,
  async (_, options: ResolvePathOptions): Promise<ResolvePathResult> => {
    try {
      const { basePath, relativePath } = options;

      // Get directory of the base file
      const baseDir = path.dirname(basePath);

      // Resolve the relative path against the base directory
      let resolvedPath = path.resolve(baseDir, relativePath);

      // Check if file exists
      try {
        await fs.access(resolvedPath);
        return {
          success: true,
          path: resolvedPath,
          exists: true,
        };
      } catch {
        // Try with .md extension if not found
        if (!resolvedPath.endsWith('.md') && !resolvedPath.endsWith('.markdown')) {
          const mdPath = resolvedPath + '.md';
          try {
            await fs.access(mdPath);
            return {
              success: true,
              path: mdPath,
              exists: true,
            };
          } catch {
            // Try .markdown extension
            const markdownPath = resolvedPath + '.markdown';
            try {
              await fs.access(markdownPath);
              return {
                success: true,
                path: markdownPath,
                exists: true,
              };
            } catch {
              // File doesn't exist with any extension
              return {
                success: true,
                path: resolvedPath,
                exists: false,
              };
            }
          }
        }

        return {
          success: true,
          path: resolvedPath,
          exists: false,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to resolve path',
      };
    }
  }
);

// App: Read directory contents
ipcMain.handle(
  IPC_CHANNELS.APP_READ_DIRECTORY,
  async (_, dirPath: string): Promise<ReadDirectoryResult> => {
    try {
      // Check if directory exists
      const stats = await fs.stat(dirPath);
      if (!stats.isDirectory()) {
        return {
          success: false,
          error: 'Path is not a directory',
        };
      }

      // Read directory contents
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      // Filter and map to DirectoryNode
      const nodes: DirectoryNode[] = [];

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // Include all directories
          nodes.push({
            name: entry.name,
            path: fullPath,
            isDirectory: true,
          });
        } else if (entry.isFile()) {
          // Only include .md and .markdown files
          const ext = path.extname(entry.name).toLowerCase();
          if (ext === '.md' || ext === '.markdown') {
            nodes.push({
              name: entry.name,
              path: fullPath,
              isDirectory: false,
            });
          }
        }
      }

      // Sort: directories first, then files, alphabetically
      nodes.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      return {
        success: true,
        nodes,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to read directory',
      };
    }
  }
);

