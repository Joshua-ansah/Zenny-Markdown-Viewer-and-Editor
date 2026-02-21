/**
 * Extract markdown file links from markdown content
 */
export function extractMarkdownLinks(markdown: string): string[] {
  const links: string[] = [];

  // Match markdown links: [text](path) or [text](path#anchor)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(markdown)) !== null) {
    const href = match[2];

    // Only include local markdown file links (not http/https, not anchors only)
    if (!href.startsWith('http://') &&
        !href.startsWith('https://') &&
        !href.startsWith('#')) {

      // Remove anchor if present
      const [filePath] = href.split('#');

      // Only include if it looks like a markdown file
      if (filePath && (filePath.endsWith('.md') || filePath.endsWith('.markdown'))) {
        links.push(filePath);
      }
    }
  }

  return links;
}

/**
 * Traverse linked markdown files and collect all files in order
 */
export async function traverseMarkdownLinks(
  startFilePath: string,
  readFile: (path: string) => Promise<{ success: boolean; content?: string; error?: string }>,
  resolvePath: (basePath: string, relativePath: string) => Promise<{ success: boolean; path?: string; exists?: boolean; error?: string }>
): Promise<{ filePath: string; content: string; title: string }[]> {

  const visited = new Set<string>();
  const result: { filePath: string; content: string; title: string }[] = [];
  const queue: string[] = [startFilePath];

  while (queue.length > 0) {
    const currentPath = queue.shift()!;

    // Skip if already visited (avoid circular references)
    if (visited.has(currentPath)) {
      continue;
    }

    visited.add(currentPath);

    // Read the file
    const fileResult = await readFile(currentPath);
    if (!fileResult.success || !fileResult.content) {
      console.warn(`Failed to read file: ${currentPath}`);
      continue;
    }

    const content = fileResult.content;

    // Extract title from first heading or filename
    let title = extractTitle(content) || getFilenameWithoutExtension(currentPath);

    result.push({
      filePath: currentPath,
      content,
      title
    });

    // Extract markdown links from content
    const links = extractMarkdownLinks(content);

    // Resolve each link and add to queue
    for (const link of links) {
      const resolveResult = await resolvePath(currentPath, link);

      if (resolveResult.success && resolveResult.exists && resolveResult.path) {
        // Add to queue if not visited
        if (!visited.has(resolveResult.path)) {
          queue.push(resolveResult.path);
        }
      }
    }
  }

  return result;
}

/**
 * Extract title from markdown content (first h1 or h2)
 */
function extractTitle(markdown: string): string | null {
  // Try to find first h1
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }

  // Try to find first h2
  const h2Match = markdown.match(/^##\s+(.+)$/m);
  if (h2Match) {
    return h2Match[1].trim();
  }

  return null;
}

/**
 * Get filename without extension
 */
function getFilenameWithoutExtension(filePath: string): string {
  const parts = filePath.split(/[/\\]/);
  const filename = parts[parts.length - 1];
  return filename.replace(/\.(md|markdown)$/i, '');
}
