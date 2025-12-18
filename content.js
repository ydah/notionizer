// content.js - Content script that runs on Notion pages

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'paste') {
    // Handle paste action if needed
    // This could be used for direct paste functionality in the future
    console.log('Paste action received in content script');
  }
});

// Listen for keyboard shortcuts
document.addEventListener('keydown', (event) => {
  // Check for Ctrl+Shift+V (or Cmd+Shift+V on Mac)
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'V') {
    // The shortcut is handled by the background script
    // This is just a placeholder for future functionality
    console.log('Notionizer shortcut detected');
  }
});

console.log('Notionizer content script loaded');
