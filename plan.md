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

To do:

- add ability for users to select tabs to add to a session (implement next)

Rollout Plan
	•	Keep default behavior as “Save All” to preserve simplicity
	•	Add “Select Tabs” as a power feature toggle
	•	Could tie into paid tier or advanced users later


- add intelligent AI features:
    - add AI summarization
    What it does:
	•	Generates short summaries of each saved tab using LLMs (like GPT)
	•	Helps users recall why they opened that tab, not just what it was

Value:
	•	Instantly gives context at a glance
	•	Eliminates need to reopen every tab just to remember

How it works:
	•	Use fetch() to get tab content (if same-origin), or metadata
	•	Pass page text or metadata to OpenAI or Hugging Face summarization model
	•	Store summaries with each tab object

    - Semantic tab grouping

    What it does:
	•	Automatically clusters tabs by topic or theme, even if they’re from different domains

Value:
	•	Organizes sessions into logical sections: “LLMs,” “Dev Tools,” “Paris trip”
	•	Reduces user effort in post-organizing

How it works:
	•	Generate embeddings for page content or titles
	•	Use cosine similarity to cluster related tabs
	•	Label groups using dominant keywords (or GPT prompt)

    - ai-powered session naming

    What it does:
	•	Auto-generates a session title based on the tab content

Example:
	•	Instead of “Session 3/25/2025,” show:
🧠 “Learning About LLM Agents + Chat UI Patterns”

How it works:
	•	Send all tab titles (or first 100 words of content) to GPT with a prompt like:
“Summarize what this user was researching or working on.”


    - full text search with semantic ranking

    What it does:
	•	Lets users search through all their sessions using natural language
	•	Search results ranked by meaning, not just keywords

Example Queries:

“That article about prompt chaining”
“Session where I was researching low-code tools for startups”

How it works:
	•	Store embeddings for tab titles/summaries
	•	Use vector search (e.g., pgvector with Supabase, or Pinecone) to retrieve related items

⸻


    - personalized recommendations (future sprint)

    (For Future Expansion)
	•	Suggest similar articles or resources based on tab content
	•	“You recently researched LLM agents — want to check out this new Open Source repo?”


    - daily/weekly digest (future sprint)
    What it does:
	•	Sends you a smart digest of what you researched this week
	•	Includes session names, top tabs, and AI summaries

How it helps:
	•	Reinforces memory
	•	Helps build a second brain / knowledge base

    Most of these would be pro features

- mobile app to sync your sessions across devices, instantly allowing you to open sessions on a new device

- security features 
   - add password protection
   - add encryption for session data
   - tool shouldn't save secure webpages like bank accounts