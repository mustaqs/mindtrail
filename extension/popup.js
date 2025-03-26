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
        const sessionContextInput = document.getElementById('session-context');
        const closeTabsCheckbox = document.getElementById('close-tabs');
        const saveSessionButton = document.getElementById('save-session');
        const viewSessionsButton = document.getElementById('view-sessions');
        const currentSessionTabsElement = document.getElementById('current-session-tabs');
        const savedSessionsListElement = document.getElementById('saved-sessions-list');
        
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

        // Get saved sessions and display them
        loadSavedSessions();
        
        // Function to load and display saved sessions
        function loadSavedSessions() {
            chrome.storage.local.get('sessions', (data) => {
                const sessions = data.sessions || [];
                
                // Update session count
                sessionCountElement.textContent = sessions.length;
                
                // Clear the sessions list
                savedSessionsListElement.innerHTML = '';
                
                if (sessions.length === 0) {
                    savedSessionsListElement.innerHTML = '<p class="empty-state">No saved sessions yet</p>';
                    return;
                }
                
                // Get current window tabs to exclude current session
                chrome.tabs.query({ currentWindow: true }, (currentTabs) => {
                    const currentTabUrls = new Set(currentTabs.map(tab => tab.url));
                    
                    // Filter out sessions that match the current window tabs
                    const filteredSessions = sessions.filter(session => {
                        // Skip if tab count doesn't match
                        if (session.tabs.length !== currentTabs.length) return true;
                        
                        // Check if URLs match
                        const sessionUrls = new Set(session.tabs.map(tab => tab.url));
                        let matchCount = 0;
                        sessionUrls.forEach(url => {
                            if (currentTabUrls.has(url)) matchCount++;
                        });
                        
                        // If more than 80% of tabs match, consider it the current session
                        return matchCount / session.tabs.length < 0.8;
                    });
                    
                    // Sort sessions by date (newest first)
                    const sortedSessions = [...filteredSessions].sort((a, b) => {
                        return new Date(b.date) - new Date(a.date);
                    });
                    
                    // Display only the 5 most recent sessions
                    const recentSessions = sortedSessions.slice(0, 5);
                
                // Create session items
                    recentSessions.forEach(session => {
                        const sessionElement = createSessionElement(session);
                        savedSessionsListElement.appendChild(sessionElement);
                    });
                });
            });
        }
        
        // Function to create a session element
        function createSessionElement(session) {
            const sessionElement = document.createElement('div');
            sessionElement.className = 'session-item';
            sessionElement.dataset.id = session.id;
            
            // Create header with name (without redundant date if it's already in the name)
            const headerElement = document.createElement('div');
            headerElement.className = 'session-item-header';
            
            const nameElement = document.createElement('div');
            nameElement.className = 'session-name';
            nameElement.textContent = session.name;
            
            headerElement.appendChild(nameElement);
            
            // Create tabs count
            const tabsCountElement = document.createElement('div');
            tabsCountElement.className = 'session-tabs-count';
            tabsCountElement.textContent = `${session.tabs.length} tabs`;
            
            // Create tabs preview (favicons)
            const previewElement = document.createElement('div');
            previewElement.className = 'session-tabs-preview';
            
            // Add up to 5 favicons
            const previewTabs = session.tabs.slice(0, 5);
            previewTabs.forEach(tab => {
                const favicon = document.createElement('img');
                favicon.className = 'preview-favicon';
                favicon.src = tab.favIconUrl || 'icons/default-favicon.png';
                favicon.onerror = () => { favicon.src = 'icons/default-favicon.png'; };
                previewElement.appendChild(favicon);
            });
            
            // Create expand button
            const expandButton = document.createElement('button');
            expandButton.className = 'expand-button';
            expandButton.textContent = 'Show tabs';
            expandButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const expandedElement = sessionElement.querySelector('.session-tabs-expanded');
                if (expandedElement.classList.contains('show')) {
                    expandedElement.classList.remove('show');
                    expandButton.textContent = 'Show tabs';
                } else {
                    expandedElement.classList.add('show');
                    expandButton.textContent = 'Hide tabs';
                }
            });
            
            // Create expanded tabs list (hidden by default)
            const expandedElement = document.createElement('div');
            expandedElement.className = 'session-tabs-expanded';
            
            // Add tabs to expanded list
            session.tabs.forEach(tab => {
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
                
                // Add click event to open tab
                tabElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    chrome.tabs.create({ url: tab.url });
                });
                
                expandedElement.appendChild(tabElement);
            });
            
            // Add all elements to session item
            sessionElement.appendChild(headerElement);
            sessionElement.appendChild(tabsCountElement);
            sessionElement.appendChild(previewElement);
            sessionElement.appendChild(expandButton);
            sessionElement.appendChild(expandedElement);
            
            // Add click event to open session in sessions.html
            sessionElement.addEventListener('click', () => {
                chrome.tabs.create({ url: `sessions.html?id=${session.id}` });
            });
            
            return sessionElement;
        }

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
                    const context = sessionContextInput.value.trim();
                    const defaultName = `Session ${new Date().toLocaleString()}`;
                    
                    const session = {
                        id: Date.now(),
                        date: new Date().toISOString(),
                        name: customName || defaultName,
                        context: context || '',
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
                            
                            // Clear the session name and context inputs
                            sessionNameInput.value = '';
                            sessionContextInput.value = '';
                            
                            // Show success message
                            saveSessionButton.textContent = 'Saved!';
                            
                            // Reload saved sessions display
                            loadSavedSessions();
                            
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
