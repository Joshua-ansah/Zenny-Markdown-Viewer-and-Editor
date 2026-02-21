import { useState, useRef, useEffect } from 'react';
import { useFile } from '../../contexts/FileContext';
import { useView } from '../../contexts/ViewContext';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  onFormat?: (type: string) => void;
  onExportPDF?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onGoBack?: () => void;
  onGoForward?: () => void;
  isTreeVisible?: boolean;
  onToggleTree?: () => void;
}

export default function Toolbar({
  onFormat,
  onExportPDF,
  canGoBack = false,
  canGoForward = false,
  onGoBack,
  onGoForward,
  isTreeVisible = true,
  onToggleTree,
}: ToolbarProps) {
  const { fileName, isDirty, recentFiles, openFile, saveFile, newFile, openRecentFile, clearRecentFiles } = useFile();
  const { viewMode, setViewMode } = useView();
  const [showRecentDropdown, setShowRecentDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRecentDropdown(false);
      }
    };

    if (showRecentDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRecentDropdown]);

  const handleFormat = (type: string) => {
    if (onFormat) {
      onFormat(type);
    }
  };

  const handleOpenRecent = async (path: string) => {
    await openRecentFile(path);
    setShowRecentDropdown(false);
  };

  const handleClearRecent = async () => {
    await clearRecentFiles();
    setShowRecentDropdown(false);
  };

  return (
    <div className={styles.toolbar}>
      {/* Navigation */}
      <div className={styles.section}>
        <button
          onClick={onToggleTree}
          className={`${styles.button} ${isTreeVisible ? styles.active : ''}`}
          title={isTreeVisible ? "Hide File Tree" : "Show File Tree"}
        >
          {isTreeVisible ? '◀ 📁' : '📁 ▶'}
        </button>
        <button
          onClick={onGoBack}
          className={styles.button}
          disabled={!canGoBack}
          title="Back (Alt+Left)"
        >
          ←
        </button>
        <button
          onClick={onGoForward}
          className={styles.button}
          disabled={!canGoForward}
          title="Forward (Alt+Right)"
        >
          →
        </button>
      </div>
      <div className={styles.divider} />

      {/* File Operations */}
      <div className={styles.section}>
        <button onClick={newFile} className={styles.button} title="New File (Ctrl+N)">
          📄 New
        </button>
        <button onClick={openFile} className={styles.button} title="Open File (Ctrl+O)">
          📁 Open
        </button>
        
        {/* Recent Files Dropdown */}
        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <button
            onClick={() => setShowRecentDropdown(!showRecentDropdown)}
            className={styles.button}
            title="Open Recent File"
          >
            🕒 Recent ▾
          </button>
          {showRecentDropdown && (
            <div className={styles.dropdown}>
              {recentFiles.length > 0 ? (
                <>
                  {recentFiles.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => handleOpenRecent(file.path)}
                      className={styles.dropdownItem}
                      title={file.path}
                    >
                      {file.name}
                    </button>
                  ))}
                  <div className={styles.dropdownDivider} />
                  <button
                    onClick={handleClearRecent}
                    className={styles.dropdownItem}
                  >
                    Clear Recent Files
                  </button>
                </>
              ) : (
                <div className={styles.dropdownEmpty}>No recent files</div>
              )}
            </div>
          )}
        </div>

        <button onClick={saveFile} className={styles.button} title="Save (Ctrl+S)">
          💾 Save
        </button>
        
        <button onClick={onExportPDF} className={styles.button} title="Export to PDF (Ctrl+P)">
          📄 PDF
        </button>
      </div>

      <div className={styles.divider} />

      {/* Formatting Tools */}
      <div className={styles.section}>
        <button
          onClick={() => handleFormat('bold')}
          className={styles.button}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => handleFormat('italic')}
          className={styles.button}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => handleFormat('strikethrough')}
          className={styles.button}
          title="Strikethrough"
        >
          <s>S</s>
        </button>
      </div>

      <div className={styles.divider} />

      {/* Headings */}
      <div className={styles.section}>
        <button
          onClick={() => handleFormat('h1')}
          className={styles.button}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => handleFormat('h2')}
          className={styles.button}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => handleFormat('h3')}
          className={styles.button}
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <div className={styles.divider} />

      {/* Lists and Code */}
      <div className={styles.section}>
        <button
          onClick={() => handleFormat('ul')}
          className={styles.button}
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => handleFormat('ol')}
          className={styles.button}
          title="Numbered List"
        >
          1. List
        </button>
        <button
          onClick={() => handleFormat('code')}
          className={styles.button}
          title="Code Block (Ctrl+Shift+C)"
        >
          {'</>'}
        </button>
        <button
          onClick={() => handleFormat('link')}
          className={styles.button}
          title="Insert Link (Ctrl+K)"
        >
          🔗 Link
        </button>
      </div>

      <div className={styles.divider} />

      {/* View Mode */}
      <div className={styles.section}>
        <button
          onClick={() => setViewMode('editor')}
          className={`${styles.button} ${viewMode === 'editor' ? styles.active : ''}`}
          title="Editor Only (Ctrl+1)"
        >
          📝 Edit
        </button>
        <button
          onClick={() => setViewMode('split')}
          className={`${styles.button} ${viewMode === 'split' ? styles.active : ''}`}
          title="Split View (Ctrl+2)"
        >
          ⚏ Split
        </button>
        <button
          onClick={() => setViewMode('preview')}
          className={`${styles.button} ${viewMode === 'preview' ? styles.active : ''}`}
          title="Preview Only (Ctrl+3)"
        >
          👁 Preview
        </button>
      </div>

      {/* File Info */}
      <div className={styles.fileInfo}>
        <span className={styles.fileName}>
          {fileName || 'Untitled'}
          {isDirty && <span className={styles.dirtyIndicator}> •</span>}
        </span>
      </div>
    </div>
  );
}
