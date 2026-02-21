import { useState } from 'react';
import { DirectoryNode } from '../../../shared/types/ipc';
import styles from './FileTree.module.css';

interface FileTreeNodeProps {
  node: DirectoryNode;
  depth: number;
  currentFilePath: string | null;
  onFileClick: (path: string) => void;
  onLoadChildren: (path: string) => Promise<DirectoryNode[]>;
}

export function FileTreeNode({
  node,
  depth,
  currentFilePath,
  onFileClick,
  onLoadChildren,
}: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [children, setChildren] = useState<DirectoryNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isActive = node.path === currentFilePath;

  const handleToggle = async () => {
    if (!node.isDirectory) return;

    if (!isExpanded && children.length === 0) {
      // Load children on first expand
      setIsLoading(true);
      try {
        const loadedChildren = await onLoadChildren(node.path);
        setChildren(loadedChildren);
      } catch (error) {
        console.error('Failed to load directory:', error);
      } finally {
        setIsLoading(false);
      }
    }

    setIsExpanded(!isExpanded);
  };

  const handleClick = () => {
    if (node.isDirectory) {
      handleToggle();
    } else {
      onFileClick(node.path);
    }
  };

  const indentation = Array.from({ length: depth }, (_, i) => (
    <span key={i} className={styles.indent} />
  ));

  return (
    <div className={styles.treeNode}>
      <div
        className={`${styles.nodeContent} ${isActive ? styles.active : ''}`}
        onClick={handleClick}
        title={node.path}
      >
        {indentation}
        {node.isDirectory ? (
          <span className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}>
            ▶
          </span>
        ) : (
          <span className={`${styles.expandIcon} ${styles.placeholder}`}>•</span>
        )}
        <span className={styles.icon}>
          {node.isDirectory ? '📁' : '📄'}
        </span>
        <span className={`${styles.name} ${node.isDirectory ? styles.folder : styles.file}`}>
          {node.name}
        </span>
      </div>
      {node.isDirectory && isExpanded && (
        <div className={styles.children}>
          {isLoading ? (
            <div className={styles.empty}>Loading...</div>
          ) : children.length > 0 ? (
            children.map((child) => (
              <FileTreeNode
                key={child.path}
                node={child}
                depth={depth + 1}
                currentFilePath={currentFilePath}
                onFileClick={onFileClick}
                onLoadChildren={onLoadChildren}
              />
            ))
          ) : (
            <div className={styles.empty}>Empty folder</div>
          )}
        </div>
      )}
    </div>
  );
}
