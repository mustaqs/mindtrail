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
        const saveTabsButton = document.getElementById('save-tabs');
        const viewSessionsButton = document.getElementById('view-sessions');
        const currentSessionTabsElement = document.getElementById('current-session-tabs');
        const savedSessionsListElement = document.getElementById('saved-sessions-list');
        
        // Save tabs modal elements
        const saveTabsModal = document.getElementById('save-tabs-modal');
        const closeModalButton = document.getElementById('close-modal');
        const selectAllButton = document.getElementById('select-all');
        const deselectAllButton = document.getElementById('deselect-all');
        const selectableTabsContainer = document.getElementById('selectable-tabs');
        const saveSelectedTabsButton = document.getElementById('save-selected-tabs');
        
        // This helper function is not used anywhere, removing it for optimization
        
        // Load saved preferences
        chrome.storage.local.get('closeTabsAfterSaving', (data) => {
            if (data.closeTabsAfterSaving !== undefined) {
                closeTabsCheckbox.checked = data.closeTabsAfterSaving;
            }
        });

        // Get current tabs - optimized query
        let currentTabs = [];
        
        function loadCurrentTabs() {
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                // Store tabs for later use
                currentTabs = tabs;
                
                // Update tab count
                tabCountElement.textContent = tabs.length;
                
                // Clear and display tabs with minimal DOM operations
                if (currentSessionTabsElement) {
                    currentSessionTabsElement.textContent = '';
                    
                    if (tabs.length > 0) {
                        // Create document fragment for better performance
                        const fragment = document.createDocumentFragment();
                        
                        tabs.forEach(tab => {
                            const tabElement = document.createElement('div');
                            tabElement.className = 'tab-item';
                            
                            const favicon = document.createElement('img');
                            favicon.className = 'tab-favicon';
                            
                            // Only add favicon if it exists
                            if (tab.favIconUrl) {
                                favicon.src = tab.favIconUrl;
                                favicon.onerror = () => { favicon.style.display = 'none'; };
                            } else {
                                favicon.style.display = 'none';
                            }
                            
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
                }
            });
        }
        
        // Load tabs initially
        loadCurrentTabs();

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
                // Only add favicon if it exists
                if (tab.favIconUrl) {
                    const favicon = document.createElement('img');
                    favicon.className = 'preview-favicon';
                    favicon.src = tab.favIconUrl;
                    favicon.onerror = () => { favicon.style.display = 'none'; };
                    previewElement.appendChild(favicon);
                }
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
                
                // Only add favicon if it exists
                if (tab.favIconUrl) {
                    favicon.src = tab.favIconUrl;
                    favicon.onerror = () => { favicon.style.display = 'none'; };
                } else {
                    favicon.style.display = 'none';
                }
                
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

        // Function to save tabs (either all or selected)
        function saveTabs(tabsToSave, customName = '', context = '') {
            try {
                // Use provided name/context or default
                const defaultName = `Session ${new Date().toLocaleString()}`;
                
                const session = {
                    id: Date.now(),
                    date: new Date().toISOString(),
                    name: customName || defaultName,
                    context: context || '',
                    tabs: tabsToSave.map(tab => ({
                        title: tab.title,
                        url: tab.url,
                        favIconUrl: tab.favIconUrl
                    })),
                    tabCount: tabsToSave.length
                };

                // Save to storage
                chrome.storage.local.get('sessions', (data) => {
                    const sessions = data.sessions || [];
                    sessions.push(session);
                    
                    chrome.storage.local.set({ sessions }, () => {
                        // Update session count
                        sessionCountElement.textContent = sessions.length;
                        
                        // Reload saved sessions display
                        loadSavedSessions();
                        
                        // Close tabs if option is checked
                        if (closeTabsCheckbox.checked && tabsToSave.length > 0) {
                            const tabIds = tabsToSave.map(tab => tab.id);
                            chrome.tabs.remove(tabIds);
                        }
                    });
                });
            } catch (error) {
                console.error('Error saving tabs:', error);
            }
        }
        
        // Open save tabs modal
        saveTabsButton.addEventListener('click', () => {
            // Clear previous inputs
            sessionNameInput.value = '';
            sessionContextInput.value = '';
            
            // Clear previous selections
            selectedTabs.clear();
            
            // Refresh tabs list
            loadTabsForSelection();
            
            // Show modal
            saveTabsModal.classList.add('show');
        });
        
        // Close modal
        closeModalButton.addEventListener('click', () => {
            saveTabsModal.classList.remove('show');
        });

        // View saved sessions - simplified
        viewSessionsButton.addEventListener('click', () => {
            chrome.tabs.create({ url: 'sessions.html' });
        });
        
        // Tab selection functionality
        let selectedTabs = new Set();
        
        // Select all tabs
        selectAllButton.addEventListener('click', () => {
            const checkboxes = selectableTabsContainer.querySelectorAll('.tab-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
                const tabId = parseInt(checkbox.dataset.tabId);
                selectedTabs.add(tabId);
                checkbox.closest('.selectable-tab-item').classList.add('selected');
            });
        });
        
        // Deselect all tabs
        deselectAllButton.addEventListener('click', () => {
            const checkboxes = selectableTabsContainer.querySelectorAll('.tab-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.closest('.selectable-tab-item').classList.remove('selected');
            });
            selectedTabs.clear();
        });
        
        // Load tabs for selection
        function loadTabsForSelection() {
            selectableTabsContainer.innerHTML = '';
            
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                if (tabs.length === 0) {
                    selectableTabsContainer.innerHTML = '<p class="empty-state">No tabs open in this window</p>';
                    return;
                }
                
                const fragment = document.createDocumentFragment();
                
                tabs.forEach(tab => {
                    const tabElement = document.createElement('div');
                    tabElement.className = 'selectable-tab-item';
                    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'tab-checkbox';
                    checkbox.dataset.tabId = tab.id;
                    
                    const favicon = document.createElement('img');
                    favicon.className = 'tab-favicon';
                    
                    // Only add favicon if it exists
                    if (tab.favIconUrl) {
                        favicon.src = tab.favIconUrl;
                        favicon.onerror = () => { favicon.style.display = 'none'; };
                    } else {
                        favicon.style.display = 'none';
                    }
                    
                    const title = document.createElement('span');
                    title.className = 'tab-title';
                    title.textContent = tab.title;
                    
                    // Handle checkbox change
                    checkbox.addEventListener('change', () => {
                        const tabId = parseInt(checkbox.dataset.tabId);
                        if (checkbox.checked) {
                            selectedTabs.add(tabId);
                            tabElement.classList.add('selected');
                        } else {
                            selectedTabs.delete(tabId);
                            tabElement.classList.remove('selected');
                        }
                    });
                    
                    // Make the whole item clickable
                    tabElement.addEventListener('click', (e) => {
                        if (e.target !== checkbox) {
                            checkbox.checked = !checkbox.checked;
                            const event = new Event('change');
                            checkbox.dispatchEvent(event);
                        }
                    });
                    
                    tabElement.appendChild(checkbox);
                    tabElement.appendChild(favicon);
                    tabElement.appendChild(title);
                    fragment.appendChild(tabElement);
                });
                
                selectableTabsContainer.appendChild(fragment);
            });
        }
        
        // Save selected tabs
        saveSelectedTabsButton.addEventListener('click', () => {
            if (selectedTabs.size === 0) {
                alert('Please select at least one tab to save.');
                return;
            }
            
            saveSelectedTabsButton.disabled = true;
            saveSelectedTabsButton.textContent = 'Saving...';
            
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                let tabsToSave = tabs;
                
                // If there are selected tabs, filter to only those tabs
                if (selectedTabs.size > 0) {
                    tabsToSave = tabs.filter(tab => selectedTabs.has(tab.id));
                }
                
                // Get the session details from the modal
                const customName = sessionNameInput.value.trim();
                const context = sessionContextInput.value.trim();
                
                saveTabs(tabsToSave, customName, context);
                
                // Close modal
                saveTabsModal.classList.remove('show');
                
                // Show success message on the main button
                saveTabsButton.textContent = 'Saved!';
                saveSelectedTabsButton.textContent = 'Save Selected Tabs';
                saveSelectedTabsButton.disabled = false;
                
                setTimeout(() => {
                    saveTabsButton.textContent = 'Save Tabs';
                }, 1500);
            });
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
