document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const sessionsList = document.getElementById('sessions-list');
    const sessionDetails = document.getElementById('session-details');
    const sessionTitle = document.getElementById('session-title');
    const sessionDate = document.getElementById('session-date');
    const sessionTabsCount = document.getElementById('session-tabs-count');
    const sessionTabsList = document.getElementById('session-tabs-list');
    const sessionSummaryContent = document.getElementById('session-summary-content');
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
        `;
        
        // Add click event to view session details
        card.addEventListener('click', () => {
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
            favicon.src = tab.favIconUrl || 'icons/default-favicon.png';
            favicon.onerror = () => { favicon.src = 'icons/default-favicon.png'; };
            
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
        
        // Show AI summary if available, otherwise show placeholder
        if (session.summary) {
            sessionSummaryContent.innerHTML = `<p>${session.summary}</p>`;
        } else {
            sessionSummaryContent.innerHTML = `
                <p class="placeholder-text">AI summary will be generated soon. This feature uses AI to analyze and summarize the content of your tabs.</p>
                <button id="generate-summary" class="secondary-btn" style="margin-top: 12px;">
                    <span class="icon">🤖</span> Generate Summary
                </button>
            `;
            
            // Add event listener to generate summary button
            const generateSummaryButton = document.getElementById('generate-summary');
            if (generateSummaryButton) {
                generateSummaryButton.addEventListener('click', () => {
                    generateAISummary(session);
                });
            }
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
                    restoreSessionButton.textContent = '✅ Session Restored!';
                } else {
                    restoreSessionButton.textContent = '❌ Error: ' + (response.error || 'Unknown error');
                }
                
                setTimeout(() => {
                    restoreSessionButton.innerHTML = '<span class="icon">🔄</span> Restore Session';
                    restoreSessionButton.disabled = false;
                }, 2000);
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
        // In a real implementation, this would call an AI service API
        // For this prototype, we'll simulate an AI summary
        
        const summaryElement = document.getElementById('session-summary-content');
        summaryElement.innerHTML = '<p class="placeholder-text">Generating summary...</p>';
        
        // Simulate API call delay
        setTimeout(() => {
            // Create a simple summary based on tab titles
            const topics = extractTopics(session.tabs);
            const summary = `This session contains ${session.tabs.length} tabs focused on ${topics.join(', ')}. The main topics appear to be research and learning about these subjects.`;
            
            // Update UI
            summaryElement.innerHTML = `<p>${summary}</p>`;
            
            // Save summary to session
            chrome.storage.local.get('sessions', (data) => {
                const sessions = data.sessions || [];
                const updatedSessions = sessions.map(s => {
                    if (s.id === session.id) {
                        return { ...s, summary };
                    }
                    return s;
                });
                
                chrome.storage.local.set({ sessions: updatedSessions });
                
                // Update current session
                currentSession.summary = summary;
            });
        }, 2000);
    }

    function extractTopics(tabs) {
        // Simple topic extraction from tab titles
        // In a real implementation, this would use NLP or an AI service
        
        // Get all words from tab titles
        const words = tabs
            .map(tab => tab.title.split(' '))
            .flat()
            .map(word => word.toLowerCase())
            .filter(word => word.length > 3)
            .filter(word => !['http', 'https', 'www', 'com', 'org', 'the', 'and', 'that', 'this', 'with', 'for'].includes(word));
        
        // Count word frequency
        const wordCounts = {};
        words.forEach(word => {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        });
        
        // Sort by frequency
        const sortedWords = Object.entries(wordCounts)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);
        
        // Return top 3 words as topics
        return sortedWords.slice(0, 3);
    }
});
