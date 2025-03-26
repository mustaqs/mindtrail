// Background script for Mindtrail extension

// Initialize extension data when installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Mindtrail extension installed');
  
  // Initialize storage with empty sessions array if not already present
  chrome.storage.local.get('sessions', (data) => {
    if (!data.sessions) {
      chrome.storage.local.set({ sessions: [] });
    }
  });
});

// Handle extension icon clicks to ensure popup opens
chrome.action.onClicked.addListener((tab) => {
  // This is a fallback in case the popup doesn't open automatically
  // It will only execute if the popup fails to open
  console.log('Extension icon clicked, ensuring popup opens');
});

// Pre-fetch and cache data when Chrome starts to reduce popup lag
chrome.runtime.onStartup.addListener(() => {
  console.log('Chrome started, pre-fetching extension data');
  // Pre-fetch sessions data
  chrome.storage.local.get('sessions', (data) => {
    // Just accessing the data will cache it in memory
    console.log(`Pre-fetched ${data.sessions ? data.sessions.length : 0} sessions`);
  });
});

// Keep the service worker active to prevent cold starts
setInterval(() => {
  // This empty operation keeps the service worker from being terminated
  // which helps reduce lag when opening the popup
  const timestamp = Date.now();
  if (timestamp % 60000 === 0) { // Log only once per minute to avoid console spam
    console.log('Keeping service worker alive');
  }
}, 20000); // Ping every 20 seconds

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveTabs') {
    saveCurrentTabs(message.sessionName)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Required for async sendResponse
  }
  
  if (message.action === 'getSessions') {
    chrome.storage.local.get('sessions', (data) => {
      sendResponse({ sessions: data.sessions || [] });
    });
    return true; // Required for async sendResponse
  }
  
  if (message.action === 'restoreSession') {
    restoreSession(message.sessionId)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Required for async sendResponse
  }
});

// Function to save current tabs
async function saveCurrentTabs(sessionName = '') {
  try {
    // Get all tabs in current window
    const tabs = await new Promise(resolve => {
      chrome.tabs.query({}, resolve);
    });
    
    // Create session object with enhanced metadata
    const timestamp = Date.now();
    const session = {
      id: timestamp,
      date: new Date().toISOString(),
      created: timestamp,
      name: sessionName || `Session ${new Date().toLocaleString()}`,
      tabs: tabs.map(tab => ({
        id: tab.id,
        title: tab.title,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
        windowId: tab.windowId
      })),
      tabCount: tabs.length
    };
    
    // Add to storage
    const data = await new Promise(resolve => {
      chrome.storage.local.get('sessions', resolve);
    });
    
    const sessions = data.sessions || [];
    sessions.push(session);
    
    await new Promise(resolve => {
      chrome.storage.local.set({ sessions }, resolve);
    });
    
    return { success: true, session };
  } catch (error) {
    console.error('Error saving tabs:', error);
    return { success: false, error: error.message };
  }
}

// Function to restore a session
async function restoreSession(sessionId) {
  try {
    // Get session from storage
    const data = await new Promise(resolve => {
      chrome.storage.local.get('sessions', resolve);
    });
    
    const sessions = data.sessions || [];
    const session = sessions.find(s => s.id === parseInt(sessionId));
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    // If no tabs in session, throw error
    if (!session.tabs || session.tabs.length === 0) {
      throw new Error('No tabs in this session');
    }
    
    // Create new window with session tabs
    const window = await new Promise(resolve => {
      chrome.windows.create({ url: session.tabs[0].url }, resolve);
    });
    
    // Open remaining tabs in the new window
    for (let i = 1; i < session.tabs.length; i++) {
      await new Promise(resolve => {
        chrome.tabs.create({
          windowId: window.id,
          url: session.tabs[i].url,
          active: false
        }, resolve);
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error restoring session:', error);
    return { success: false, error: error.message };
  }
}

// Optional: Add AI summarization functionality here
// This would require integration with an AI service API
