// converter.js - Markdown to Notion format converter

class MarkdownToNotionConverter {
  constructor() {
    this.blocks = [];
  }

  convert(markdown) {
    const lines = markdown.split('\n');
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Skip empty lines
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Check for table
      if (this.isTableRow(line) && i + 1 < lines.length && this.isTableSeparator(lines[i + 1])) {
        i = this.parseTable(lines, i);
        continue;
      }

      // Check for code block
      if (line.trim().startsWith('```')) {
        i = this.parseCodeBlock(lines, i);
        continue;
      }

      // Check for heading
      if (line.trim().match(/^#{1,6}\s/)) {
        this.parseHeading(line);
        i++;
        continue;
      }

      // Check for unordered list
      if (line.trim().match(/^[-*+]\s/)) {
        i = this.parseList(lines, i, 'ul');
        continue;
      }

      // Check for ordered list
      if (line.trim().match(/^\d+\.\s/)) {
        i = this.parseList(lines, i, 'ol');
        continue;
      }

      // Parse as paragraph
      this.parseParagraph(line);
      i++;
    }

    return this.generateOutput();
  }

  isTableRow(line) {
    return line.includes('|');
  }

  isTableSeparator(line) {
    return /^\|?[\s:|-]+\|?$/.test(line.trim());
  }

  parseTable(lines, startIndex) {
    const headerLine = lines[startIndex];
    const separatorLine = lines[startIndex + 1];

    // Parse header
    const headers = this.parseTableRow(headerLine);

    // Parse rows
    const rows = [];
    let i = startIndex + 2;

    while (i < lines.length && this.isTableRow(lines[i]) && !this.isTableSeparator(lines[i])) {
      rows.push(this.parseTableRow(lines[i]));
      i++;
    }

    // Generate HTML table
    let html = '<table>';

    // Header
    html += '<thead><tr>';
    headers.forEach(cell => {
      html += `<th>${this.parseInlineMarkdown(cell)}</th>`;
    });
    html += '</tr></thead>';

    // Body
    if (rows.length > 0) {
      html += '<tbody>';
      rows.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
          html += `<td>${this.parseInlineMarkdown(cell)}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody>';
    }

    html += '</table>';

    this.blocks.push({ type: 'table', html });

    return i;
  }

  parseTableRow(line) {
    // Remove leading and trailing pipes
    let cleaned = line.trim();
    if (cleaned.startsWith('|')) cleaned = cleaned.slice(1);
    if (cleaned.endsWith('|')) cleaned = cleaned.slice(0, -1);

    // Split by pipe and trim each cell
    return cleaned.split('|').map(cell => cell.trim());
  }

  parseCodeBlock(lines, startIndex) {
    const firstLine = lines[startIndex].trim();
    const language = firstLine.slice(3).trim(); // Extract language after ```

    let code = '';
    let i = startIndex + 1;

    while (i < lines.length && !lines[i].trim().startsWith('```')) {
      code += lines[i] + '\n';
      i++;
    }

    const html = `<pre><code class="language-${language}">${this.escapeHtml(code.trimEnd())}</code></pre>`;
    this.blocks.push({ type: 'code', html, language });

    return i + 1;
  }

  parseHeading(line) {
    const match = line.trim().match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = this.parseInlineMarkdown(match[2]);
      const html = `<h${level}>${text}</h${level}>`;
      this.blocks.push({ type: 'heading', html, level });
    }
  }

  parseList(lines, startIndex, listType) {
    const items = [];
    let i = startIndex;
    const pattern = listType === 'ul' ? /^[-*+]\s+(.+)$/ : /^\d+\.\s+(.+)$/;

    let itemNumber = 1;
    while (i < lines.length) {
      const trimmed = lines[i].trim();
      const match = trimmed.match(pattern);

      if (!match) break;

      const content = this.parseInlineMarkdown(match[1]);
      const rawContent = match[1];
      const plainMarker = listType === 'ul' ? '-' : `${itemNumber}.`;

      items.push({
        content,
        rawContent,
        plainMarker
      });

      if (listType === 'ol') itemNumber++;
      i++;
    }

    // Generate standard HTML list
    const tag = listType === 'ul' ? 'ul' : 'ol';
    let html = `<${tag}>`;
    items.forEach(item => {
      html += `<li>${item.content}</li>`;
    });
    html += `</${tag}>`;

    this.blocks.push({ type: 'list', html, listType, items });

    return i;
  }

  parseParagraph(line) {
    const text = this.parseInlineMarkdown(line.trim());
    const html = `<p>${text}</p>`;
    this.blocks.push({ type: 'paragraph', html });
  }

  parseInlineMarkdown(text) {
    // Process in order to avoid conflicts

    // Inline code first (to protect content inside from other processing)
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Bold (must be before italic to handle ** before *)
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');

    // Strikethrough
    text = text.replace(/~~([^~]+)~~/g, '<del>$1</del>');

    // Italic (after bold, to avoid conflicts)
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/_([^_]+)_/g, '<em>$1</em>');

    return text;
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  generateOutput() {
    // Generate HTML
    const html = this.blocks.map(block => block.html).join('\n');

    // Generate plain text with proper list formatting
    const text = this.blocks.map(block => {
      if (block.type === 'list' && block.items) {
        // For lists, preserve the markdown markers
        return block.items.map(item =>
          `${item.plainMarker} ${item.rawContent}`
        ).join('\n');
      } else {
        // For other blocks, remove HTML tags
        return block.html.replace(/<[^>]*>/g, '');
      }
    }).join('\n\n');

    return { html, text };
  }
}

// Export for use in background script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarkdownToNotionConverter;
}
