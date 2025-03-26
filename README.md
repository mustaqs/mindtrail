# Mindtrail - Smart Tab Management Chrome Extension

Mindtrail is a Chrome extension that helps you manage your browser tabs efficiently. It allows you to save your tab sessions, organize them by topic, and resume your research with context and clarity.

## Features

- ✅ Save & close your tab chaos with one click
- 🧠 Summarize and group your research using AI
- 🔁 Resume your sessions with context and clarity
- 📚 Build a searchable history of your thinking

## Project Structure

```
mindtrail/
├── extension/           # Chrome extension code
│   ├── manifest.json    # Chrome extension manifest file
│   ├── popup.html       # Extension popup interface
│   ├── popup.css        # Popup styles
│   ├── popup.js         # Popup functionality
│   ├── background.js    # Background service worker
│   ├── content.js       # Content script for web pages
│   ├── sessions.html    # Saved sessions page
│   ├── sessions.css     # Sessions page styles
│   ├── sessions.js      # Sessions page functionality
│   └── icons/           # Extension icons and favicons
├── landing-page/        # Marketing website
│   ├── index.html       # Landing page
│   ├── styles.css       # Landing page styles
│   ├── script.js        # Landing page scripts
│   └── favicon.svg      # Website favicon
├── plan.md              # Development plan and roadmap
└── README.md            # Project documentation
```

## Installation (Development Mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the `mindtrail/extension` directory
5. The extension should now be installed and visible in your Chrome toolbar

## Usage

1. Click the Mindtrail icon in your Chrome toolbar to open the popup
2. Use the "Save Current Session" button to save all your open tabs
3. Click "View Saved Sessions" to see all your saved sessions
4. From the sessions page, you can:
   - View details of each session
   - Restore a previous session
   - Generate AI summaries of your sessions
   - Search through your saved sessions

## Development

### Landing Page

The landing page (`index.html`) is designed to showcase the extension's features and collect email addresses for the waitlist. It includes:

- Hero section explaining the problem of tab overload
- Solution section highlighting the extension's features
- Demo section (placeholder for now)
- Waitlist signup form

### Extension Core

The extension consists of:

- A popup interface for quick actions
- A background script that manages tab sessions
- A content script that extracts page content for AI analysis
- A sessions page for viewing and managing saved sessions

### Future Enhancements

- Integration with a real AI service for better summarization
- Topic clustering and categorization
- Cross-device synchronization
- Custom session naming and tagging

## License

© 2025 Mindtrail. All rights reserved.
