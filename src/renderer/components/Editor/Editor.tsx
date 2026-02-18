import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language';
import { oneDark } from '@codemirror/theme-one-dark';
import styles from './Editor.module.css';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  theme?: 'light' | 'dark';
}

export interface EditorHandle {
  insertText: (before: string, after?: string, defaultText?: string) => void;
}

const Editor = forwardRef<EditorHandle, EditorProps>(function Editor({ value, onChange, readOnly = false, theme = 'light' }, ref) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Create editor state
    const startState = EditorState.create({
      doc: value,
      extensions: [
        // Line numbers
        lineNumbers(),
        highlightActiveLineGutter(),
        
        // History (undo/redo)
        history(),
        
        // Markdown support
        markdown({ base: markdownLanguage }),
        
        // Syntax highlighting
        syntaxHighlighting(defaultHighlightStyle),
        
        // Bracket matching
        bracketMatching(),
        
        // Theme
        theme === 'dark' ? oneDark : [],
        
        // Keymaps
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
        ]),
        
        // Read-only mode
        EditorView.editable.of(!readOnly),
        
        // Update listener
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            onChange(newValue);
          }
        }),
        
        // Styling
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14px',
          },
          '.cm-scroller': {
            fontFamily: '"Courier New", Courier, monospace',
            lineHeight: '1.6',
          },
          '.cm-content': {
            padding: '10px 0',
          },
          '.cm-line': {
            padding: '0 10px',
          },
        }),
      ],
    });

    // Create editor view
    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    // Cleanup on unmount
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []); // Only run once on mount

  // Update editor content when value prop changes externally
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentValue = view.state.doc.toString();
    if (currentValue !== value) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: value,
        },
      });
    }
  }, [value]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    insertText: (before: string, after: string = '', defaultText: string = 'text') => {
      const view = viewRef.current;
      if (!view) return;

      const selection = view.state.selection.main;
      const selectedText = view.state.doc.sliceString(selection.from, selection.to);
      const textToInsert = selectedText || defaultText;
      const formattedText = before + textToInsert + after;

      view.dispatch({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: formattedText,
        },
        selection: {
          anchor: selection.from + before.length,
          head: selection.from + before.length + textToInsert.length,
        },
      });

      view.focus();
    },
  }), []);

  return <div ref={editorRef} className={styles.editor} />;
});

export default Editor;
