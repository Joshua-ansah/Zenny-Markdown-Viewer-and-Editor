import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from '../utils/debounce';

interface FindState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalMatches: number;
  currentMatch: number;
  goToNext: () => void;
  goToPrevious: () => void;
  clearHighlights: () => void;
}

export function useFindInPreview(
  containerRef: React.RefObject<HTMLDivElement>,
  isActive: boolean,
  contentHtml: string
): FindState {
  const [searchTerm, setSearchTerm] = useState('');
  const [totalMatches, setTotalMatches] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const matchElementsRef = useRef<HTMLElement[]>([]);
  const originalHtmlRef = useRef<string>('');

  // Escape special regex characters for literal string matching
  const escapeRegex = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Clear all highlights and restore original HTML
  const clearHighlights = useCallback(() => {
    if (containerRef.current && originalHtmlRef.current) {
      containerRef.current.innerHTML = originalHtmlRef.current;
      matchElementsRef.current = [];
      setTotalMatches(0);
      setCurrentMatchIndex(0);
    }
  }, [containerRef]);

  // Perform the search and highlight matches
  const performSearch = useCallback((term: string) => {
    if (!containerRef.current || !term.trim()) {
      clearHighlights();
      return;
    }

    // Restore original HTML before new search
    if (originalHtmlRef.current) {
      containerRef.current.innerHTML = originalHtmlRef.current;
    }

    const container = containerRef.current;
    const matches: HTMLElement[] = [];
    const escapedTerm = escapeRegex(term);
    const regex = new RegExp(escapedTerm, 'gi');

    // Use TreeWalker to iterate through text nodes
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );

    const nodesToProcess: { node: Text; matches: RegExpMatchArray[] }[] = [];

    // First pass: find all text nodes with matches
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const textNode = node as Text;
      const text = textNode.textContent || '';
      const nodeMatches: RegExpMatchArray[] = [];
      let match: RegExpExecArray | null;

      // Reset regex lastIndex for each node
      regex.lastIndex = 0;

      while ((match = regex.exec(text)) !== null) {
        nodeMatches.push(match);
      }

      if (nodeMatches.length > 0) {
        nodesToProcess.push({ node: textNode, matches: nodeMatches });
      }
    }

    // Second pass: split text nodes and wrap matches
    nodesToProcess.forEach(({ node, matches: nodeMatches }) => {
      const text = node.textContent || '';
      const parent = node.parentNode;
      if (!parent) return;

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;

      nodeMatches.forEach((match) => {
        const matchIndex = match.index!;
        const matchText = match[0];

        // Add text before match
        if (matchIndex > lastIndex) {
          fragment.appendChild(
            document.createTextNode(text.substring(lastIndex, matchIndex))
          );
        }

        // Create mark element for match
        const mark = document.createElement('mark');
        mark.className = 'find-highlight';
        mark.textContent = matchText;
        fragment.appendChild(mark);
        matches.push(mark);

        lastIndex = matchIndex + matchText.length;
      });

      // Add remaining text after last match
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }

      // Replace the text node with the fragment
      parent.replaceChild(fragment, node);
    });

    matchElementsRef.current = matches;
    setTotalMatches(matches.length);

    // Highlight first match if any
    if (matches.length > 0) {
      setCurrentMatchIndex(0);
      matches[0].classList.add('find-highlight-active');
      matches[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [containerRef, clearHighlights]);

  // Debounced search
  const debouncedSearch = useRef(
    debounce((term: string) => performSearch(term), 150)
  );

  // Navigate to next match
  const goToNext = useCallback(() => {
    const matches = matchElementsRef.current;
    if (matches.length === 0) return;

    // Remove active class from current match
    matches[currentMatchIndex].classList.remove('find-highlight-active');

    // Move to next match (wrap around)
    const nextIndex = (currentMatchIndex + 1) % matches.length;
    setCurrentMatchIndex(nextIndex);

    // Add active class and scroll into view
    matches[nextIndex].classList.add('find-highlight-active');
    matches[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentMatchIndex]);

  // Navigate to previous match
  const goToPrevious = useCallback(() => {
    const matches = matchElementsRef.current;
    if (matches.length === 0) return;

    // Remove active class from current match
    matches[currentMatchIndex].classList.remove('find-highlight-active');

    // Move to previous match (wrap around)
    const prevIndex = currentMatchIndex === 0 ? matches.length - 1 : currentMatchIndex - 1;
    setCurrentMatchIndex(prevIndex);

    // Add active class and scroll into view
    matches[prevIndex].classList.add('find-highlight-active');
    matches[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentMatchIndex]);

  // Snapshot original HTML when content changes
  useEffect(() => {
    if (containerRef.current) {
      originalHtmlRef.current = containerRef.current.innerHTML;
    }
  }, [contentHtml, containerRef]);

  // Execute search when search term changes
  useEffect(() => {
    if (isActive && searchTerm) {
      debouncedSearch.current(searchTerm);
    } else {
      clearHighlights();
    }
  }, [searchTerm, isActive, clearHighlights]);

  // Re-search when content changes while find is active
  useEffect(() => {
    if (isActive && searchTerm && containerRef.current) {
      // Update the snapshot after content change
      originalHtmlRef.current = containerRef.current.innerHTML;
      performSearch(searchTerm);
    }
  }, [contentHtml, isActive, searchTerm, performSearch, containerRef]);

  // Clear highlights when find becomes inactive
  useEffect(() => {
    if (!isActive) {
      clearHighlights();
      setSearchTerm('');
    }
  }, [isActive, clearHighlights]);

  return {
    searchTerm,
    setSearchTerm,
    totalMatches,
    currentMatch: currentMatchIndex + 1, // 1-based for display
    goToNext,
    goToPrevious,
    clearHighlights,
  };
}
