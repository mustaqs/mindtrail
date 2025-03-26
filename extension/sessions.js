document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const sessionsList = document.getElementById('sessions-list');
    const sessionDetails = document.getElementById('session-details');
    const sessionTitle = document.getElementById('session-title');
    const sessionDate = document.getElementById('session-date');
    const sessionTabsCount = document.getElementById('session-tabs-count');
    const sessionTabsList = document.getElementById('session-tabs-list');
    const sessionContext = document.getElementById('session-context');
    const sessionContextContent = document.getElementById('session-context-content');
    const backButton = document.getElementById('back-button');
    const restoreSessionButton = document.getElementById('restore-session');
    const deleteSessionButton = document.getElementById('delete-session');
    const searchInput = document.getElementById('search-input');

    // Current session being viewed
    let currentSession = null;

    // Load sessions from storage
    loadSessions();

    // Event listeners
    backButton.addEventListener('click', showSessionsList);
    restoreSessionButton.addEventListener('click', restoreCurrentSession);
    deleteSessionButton.addEventListener('click', deleteCurrentSession);
    searchInput.addEventListener('input', filterSessions);

    // Functions
    function loadSessions() {
        chrome.storage.local.get('sessions', (data) => {
            const sessions = data.sessions || [];
            
            if (sessions.length === 0) {
                sessionsList.innerHTML = `
                    <div class="loading">
                        No sessions saved yet. Use the extension popup to save your first session.
                    </div>
                `;
                return;
            }
            
            // Sort sessions by date (newest first)
            sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Clear loading message
            sessionsList.innerHTML = '';
            
            // Display sessions
            sessions.forEach(session => {
                const sessionCard = createSessionCard(session);
                sessionsList.appendChild(sessionCard);
            });
        });
    }

    function createSessionCard(session) {
        const card = document.createElement('div');
        card.className = 'session-card';
        card.dataset.sessionId = session.id;
        
        // Format date
        const date = new Date(session.date);
        const formattedDate = date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Create preview of favicons (up to 5)
        let faviconPreview = '';
        const previewTabs = session.tabs.slice(0, 5);
        previewTabs.forEach(tab => {
            if (tab.favIconUrl) {
                faviconPreview += `<img src="${tab.favIconUrl}" class="preview-favicon" alt="">`;
            }
        });
        
        card.innerHTML = `
            <h3>${session.name}</h3>
            <div class="session-meta">
                <span>${formattedDate}</span>
                <span>${session.tabs.length} tabs</span>
            </div>
            <div class="session-preview">
                ${faviconPreview}
            </div>
            <button class="view-tabs-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
                View Tabs
            </button>
        `;
        
        // Add click event to view session details
        card.addEventListener('click', (e) => {
            // Only trigger if not clicking the View Tabs button
            if (!e.target.closest('.view-tabs-btn')) {
                viewSessionDetails(session);
            }
        });
        
        // Add click event for View Tabs button
        const viewTabsBtn = card.querySelector('.view-tabs-btn');
        viewTabsBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click event
            viewSessionDetails(session);
        });
        
        return card;
    }

    function viewSessionDetails(session) {
        currentSession = session;
        
        // Update session details
        sessionTitle.textContent = session.name;
        
        // Format date
        const date = new Date(session.date);
        sessionDate.textContent = date.toLocaleString();
        
        // Update tabs count
        sessionTabsCount.textContent = `${session.tabs.length} tabs`;
        
        // Clear tabs list
        sessionTabsList.innerHTML = '';
        
        // Add tabs to list
        session.tabs.forEach(tab => {
            const tabElement = document.createElement('div');
            tabElement.className = 'tab-item';
            
            // Create favicon
            const favicon = document.createElement('img');
            favicon.className = 'tab-favicon';
            
            // Only add favicon if it exists
            if (tab.favIconUrl) {
                favicon.src = tab.favIconUrl;
                favicon.onerror = () => { favicon.style.display = 'none'; };
            } else {
                favicon.style.display = 'none';
            }
            
            // Create title
            const title = document.createElement('span');
            title.className = 'tab-title';
            title.textContent = tab.title;
            
            // Create URL
            const url = document.createElement('span');
            url.className = 'tab-url';
            url.textContent = tab.url;
            
            // Add elements to tab item
            tabElement.appendChild(favicon);
            tabElement.appendChild(title);
            tabElement.appendChild(url);
            
            // Add click event to open tab
            tabElement.addEventListener('click', () => {
                chrome.tabs.create({ url: tab.url });
            });
            
            sessionTabsList.appendChild(tabElement);
        });
        
        // Display context if available
        if (session.context && session.context.trim() !== '') {
            sessionContextContent.textContent = session.context;
            sessionContext.classList.remove('hidden');
        } else {
            sessionContext.classList.add('hidden');
        }
        
        // Hide sessions list and show details
        sessionsList.style.display = 'none';
        sessionDetails.classList.remove('hidden');
    }

    function showSessionsList() {
        // Hide details and show sessions list
        sessionDetails.classList.add('hidden');
        sessionsList.style.display = 'grid';
        currentSession = null;
    }

    function restoreCurrentSession() {
        if (!currentSession) return;
        
        restoreSessionButton.textContent = 'Restoring...';
        restoreSessionButton.disabled = true;
        
        chrome.runtime.sendMessage(
            { action: 'restoreSession', sessionId: currentSession.id },
            (response) => {
                if (response.success) {
                    restoreSessionButton.textContent = 'Session Restored!';
                } else {
                    restoreSessionButton.textContent = 'Error: ' + (response.error || 'Unknown error');
                }
                
                setTimeout(() => {
                    restoreSessionButton.textContent = 'Restore Session';
                    restoreSessionButton.disabled = false;
                }, 1500);
            }
        );
    }

    function deleteCurrentSession() {
        if (!currentSession) return;
        
        if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
            chrome.storage.local.get('sessions', (data) => {
                const sessions = data.sessions || [];
                const updatedSessions = sessions.filter(s => s.id !== currentSession.id);
                
                chrome.storage.local.set({ sessions: updatedSessions }, () => {
                    showSessionsList();
                    loadSessions();
                });
            });
        }
    }

    function filterSessions() {
        const searchTerm = searchInput.value.toLowerCase();
        const sessionCards = document.querySelectorAll('.session-card');
        
        sessionCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function generateAISummary(session) {
        // AI summary functionality has been removed
    }
});
