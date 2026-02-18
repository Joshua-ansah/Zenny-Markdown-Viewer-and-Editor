import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
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

// PDF Export Helper
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

function createWindow() {
  // Create the browser window with security settings
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
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
      const fullHTML = generatePDFHTML(options.htmlContent);

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

      // Wait for content to fully render
      await new Promise(resolve => setTimeout(resolve, 500));

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
