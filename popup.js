// popup.js - UI logic for the extension popup

document.addEventListener('DOMContentLoaded', function() {
  const convertBtn = document.getElementById('convertBtn');
  const statusDiv = document.getElementById('status');
  const statusMessage = statusDiv.querySelector('.status-message');

  convertBtn.addEventListener('click', async function() {
    try {
      showStatus('processing', 'Reading clipboard...');

      // Read from clipboard
      const text = await navigator.clipboard.readText();

      if (!text || text.trim() === '') {
        showStatus('error', 'Clipboard is empty');
        return;
      }

      showStatus('processing', 'Converting markdown...');

      // Convert markdown to Notion format
      const converted = await convertMarkdownToNotion(text);

      // Debug: Log the generated HTML
      console.log('Generated HTML:', converted.html);
      console.log('Generated Text:', converted.text);

      // Write to clipboard
      await writeToClipboard(converted);

      showStatus('success', 'Ready to paste into Notion!');

      // Hide status after 3 seconds
      setTimeout(() => {
        hideStatus();
      }, 3000);

    } catch (error) {
      console.error('Conversion error:', error);
      showStatus('error', `Error: ${error.message}`);
    }
  });

  function showStatus(type, message) {
    statusDiv.className = `status ${type}`;
    statusMessage.textContent = message;
  }

  function hideStatus() {
    statusDiv.className = 'status hidden';
  }

  async function convertMarkdownToNotion(markdown) {
    // Send to background script for conversion
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        action: 'convert',
        markdown: markdown
      }, response => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.result);
        }
      });
    });
  }

  async function writeToClipboard(data) {
    // Write both HTML and plain text to clipboard
    const htmlBlob = new Blob([data.html], { type: 'text/html' });
    const textBlob = new Blob([data.text], { type: 'text/plain' });

    const clipboardItem = new ClipboardItem({
      'text/html': htmlBlob,
      'text/plain': textBlob
    });

    await navigator.clipboard.write([clipboardItem]);
  }
});
