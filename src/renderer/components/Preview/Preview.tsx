import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { parseMarkdown } from '../../utils/markdown-parser';
import { debounce } from '../../utils/debounce';
import { useFindInPreview } from '../../hooks/useFindInPreview';
import { FindBar } from '../FindBar';
import { useFile } from '../../contexts/FileContext';
import { useToast } from '../../contexts/ToastContext';
import 'highlight.js/styles/github.css';
import styles from './Preview.module.css';

interface PreviewProps {
  content: string;
  debounceMs?: number;
  isFindOpen?: boolean;
  onCloseFindBar?: () => void;
}

export default function Preview({
  content,
  debounceMs = 300,
  isFindOpen = false,
  onCloseFindBar
}: PreviewProps) {
  const [html, setHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get file context for navigation
  const { filePath, isDirty, saveFile, openRecentFile } = useFile();
  const { showToast } = useToast();

  // Debug: Log filePath changes
  useEffect(() => {
    console.log('Preview - filePath changed:', filePath);
  }, [filePath]);

  // Debounced parsing function
  const debouncedParse = useMemo(
    () =>
      debounce((markdown: string) => {
        setIsLoading(true);
        try {
          const parsed = parseMarkdown(markdown);
          setHtml(parsed);
        } catch (error) {
          console.error('Preview parsing error:', error);
          setHtml('<p class="error">Failed to render preview</p>');
        } finally {
          setIsLoading(false);
        }
      }, debounceMs),
    [debounceMs]
  );

  // Parse content when it changes (debounced)
  useEffect(() => {
    debouncedParse(content);
  }, [content, debouncedParse]);

  // Handle markdown file link navigation
  const handleMarkdownLink = useCallback(async (href: string) => {
    console.log('handleMarkdownLink called:', { href, filePath, isDirty });

    // Check if we have a file open
    if (!filePath) {
      console.warn('No file path available for navigation');
      showToast('Cannot navigate to relative links without an open file', 'warning');
      return;
    }

    // Check for unsaved changes
    if (isDirty) {
      const shouldSave = confirm(
        'You have unsaved changes. Save before navigating?'
      );

      if (!shouldSave) {
        return;
      }

      await saveFile();
    }

    // Parse href to separate file path and anchor
    const [relativePath, anchor] = href.split('#');

    try {
      // Resolve the relative path
      const result = await window.electronAPI.resolvePath({
        basePath: filePath,
        relativePath,
      });

      if (!result.success) {
        showToast(`Failed to resolve path: ${result.error}`, 'error');
        return;
      }

      if (!result.exists) {
        showToast(`File not found: ${relativePath}`, 'error');
        return;
      }

      // Open the resolved file
      await openRecentFile(result.path!);

      // If there's an anchor, save it for scrolling after render
      if (anchor) {
        setPendingAnchor(anchor);
      }
    } catch (error) {
      console.error('Failed to navigate to markdown link:', error);
      showToast('Failed to navigate to file', 'error');
    }
  }, [filePath, isDirty, saveFile, openRecentFile, showToast]);

  // Scroll to pending anchor after content renders
  useEffect(() => {
    if (pendingAnchor && contentRef.current) {
      setTimeout(() => {
        const element = document.getElementById(pendingAnchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setPendingAnchor(null);
      }, 100);
    }
  }, [html, pendingAnchor]);

  // Handle link clicks - open external links in browser
  useEffect(() => {
    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if clicked element is a link or inside a link
      const link = target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // If it's an external link (http/https), open in browser
      if (href.startsWith('http://') || href.startsWith('https://')) {
        e.preventDefault();
        // Send request to main process to open in external browser
        window.electronAPI?.openExternal?.(href).catch((err: Error) => {
          console.error('Failed to open external link:', err);
        });
      }
      // For anchor links (#), allow default behavior
      else if (href.startsWith('#')) {
        e.preventDefault();
        const element = document.getElementById(href.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      // Handle markdown file links
      else if (href.match(/\.md(#.*)?$|\.markdown(#.*)?$/i)) {
        e.preventDefault();
        await handleMarkdownLink(href);
      }
      // Block other protocols for security
      else {
        e.preventDefault();
        console.warn('Blocked potentially unsafe link:', href);
      }
    };

    const previewElement = previewRef.current;
    if (previewElement) {
      previewElement.addEventListener('click', handleClick);
      return () => previewElement.removeEventListener('click', handleClick);
    }
  }, [handleMarkdownLink]);

  // Find feature
  const findState = useFindInPreview(contentRef, isFindOpen, html);

  return (
    <div className={styles.preview} ref={previewRef}>
      {isLoading && <div className={styles.loading}>Rendering...</div>}
      {isFindOpen && onCloseFindBar && (
        <FindBar
          searchTerm={findState.searchTerm}
          onSearchTermChange={findState.setSearchTerm}
          currentMatch={findState.currentMatch}
          totalMatches={findState.totalMatches}
          onNext={findState.goToNext}
          onPrevious={findState.goToPrevious}
          onClose={onCloseFindBar}
        />
      )}
      <div
        ref={contentRef}
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
