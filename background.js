// background.js - Service worker for the extension

// Import converter (note: in service worker, we need to use importScripts)
importScripts('converter.js');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'convert') {
    try {
      const converter = new MarkdownToNotionConverter();
      const result = converter.convert(request.markdown);
      sendResponse({ result });
    } catch (error) {
      console.error('Conversion error:', error);
      sendResponse({ error: error.message });
    }
    return true; // Keep the message channel open for async response
  }
});

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'convert-and-paste') {
    // Open the popup or trigger conversion
    chrome.action.openPopup();
  }
});

// Extension installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Notionizer installed successfully');
    // Could open a welcome page or instructions here
  } else if (details.reason === 'update') {
    console.log('Notionizer updated to version', chrome.runtime.getManifest().version);
  }
});

console.log('Notionizer background script loaded');
