import { useCallback } from 'react';

export function useMarkdownFormat() {
  const insertText = useCallback((
    content: string,
    before: string,
    after: string = '',
    defaultText: string = 'text'
  ): string => {
    // For now, just append the formatted text at the end
    // In a full implementation, we'd get cursor position and selection
    return content + '\n' + before + defaultText + after;
  }, []);

  const formatBold = useCallback((content: string): string => {
    return insertText(content, '**', '**', 'bold text');
  }, [insertText]);

  const formatItalic = useCallback((content: string): string => {
    return insertText(content, '_', '_', 'italic text');
  }, [insertText]);

  const formatStrikethrough = useCallback((content: string): string => {
    return insertText(content, '~~', '~~', 'strikethrough text');
  }, [insertText]);

  const formatHeading = useCallback((content: string, level: number): string => {
    const hashes = '#'.repeat(level);
    return insertText(content, `${hashes} `, '', `Heading ${level}`);
  }, [insertText]);

  const formatUnorderedList = useCallback((content: string): string => {
    return content + '\n- List item 1\n- List item 2\n- List item 3';
  }, []);

  const formatOrderedList = useCallback((content: string): string => {
    return content + '\n1. First item\n2. Second item\n3. Third item';
  }, []);

  const formatCode = useCallback((content: string): string => {
    return content + '\n```javascript\n// Your code here\nconsole.log("Hello");\n```\n';
  }, []);

  const formatLink = useCallback((content: string): string => {
    return insertText(content, '[', '](https://example.com)', 'link text');
  }, [insertText]);

  const format = useCallback((content: string, type: string): string => {
    switch (type) {
      case 'bold':
        return formatBold(content);
      case 'italic':
        return formatItalic(content);
      case 'strikethrough':
        return formatStrikethrough(content);
      case 'h1':
        return formatHeading(content, 1);
      case 'h2':
        return formatHeading(content, 2);
      case 'h3':
        return formatHeading(content, 3);
      case 'ul':
        return formatUnorderedList(content);
      case 'ol':
        return formatOrderedList(content);
      case 'code':
        return formatCode(content);
      case 'link':
        return formatLink(content);
      default:
        return content;
    }
  }, [
    formatBold,
    formatItalic,
    formatStrikethrough,
    formatHeading,
    formatUnorderedList,
    formatOrderedList,
    formatCode,
    formatLink,
  ]);

  return { format };
}
