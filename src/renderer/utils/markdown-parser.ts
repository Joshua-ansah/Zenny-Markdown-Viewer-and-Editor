import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

// Configure marked options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
  mangle: false, // Don't mangle email addresses
  pedantic: false,
  silent: false,
  async: false,
});

// Custom renderer for code blocks with syntax highlighting
const renderer = new marked.Renderer();

renderer.code = function ({ text, lang }: { text: string; lang?: string }): string {
  if (lang && hljs.getLanguage(lang)) {
    try {
      const highlighted = hljs.highlight(text, { language: lang }).value;
      return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
    } catch (err) {
      console.error('Syntax highlighting error:', err);
    }
  }
  // If no language or highlighting fails, use plain code block
  return `<pre><code class="hljs">${text}</code></pre>`;
};

// Override link rendering to add security attributes
renderer.link = function ({ href, title, tokens }: { href: string; title?: string; tokens: any[] }): string {
  // Sanitize href to prevent javascript: and other dangerous protocols
  const safeHref = href.startsWith('javascript:') || href.startsWith('data:') 
    ? '#' 
    : href;
  
  const titleAttr = title ? ` title="${title}"` : '';
  const text = this.parser?.parseInline(tokens) || '';
  
  // Add rel and target attributes for external links
  if (safeHref.startsWith('http://') || safeHref.startsWith('https://')) {
    return `<a href="${safeHref}"${titleAttr} rel="noopener noreferrer" class="external-link">${text}</a>`;
  }
  
  return `<a href="${safeHref}"${titleAttr}>${text}</a>`;
};

marked.use({ renderer });

// DOMPurify configuration
const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'strong', 'em', 'b', 'i', 'u', 's', 'del', 'ins', 'mark', 'sub', 'sup',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a',
    'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span',
    'details', 'summary',
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'alt', 'src', 'width', 'height',
    'class', 'id',
    'rel', 'target',
    'align', 'valign',
    'colspan', 'rowspan',
  ],
  ALLOW_DATA_ATTR: false,
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|file):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
};

/**
 * Parse markdown text to sanitized HTML
 * @param markdown - The markdown text to parse
 * @returns Sanitized HTML string safe for rendering
 */
export function parseMarkdown(markdown: string): string {
  try {
    // Parse markdown to HTML
    const rawHtml = marked.parse(markdown) as string;
    
    // Sanitize HTML to prevent XSS attacks
    const sanitizedHtml = DOMPurify.sanitize(rawHtml, DOMPURIFY_CONFIG);
    
    return sanitizedHtml;
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return '<p class="error">Error parsing markdown</p>';
  }
}

/**
 * Check if a string contains potentially dangerous content
 * @param content - Content to check
 * @returns true if content appears safe
 */
export function isSafeMarkdown(content: string): boolean {
  // Check for common XSS patterns
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
    /<iframe/gi,
    /<embed/gi,
    /<object/gi,
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(content));
}
