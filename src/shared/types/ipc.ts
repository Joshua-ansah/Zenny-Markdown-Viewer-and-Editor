// File operation types
export interface FileData {
  content: string;
  path: string;
  name: string;
}

export interface FileOperationResult {
  success: boolean;
  error?: string;
  data?: FileData;
}

export interface SaveFileOptions {
  content: string;
  path?: string; // If undefined, will show save dialog
}

// PDF export types
export interface PDFExportOptions {
  htmlContent: string; // Already parsed HTML from markdown
  pageSize?: 'Letter' | 'A4' | 'Legal';
  margins?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface PDFExportResult {
  success: boolean;
  error?: string;
  path?: string;
}

// View modes
export type ViewMode = 'editor' | 'preview' | 'split';

// Recent files
export interface RecentFile {
  path: string;
  name: string;
  lastOpened: number; // timestamp
}

export interface RecentFilesResult {
  success: boolean;
  files?: RecentFile[];
  error?: string;
}
