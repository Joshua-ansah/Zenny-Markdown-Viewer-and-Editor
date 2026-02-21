import { useState, useEffect, useCallback } from 'react';
import { useFile } from '../../contexts/FileContext';
import { DirectoryNode } from '../../../shared/types/ipc';
import { FileTreeNode } from './FileTreeNode';
import styles from './FileTree.module.css';
import * as path from 'path-browserify';

export function FileTree() {
  const { filePath, openRecentFile } = useFile();
  const [rootNodes, setRootNodes] = useState<DirectoryNode[]>([]);
  const [rootPath, setRootPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load directory contents
  const loadDirectory = useCallback(async (dirPath: string): Promise<DirectoryNode[]> => {
    try {
      const result = await window.electronAPI.readDirectory(dirPath);
      if (result.success && result.nodes) {
        return result.nodes;
      } else {
        throw new Error(result.error || 'Failed to read directory');
      }
    } catch (err) {
      console.error('Failed to load directory:', err);
      throw err;
    }
  }, []);

  // Update root when file changes
  useEffect(() => {
    if (!filePath) {
      setRootNodes([]);
      setRootPath(null);
      return;
    }

    const dirPath = path.dirname(filePath);
    if (dirPath === rootPath) return; // Already showing this directory

    setRootPath(dirPath);
    setIsLoading(true);
    setError(null);

    loadDirectory(dirPath)
      .then((nodes) => {
        setRootNodes(nodes);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load directory');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [filePath, rootPath, loadDirectory]);

  const handleFileClick = useCallback(
    async (path: string) => {
      await openRecentFile(path);
    },
    [openRecentFile]
  );

  if (!filePath) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>Files</div>
        <div className={styles.empty}>Open a file to see its directory</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>Files</div>
        <div className={styles.empty}>Loading directory...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>Files</div>
        <div className={styles.empty}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {rootPath ? path.basename(rootPath) : 'Files'}
      </div>
      {rootNodes.length > 0 ? (
        rootNodes.map((node) => (
          <FileTreeNode
            key={node.path}
            node={node}
            depth={0}
            currentFilePath={filePath}
            onFileClick={handleFileClick}
            onLoadChildren={loadDirectory}
          />
        ))
      ) : (
        <div className={styles.empty}>No markdown files found</div>
      )}
    </div>
  );
}
