# Notionizer

A Chrome extension that converts markdown text to Notion-compatible format.

## Features

- Table conversion from markdown tables to Notion table blocks
- List conversion for both unordered and ordered lists
- Heading support for H1-H6
- Code block conversion with syntax highlighting support
- Inline formatting including bold, italic, strikethrough, inline code, and links
- Keyboard shortcut support with Ctrl+Shift+V (Mac: Command+Shift+V)

## Installation

### Development Build

1. Clone or download this repository
   ```bash
   git clone <repository-url>
   cd notionizer
   ```

2. Icon preparation

   Chrome extensions require PNG format icons. PNG files have already been generated in the `icons/` directory:
   - `icon16.png` (16x16px)
   - `icon48.png` (48x48px)
   - `icon128.png` (128x128px)

   If you need to regenerate them from SVG files:
   ```bash
   convert icons/icon16.svg icons/icon16.png
   convert icons/icon48.svg icons/icon48.png
   convert icons/icon128.svg icons/icon128.png
   ```

3. Load the extension in Chrome
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `notionizer` directory

## Usage

### Method 1: Using the popup

1. Copy markdown text (Ctrl+C or Command+C)
2. Click the extension icon
3. Click the "Convert & Prepare" button
4. Paste into Notion (Ctrl+V or Command+V)

### Method 2: Keyboard shortcut

1. Copy markdown text
2. Press Ctrl+Shift+V (Mac: Command+Shift+V)
3. Paste into Notion

## Supported Markdown Syntax

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Lists

```markdown
- Unordered list item 1
- Unordered list item 2
  - Nested item

1. Ordered list item 1
2. Ordered list item 2
```

### Headings

```markdown
# Heading 1
## Heading 2
### Heading 3
```

### Code Blocks

```markdown
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`
```

### Inline Formatting

```markdown
**bold**
*italic*
~~strikethrough~~
`inline code`
[link](https://example.com)
```

## Troubleshooting

### Icons not displaying

If the icon files specified in manifest.json do not exist, the extension will not load. Ensure PNG format icons are placed in the `icons/` directory.

### Conversion not working

1. Check console errors by right-clicking the extension popup and selecting "Inspect"
2. Verify clipboard permissions are granted
3. Confirm markdown syntax is correct

### Pasting into Notion fails

Due to Notion's specifications, some HTML elements may not convert as expected. For complex tables or nested structures, consider pasting content incrementally.

## Development

### File Structure

```
notionizer/
├── manifest.json         # Extension configuration
├── popup.html           # Popup UI
├── popup.js             # Popup logic
├── background.js        # Service worker
├── content.js           # Content script
├── converter.js         # Markdown conversion logic
├── styles.css           # UI styles
├── icons/              # Icon images
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # This file
```

### Testing

After making changes to the extension:

1. Click the refresh button for the extension at `chrome://extensions/`
2. Test with various markdown patterns
3. Check the console for errors

## License

MIT License

## Contributing

Bug reports and feature requests are welcome via Issues.
