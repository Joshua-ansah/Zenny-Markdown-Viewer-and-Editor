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
export interface PDFFileContent {
  content: string; // HTML content
  title: string;
  path: string;
}

export interface PDFExportOptions {
  htmlContent?: string; // Single file - already parsed HTML from markdown
  htmlContents?: PDFFileContent[]; // Multi-file export
  includeLinkedFiles?: boolean;
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

// Path resolution
export interface ResolvePathOptions {
  basePath: string;
  relativePath: string;
}

export interface ResolvePathResult {
  success: boolean;
  path?: string;
  exists?: boolean;
  error?: string;
}

// Directory reading
export interface DirectoryNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: DirectoryNode[];
}

export interface ReadDirectoryResult {
  success: boolean;
  nodes?: DirectoryNode[];
  error?: string;
}
