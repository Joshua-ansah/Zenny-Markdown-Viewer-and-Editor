import { useCallback, useRef, useState, useEffect } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { FileProvider, useFile } from './contexts/FileContext';
import { ViewProvider, useView } from './contexts/ViewContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { ToastContainer } from './components/Toast/Toast';
import { FileTree } from './components/FileTree';
import Editor, { EditorHandle } from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { parseMarkdown } from './utils/markdown-parser';
import { traverseMarkdownLinks } from './utils/markdown-links';
import './App.css';

function AppContent() {
  const { content, setContent, openFile, saveFile, saveFileAs, newFile, filePath, openRecentFile } = useFile();
  const { viewMode, setViewMode, toggleView, isTreeVisible, toggleTreeVisibility } = useView();
  const { canGoBack, canGoForward, goBack, goForward, pushHistory } = useNavigation();
  const { showToast } = useToast();
  const editorRef = useRef<EditorHandle>(null);
  const [isFindOpen, setIsFindOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [treeWidth, setTreeWidth] = useState(250); // px
  const [isResizing, setIsResizing] = useState(false);

  const toggleFind = useCallback(() => {
    // Only open find when preview is visible (split or preview mode)
    if (viewMode === 'editor') return;
    setIsFindOpen(prev => !prev);
  }, [viewMode]);

  const closeFindBar = useCallback(() => {
    setIsFindOpen(false);
  }, []);

  // Close find bar when switching to editor-only mode
  useEffect(() => {
    if (viewMode === 'editor') {
      setIsFindOpen(false);
    }
  }, [viewMode]);

  // Track file changes in navigation history
  useEffect(() => {
    if (filePath && !isNavigating) {
      pushHistory(filePath);
    }
  }, [filePath, isNavigating, pushHistory]);

  // Navigation handlers
  const handleGoBack = useCallback(async () => {
    const path = goBack();
    if (path) {
      setIsNavigating(true);
      await openRecentFile(path);
      setIsNavigating(false);
    }
  }, [goBack, openRecentFile]);

  const handleGoForward = useCallback(async () => {
    const path = goForward();
    if (path) {
      setIsNavigating(true);
      await openRecentFile(path);
      setIsNavigating(false);
    }
  }, [goForward, openRecentFile]);

  // Custom resize handlers for file tree
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 600) {
        setTreeWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // Save to localStorage
      try {
        localStorage.setItem('zenny-tree-width', String(treeWidth));
      } catch (error) {
        console.error('Failed to save tree width:', error);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, treeWidth]);

  // Load saved tree width on mount
  useEffect(() => {
    try {
      const savedWidth = localStorage.getItem('zenny-tree-width');
      if (savedWidth) {
        const width = parseInt(savedWidth, 10);
        if (width >= 200 && width <= 600) {
          setTreeWidth(width);
        }
      }
    } catch (error) {
      console.error('Failed to load tree width:', error);
    }
  }, []);

  const handleExportToPDF = useCallback(async () => {
    try {
      // Show export options dialog
      const { choice } = await window.electronAPI.showPDFExportDialog();

      // Handle cancel
      if (!choice) {
        showToast('Export cancelled', 'info');
        return;
      }

      // Option 2: Export current page only
      if (choice === 2) {
        const htmlContent = parseMarkdown(content);
        const result = await window.electronAPI.exportToPDF({
          htmlContent,
          pageSize: 'A4',
        });

        if (result.success) {
          showToast('PDF exported successfully', 'success');
          console.log('PDF exported to:', result.path);
        } else {
          showToast('PDF export failed: ' + result.error, 'error');
          console.error('PDF export failed:', result.error);
        }
        return;
      }

      // Option 1: Export entire directory
      if (choice === 1) {
        if (!filePath) {
          showToast('Please open a file first to export entire directory', 'warning');
          return;
        }

        // Multi-file export: traverse linked files
        showToast('Traversing linked files...', 'info');

        const readFile = async (path: string) => {
          const result = await window.electronAPI.openRecentFile(path);
          return {
            success: result.success,
            content: result.data?.content,
            error: result.error,
          };
        };

        const resolvePath = async (basePath: string, relativePath: string) => {
          return await window.electronAPI.resolvePath({ basePath, relativePath });
        };

        const linkedFiles = await traverseMarkdownLinks(filePath, readFile, resolvePath);

        console.log(`Found ${linkedFiles.length} linked files`);
        showToast(`Found ${linkedFiles.length} file(s). Generating PDF...`, 'info');

        // Parse each file's markdown to HTML
        const htmlContents = linkedFiles.map(file => ({
          content: parseMarkdown(file.content),
          title: file.title,
          path: file.filePath,
        }));

        // Export as multi-file PDF
        const result = await window.electronAPI.exportToPDF({
          htmlContents,
          includeLinkedFiles: true,
          pageSize: 'A4',
        });

        if (result.success) {
          showToast('Multi-file PDF exported successfully', 'success');
          console.log('PDF exported to:', result.path);
        } else {
          showToast('PDF export failed: ' + result.error, 'error');
          console.error('PDF export failed:', result.error);
        }
        return;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      showToast('PDF export error: ' + errorMsg, 'error');
      console.error('PDF export error:', error);
    }
  }, [content, filePath, showToast]);

  const handleFormat = useCallback((type: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    switch (type) {
      case 'bold':
        editor.insertText('**', '**', 'bold text');
        break;
      case 'italic':
        editor.insertText('_', '_', 'italic text');
        break;
      case 'strikethrough':
        editor.insertText('~~', '~~', 'strikethrough text');
        break;
      case 'h1':
        editor.insertText('# ', '', 'Heading 1');
        break;
      case 'h2':
        editor.insertText('## ', '', 'Heading 2');
        break;
      case 'h3':
        editor.insertText('### ', '', 'Heading 3');
        break;
      case 'ul':
        editor.insertText('- ', '', 'List item');
        break;
      case 'ol':
        editor.insertText('1. ', '', 'List item');
        break;
      case 'code':
        editor.insertText('```\n', '\n```', 'code');
        break;
      case 'link':
        editor.insertText('[', '](https://example.com)', 'link text');
        break;
    }
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+n': newFile,
    'ctrl+o': openFile,
    'ctrl+s': saveFile,
    'ctrl+shift+s': saveFileAs,
    'ctrl+p': handleExportToPDF,
    'ctrl+f': toggleFind,
    'ctrl+b': () => handleFormat('bold'),
    'ctrl+i': () => handleFormat('italic'),
    'ctrl+k': () => handleFormat('link'),
    'ctrl+shift+c': () => handleFormat('code'),
    'ctrl+1': () => setViewMode('editor'),
    'ctrl+2': () => setViewMode('split'),
    'ctrl+3': () => setViewMode('preview'),
    'ctrl+\\': toggleView,
    'alt+left': handleGoBack,
    'alt+right': handleGoForward,
  });

  return (
    <div className="app">
      <Toolbar
        onFormat={handleFormat}
        onExportPDF={handleExportToPDF}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        isTreeVisible={isTreeVisible}
        onToggleTree={toggleTreeVisibility}
      />
      <div className="content" style={{ display: 'flex', position: 'relative' }}>
        {isTreeVisible && (
          <>
            <div
              className="file-tree-container"
              style={{
                width: `${treeWidth}px`,
                minWidth: '200px',
                maxWidth: '600px',
                height: '100%',
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              <FileTree />
            </div>
            <div
              className="resize-handle"
              style={{
                cursor: isResizing ? 'col-resize' : undefined,
                userSelect: isResizing ? 'none' : undefined
              }}
              onMouseDown={handleResizeStart}
            >
              <div style={{ width: '100%', height: '100%' }} />
            </div>
          </>
        )}
        <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
          {viewMode === 'editor' && (
            <div className="editor-pane">
              <Editor ref={editorRef} value={content} onChange={setContent} />
            </div>
          )}

          {viewMode === 'preview' && (
            <div className="preview-pane">
              <Preview
                content={content}
                isFindOpen={isFindOpen}
                onCloseFindBar={closeFindBar}
              />
            </div>
          )}

          {viewMode === 'split' && (
            <Group orientation="horizontal" id="split-view-group" autoSaveId="split-layout">
              <Panel defaultSize={50} minSize={25} id="editor-panel">
                <div className="editor-pane">
                  <Editor ref={editorRef} value={content} onChange={setContent} />
                </div>
              </Panel>
              <Separator className="resize-handle">
                <div style={{ width: '100%', height: '100%' }} />
              </Separator>
              <Panel defaultSize={50} minSize={25} id="preview-panel">
                <div className="preview-pane">
                  <Preview
                    content={content}
                    isFindOpen={isFindOpen}
                    onCloseFindBar={closeFindBar}
                  />
                </div>
              </Panel>
            </Group>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <ViewProvider>
        <FileProvider>
          <NavigationProvider>
            <AppContent />
            <ToastContainer />
          </NavigationProvider>
        </FileProvider>
      </ViewProvider>
    </ToastProvider>
  );
}

export default App;
