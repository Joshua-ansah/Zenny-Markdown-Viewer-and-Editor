import { useCallback, useRef } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { FileProvider, useFile } from './contexts/FileContext';
import { ViewProvider, useView } from './contexts/ViewContext';
import Editor, { EditorHandle } from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { parseMarkdown } from './utils/markdown-parser';
import './App.css';

function AppContent() {
  const { content, setContent, openFile, saveFile, saveFileAs, newFile } = useFile();
  const { viewMode, setViewMode, toggleView } = useView();
  const editorRef = useRef<EditorHandle>(null);

  const handleExportToPDF = useCallback(async () => {
    try {
      // Parse markdown to HTML
      const htmlContent = parseMarkdown(content);
      
      // Call export API
      const result = await window.electronAPI.exportToPDF({
        htmlContent,
        pageSize: 'A4',
      });
      
      if (result.success) {
        console.log('PDF exported successfully to:', result.path);
        // Could show a success notification here
      } else {
        console.error('PDF export failed:', result.error);
        // Could show an error notification here
      }
    } catch (error) {
      console.error('PDF export error:', error);
    }
  }, [content]);

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
    'ctrl+b': () => handleFormat('bold'),
    'ctrl+i': () => handleFormat('italic'),
    'ctrl+k': () => handleFormat('link'),
    'ctrl+shift+c': () => handleFormat('code'),
    'ctrl+1': () => setViewMode('editor'),
    'ctrl+2': () => setViewMode('split'),
    'ctrl+3': () => setViewMode('preview'),
    'ctrl+\\': toggleView,
  });

  return (
    <div className="app">
      <Toolbar onFormat={handleFormat} onExportPDF={handleExportToPDF} />
      <div className="content">
        {viewMode === 'editor' && (
          <div className="editor-pane">
            <Editor ref={editorRef} value={content} onChange={setContent} />
          </div>
        )}
        
        {viewMode === 'preview' && (
          <div className="preview-pane">
            <Preview content={content} />
          </div>
        )}
        
        {viewMode === 'split' && (
          <Group direction="horizontal">
            <Panel defaultSize={50} minSize={25}>
              <div className="editor-pane">
                <Editor ref={editorRef} value={content} onChange={setContent} />
              </div>
            </Panel>
            <Separator className="resize-handle" />
            <Panel defaultSize={50} minSize={25}>
              <div className="preview-pane">
                <Preview content={content} />
              </div>
            </Panel>
          </Group>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ViewProvider>
      <FileProvider>
        <AppContent />
      </FileProvider>
    </ViewProvider>
  );
}

export default App;
