# 🧩 Chrome Extension MVP – Dev Task List

## ✅ Core Features

### 📥 Save Session (One-Click)
- [ ] Set up Chrome extension project (manifest.json, permissions, etc.)
- [ ] Capture all open tabs in current window
- [ ] Store tab metadata: title, URL, favicon, timestamp
- [ ] Save session to localStorage (with session ID or timestamp)

### 🗃️ Session Storage & Display
- [ ] Create UI in popup.html to list past sessions
- [ ] Load and display recent sessions in reverse-chronological order
- [ ] Each session shows: title (timestamp), number of tabs, expandable tab list
- [ ] Create new tab page for full session dashboard (optional for MVP)

### 🔁 Reopen Session
- [ ] Add "Reopen All Tabs" button for each session
- [ ] Add option to reopen selected tabs from a session

### 🧹 Optional Tab Close After Save
- [ ] Add toggle in popup UI: "Close tabs after saving"
- [ ] Implement logic to auto-close tabs after session is saved
- [ ] Persist toggle preference in localStorage

## 🧪 Optional Features (For Early Power Users)

### 🧠 AI Summarization (Future Sprint)
- [ ] Add optional field to tab metadata for summary
- [ ] Call OpenAI API or other NLP service with tab URL (or scrape content)
- [ ] Store and display summaries in tab view

### 🏷️ Tag or Name Session
- [ ] Add input field in popup to name current session (optional)
- [ ] Default to timestamp if name is not provided

### 🔍 Search Past Sessions
- [ ] Add search bar to dashboard page
- [ ] Implement fuzzy search over tab titles and session names

## ⚙️ Infrastructure / Setup
- [ ] Set up basic file structure (popup.html, popup.js, styles.css, background.js)
- [ ] Configure permissions for tabs API and storage
- [ ] Add extension icon and manifest metadata
- [ ] Add build and zip command for packaging

## 🔐 Privacy & Exclusions
- [ ] Add setting to exclude incognito mode
- [ ] Filter out private or sensitive domains (e.g., gmail, banking)

## 📦 Packaging & Testing
- [ ] Test extension locally in Chrome
- [ ] Test save/load sessions
- [ ] Test auto-close toggle and reopen behavior
- [ ] Zip and upload to Chrome Web Store (or prepare for manual install)

## 🚀 Launch Support
- [ ] Link "Join Waitlist" in popup or options page
- [ ] Add feedback form or link to landing page
- [ ] Set up error logging (console, Sentry optional)
