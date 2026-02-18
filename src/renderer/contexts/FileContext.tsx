import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface RecentFile {
  path: string;
  name: string;
  lastOpened: number;
}

interface FileContextType {
  content: string;
  filePath: string | null;
  fileName: string | null;
  isDirty: boolean;
  recentFiles: RecentFile[];
  setContent: (content: string) => void;
  openFile: () => Promise<void>;
  saveFile: () => Promise<void>;
  saveFileAs: () => Promise<void>;
  newFile: () => void;
  openRecentFile: (path: string) => Promise<void>;
  clearRecentFiles: () => Promise<void>;
  loadRecentFiles: () => Promise<void>;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function useFile() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFile must be used within FileProvider');
  }
  return context;
}

interface FileProviderProps {
  children: ReactNode;
}

export function FileProvider({ children }: FileProviderProps) {
  const [content, setContentState] = useState('# Welcome to Zenny\n\nStart editing your markdown...');
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [originalContent, setOriginalContent] = useState(content);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);

  const isDirty = content !== originalContent;

  // Load recent files on mount
  useEffect(() => {
    loadRecentFiles();
  }, []);

  const loadRecentFiles = useCallback(async () => {
    try {
      const result = await window.electronAPI.getRecentFiles();
      if (result.success && result.files) {
        setRecentFiles(result.files);
      }
    } catch (error) {
      console.error('Failed to load recent files:', error);
    }
  }, []);

  const setContent = useCallback((newContent: string) => {
    setContentState(newContent);
  }, []);

  const openFile = useCallback(async () => {
    try {
      const result = await window.electronAPI.openFile();
      if (result.success && result.data) {
        setContentState(result.data.content);
        setOriginalContent(result.data.content);
        setFilePath(result.data.path);
        setFileName(result.data.name);
        window.electronAPI.setTitle(`Zenny - ${result.data.name}`);
        // Refresh recent files list
        await loadRecentFiles();
      }
    } catch (error) {
      console.error('Failed to open file:', error);
    }
  }, [loadRecentFiles]);

  const openRecentFile = useCallback(async (path: string) => {
    try {
      const result = await window.electronAPI.openRecentFile(path);
      if (result.success && result.data) {
        setContentState(result.data.content);
        setOriginalContent(result.data.content);
        setFilePath(result.data.path);
        setFileName(result.data.name);
        window.electronAPI.setTitle(`Zenny - ${result.data.name}`);
        // Refresh recent files list
        await loadRecentFiles();
      }
    } catch (error) {
      console.error('Failed to open recent file:', error);
    }
  }, [loadRecentFiles]);

  const clearRecentFiles = useCallback(async () => {
    try {
      const result = await window.electronAPI.clearRecentFiles();
      if (result.success) {
        setRecentFiles([]);
      }
    } catch (error) {
      console.error('Failed to clear recent files:', error);
    }
  }, []);

  const saveFile = useCallback(async () => {
    try {
      const result = await window.electronAPI.saveFile({
        content,
        path: filePath || undefined,
      });
      
      if (result.success && result.data) {
        setOriginalContent(content);
        setFilePath(result.data.path);
        setFileName(result.data.name);
        window.electronAPI.setTitle(`Zenny - ${result.data.name}`);
      }
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  }, [content, filePath]);

  const saveFileAs = useCallback(async () => {
    try {
      const result = await window.electronAPI.saveFile({
        content,
        path: undefined, // Always show save dialog
      });
      
      if (result.success && result.data) {
        setOriginalContent(content);
        setFilePath(result.data.path);
        setFileName(result.data.name);
        window.electronAPI.setTitle(`Zenny - ${result.data.name}`);
      }
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  }, [content]);

  const newFile = useCallback(() => {
    if (isDirty) {
      // TODO: Show confirmation dialog in future
      const confirmed = confirm('You have unsaved changes. Create new file anyway?');
      if (!confirmed) return;
    }
    
    setContentState('# New Document\n\n');
    setOriginalContent('# New Document\n\n');
    setFilePath(null);
    setFileName(null);
    window.electronAPI.setTitle('Zenny - Untitled');
  }, [isDirty]);

  const value: FileContextType = {
    content,
    filePath,
    fileName,
    isDirty,
    recentFiles,
    setContent,
    openFile,
    saveFile,
    saveFileAs,
    newFile,
    openRecentFile,
    clearRecentFiles,
    loadRecentFiles,
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
}
