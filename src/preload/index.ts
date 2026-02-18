import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants/channels';
import type {
  FileOperationResult,
  SaveFileOptions,
  PDFExportOptions,
  PDFExportResult,
  ViewMode,
  RecentFilesResult,
} from '../shared/types/ipc';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI = {
  // File operations
  openFile: (): Promise<FileOperationResult> => {
    return ipcRenderer.invoke(IPC_CHANNELS.FILE_OPEN);
  },

  saveFile: (options: SaveFileOptions): Promise<FileOperationResult> => {
    return ipcRenderer.invoke(IPC_CHANNELS.FILE_SAVE, options);
  },

  saveFileAs: (options: SaveFileOptions): Promise<FileOperationResult> => {
    return ipcRenderer.invoke(IPC_CHANNELS.FILE_SAVE_AS, options);
  },

  // PDF export
  exportToPDF: (options: PDFExportOptions): Promise<PDFExportResult> => {
    return ipcRenderer.invoke(IPC_CHANNELS.PDF_EXPORT, options);
  },

  // App operations
  setTitle: (title: string): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.APP_SET_TITLE, title);
  },

  openExternal: (url: string): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.APP_OPEN_EXTERNAL, url);
  },

  // Recent files
  getRecentFiles: (): Promise<RecentFilesResult> => {
    return ipcRenderer.invoke(IPC_CHANNELS.FILE_GET_RECENT);
  },

  openRecentFile: (filePath: string): Promise<FileOperationResult> => {
    return ipcRenderer.invoke(IPC_CHANNELS.FILE_OPEN_RECENT, filePath);
  },

  clearRecentFiles: (): Promise<RecentFilesResult> => {
    return ipcRenderer.invoke(IPC_CHANNELS.FILE_CLEAR_RECENT);
  },

  // Menu event listeners (main -> renderer)
  onToggleView: (callback: (viewMode: ViewMode) => void) => {
    ipcRenderer.on(IPC_CHANNELS.MENU_TOGGLE_VIEW, (_, viewMode) => callback(viewMode));
  },

  onNewFile: (callback: () => void) => {
    ipcRenderer.on(IPC_CHANNELS.MENU_NEW_FILE, () => callback());
  },

  onExportPDF: (callback: () => void) => {
    ipcRenderer.on(IPC_CHANNELS.MENU_EXPORT_PDF, () => callback());
  },
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Type declaration for TypeScript
export type ElectronAPI = typeof electronAPI;
