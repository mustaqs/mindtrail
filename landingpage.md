// Step-by-step instructions for Windsurf Agent to build Mindtrail Landing Page in Next.js

/**
 * OVERVIEW
 * Framework: Next.js (with Tailwind CSS)
 * Goal: Clean, minimalistic landing page with CTA flow
 */

// -------------------------
// 1. SETUP PROJECT
// -------------------------
// If not already done:
npx create-next-app@latest mindtrail-landing
cd mindtrail-landing
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

// Configure Tailwind in tailwind.config.js:
content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"]

// Add Tailwind to globals.css:
@tailwind base;
@tailwind components;
@tailwind utilities;


// -------------------------
// 2. FOLDER STRUCTURE
// -------------------------
// Create folders:
/components
/public/images  (place demo screenshots)
/public/video   (place demo video)


// -------------------------
// 3. HERO SECTION
// -------------------------
// File: components/Hero.tsx
// Contains headline, short intro, CTA, and a Swiper.js carousel of screenshots
// Uses Swiper.js (install via npm install swiper)

// -------------------------
// 4. FEATURES SECTION
// -------------------------
// File: components/Features.tsx
// Two columns/lists: "Available Today" and "Coming Soon (AI)"
// Minimal icons + small descriptions + CTA button


// -------------------------
// 5. DEMO SECTION
// -------------------------
// File: components/Demo.tsx
// Embed a YouTube video or local video player with clean layout


// -------------------------
// 6. EARLY ACCESS SIGNUP
// -------------------------
// File: components/EarlyAccess.tsx
// Simple email form with input + CTA button
// Hook to API (e.g., /api/join-waitlist)


// -------------------------
// 7. MAIN PAGE LAYOUT
// -------------------------
// File: pages/index.tsx
// Import each component in order:
// <Hero />
// <Features />
// <Demo />
// <EarlyAccess />


// -------------------------
// 8. STYLING NOTES
// -------------------------
// Use Tailwind classes for spacing, typography, and layout
// Theme: dark background (#0a0a23 or black), white/gray text, blue CTA buttons
// Fonts: Use system font or optionally Google Fonts (Inter, Satoshi)


// -------------------------
// 9. CTA BUTTONS
// -------------------------
// Reuse a button component with label "Get Early Access Now!"
// Use <Button variant="primary">Get Early Access Now!</Button>


// -------------------------
// 10. RESPONSIVE
// -------------------------
// Ensure all sections are mobile-first, stack on small screens
// Use Tailwind's responsive classes (sm:, md:, lg:)


// -------------------------
// FINAL CHECKLIST:
// -------------------------
// [ ] All components visually minimal and clean
// [ ] CTA buttons in every section scroll to EarlyAccess form
// [ ] Carousel working with demo screenshots
// [ ] Demo video plays smoothly
// [ ] Email form stores to Supabase or triggers API
// [ ] Works beautifully on mobile and desktop

// Let me know if you'd like a starter template for each component!
