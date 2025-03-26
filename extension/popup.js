// Minimal error handler - only log critical errors
window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
    event.preventDefault();
});

// Fast initialization
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Get DOM elements
        const tabCountElement = document.getElementById('tab-count');
        const sessionCountElement = document.getElementById('session-count');
        const sessionNameInput = document.getElementById('session-name');
        const closeTabsCheckbox = document.getElementById('close-tabs');
        const saveSessionButton = document.getElementById('save-session');
        const viewSessionsButton = document.getElementById('view-sessions');
        const currentSessionTabsElement = document.getElementById('current-session-tabs');
        
        // This helper function is not used anywhere, removing it for optimization
        
        // Load saved preferences
        chrome.storage.local.get('closeTabsAfterSaving', (data) => {
            if (data.closeTabsAfterSaving !== undefined) {
                closeTabsCheckbox.checked = data.closeTabsAfterSaving;
            }
        });

        // Get current tabs - optimized query
        chrome.tabs.query({ currentWindow: true }, (tabs) => {
            // Update tab count
            tabCountElement.textContent = tabs.length;

            // Clear and display tabs with minimal DOM operations
            currentSessionTabsElement.textContent = '';
                
            if (tabs.length > 0) {
                // Create document fragment for better performance
                const fragment = document.createDocumentFragment();
                
                tabs.forEach(tab => {
                    const tabElement = document.createElement('div');
                    tabElement.className = 'tab-item';
                    
                    const favicon = document.createElement('img');
                    favicon.className = 'tab-favicon';
                    favicon.src = tab.favIconUrl || 'icons/default-favicon.png';
                    
                    const title = document.createElement('span');
                    title.className = 'tab-title';
                    title.textContent = tab.title;
                    
                    tabElement.appendChild(favicon);
                    tabElement.appendChild(title);
                    fragment.appendChild(tabElement);
                });
                
                currentSessionTabsElement.appendChild(fragment);
            } else {
                const emptyState = document.createElement('p');
                emptyState.className = 'empty-state';
                emptyState.textContent = 'No tabs open in this window';
                currentSessionTabsElement.appendChild(emptyState);
            }
        });

        // Get saved sessions count
        chrome.storage.local.get('sessions', (data) => {
            const sessions = data.sessions || [];
            sessionCountElement.textContent = sessions.length;
        });

        // Save preference when checkbox changes
        closeTabsCheckbox.addEventListener('change', () => {
            try {
                chrome.storage.local.set({ closeTabsAfterSaving: closeTabsCheckbox.checked });
            } catch (error) {
                console.error('Error saving preference:', error);
            }
        });

        // Save current session
        saveSessionButton.addEventListener('click', () => {
            try {
                // Disable the button to prevent multiple clicks
                saveSessionButton.disabled = true;
                saveSessionButton.textContent = 'Saving...';
        
                // Query tabs in the current window
                chrome.tabs.query({ currentWindow: true }, (tabs) => {
                    // Get the custom name or use a default timestamp-based name
                    const customName = sessionNameInput.value.trim();
                    const defaultName = `Session ${new Date().toLocaleString()}`;
                    
                    const session = {
                        id: Date.now(),
                        date: new Date().toISOString(),
                        name: customName || defaultName,
                        tabs: tabs.map(tab => ({
                            title: tab.title,
                            url: tab.url,
                            favIconUrl: tab.favIconUrl
                        })),
                        tabCount: tabs.length
                    };

                    // Save to storage
                    chrome.storage.local.get('sessions', (data) => {
                        const sessions = data.sessions || [];
                        sessions.push(session);
                        
                        chrome.storage.local.set({ sessions }, () => {
                            // Update session count
                            sessionCountElement.textContent = sessions.length;
                            
                            // Clear the session name input
                            sessionNameInput.value = '';
                            
                            // Show success message
                            saveSessionButton.textContent = 'Saved!';
                            
                            setTimeout(() => {
                                saveSessionButton.textContent = 'Save Current Session';
                                saveSessionButton.disabled = false;
                            }, 1500);
                            
                            // Close tabs if option is checked
                            if (closeTabsCheckbox.checked && tabs.length > 0) {
                                const tabIds = tabs.map(tab => tab.id);
                                chrome.tabs.remove(tabIds);
                            }
                        });
                    });
                });
            } catch (error) {
                console.error('Error:', error);
                saveSessionButton.textContent = 'Error';
                setTimeout(() => {
                    saveSessionButton.textContent = 'Save Current Session';
                    saveSessionButton.disabled = false;
                }, 1500);
            }
        });

        // View saved sessions - simplified
        viewSessionsButton.addEventListener('click', () => {
            chrome.tabs.create({ url: 'sessions.html' });
        });
    } catch (error) {
        console.error('Error:', error);
        // Display minimal error message
        document.body.innerHTML = `
            <div style="padding: 16px; text-align: center;">
                <p>Error loading extension</p>
                <button onclick="window.location.reload()">Reload</button>
            </div>
        `;
    }
});
