import { useEffect, useState, useMemo, useRef } from 'react';
import { parseMarkdown } from '../../utils/markdown-parser';
import { debounce } from '../../utils/debounce';
import 'highlight.js/styles/github.css';
import styles from './Preview.module.css';

interface PreviewProps {
  content: string;
  debounceMs?: number;
}

export default function Preview({ content, debounceMs = 300 }: PreviewProps) {
  const [html, setHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null);

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

  // Handle link clicks - open external links in browser
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
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
  }, []);

  return (
    <div className={styles.preview} ref={previewRef}>
      {isLoading && <div className={styles.loading}>Rendering...</div>}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
