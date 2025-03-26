// Content script for Mindtrail extension
// This script runs in the context of web pages

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getPageContent') {
    // Extract page content for AI summarization
    const pageContent = {
      title: document.title,
      url: window.location.href,
      text: extractMainContent(),
      metadata: extractMetadata()
    };
    
    sendResponse(pageContent);
  }
  
  return true; // Required for async sendResponse
});

// Function to extract the main content from the page
function extractMainContent() {
  // Simple content extraction logic
  // In a production extension, this would be more sophisticated
  
  // Try to find main content containers
  const contentSelectors = [
    'article',
    'main',
    '.content',
    '#content',
    '.post',
    '.article'
  ];
  
  for (const selector of contentSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      return element.innerText;
    }
  }
  
  // Fallback to body text, excluding scripts and styles
  return document.body.innerText;
}

// Function to extract metadata from the page
function extractMetadata() {
  const metadata = {};
  
  // Extract meta tags
  const metaTags = document.querySelectorAll('meta');
  metaTags.forEach(tag => {
    const name = tag.getAttribute('name') || tag.getAttribute('property');
    const content = tag.getAttribute('content');
    if (name && content) {
      metadata[name] = content;
    }
  });
  
  return metadata;
}
