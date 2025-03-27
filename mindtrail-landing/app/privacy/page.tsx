import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#0a1122] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-[#111827] rounded-lg p-8 md:p-10 shadow-xl border border-gray-800">
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-white/70 mb-4">Effective Date: March 26, 2025</p>
          
          <p className="text-white/70 mb-6">
            At Mindtrail, your privacy is important to us. This Privacy Policy explains what data we collect, how we use it, and your rights in relation to that data.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Information We Collect</h2>
          <p className="text-white/70 mb-4">
            Mindtrail is a Chrome extension that helps users save, organize, and revisit browser tabs. We may collect the following types of data:
          </p>
          
          <h3 className="text-xl font-bold text-white mt-6 mb-2">1. Extension Usage Data</h3>
          <ul className="list-disc pl-6 text-white/70 mb-4">
            <li>Tab title, URL, and favicon (only when you choose to save a session)</li>
            <li>Session notes you optionally add</li>
            <li>Timestamps of when sessions are saved</li>
          </ul>
          
          <h3 className="text-xl font-bold text-white mt-6 mb-2">2. Browser Permissions</h3>
          <p className="text-white/70 mb-6">
            We request access to your open tabs only when you activate the extension to save them. We do not track your browsing history, background activity, or personal data unless you choose to save a tab/session.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">How We Use Your Data</h2>
          <p className="text-white/70 mb-2">We use the data you choose to save to:</p>
          <ul className="list-disc pl-6 text-white/70 mb-4">
            <li>Display your saved sessions in the dashboard</li>
            <li>Help you organize, revisit, and reopen tabs</li>
            <li>(In future releases) Provide AI-powered summaries and search features</li>
          </ul>
          <p className="text-white/70 mb-6">We do not sell, share, or monetize your data.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Optional Account Features (If Applicable)</h2>
          <p className="text-white/70 mb-2">If you choose to log in or create an account in the future:</p>
          <ul className="list-disc pl-6 text-white/70 mb-6">
            <li>Your saved data may be synced to a secure cloud database (e.g. Supabase)</li>
            <li>Your email address will only be used for account functionality or product updates (with your permission)</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">AI Features (Coming Soon)</h2>
          <p className="text-white/70 mb-2">If you opt into AI features:</p>
          <ul className="list-disc pl-6 text-white/70 mb-6">
            <li>We may send tab content (e.g. titles or snippets) to an AI API (such as OpenAI or Hugging Face) for summarization or semantic search</li>
            <li>These APIs do not store your data and are used only to generate helpful responses</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">What We Don&apos;t Do</h2>
          <ul className="list-disc pl-6 text-white/70 mb-6">
            <li>We do not track your browsing behavior</li>
            <li>We do not run in the background</li>
            <li>We do not collect passwords, credit card data, or personal account info</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Us</h2>
          <p className="text-white/70 mb-2">If you have any questions about this Privacy Policy, feel free to reach out:</p>
          <ul className="list-disc pl-6 text-white/70 mb-6">
            <li>Email: <a href="mailto:support@mindtrail.xyz" className="text-blue-400 hover:underline">support@mindtrail.xyz</a></li>
            <li>Website: <a href="https://www.mindtrail.xyz" className="text-blue-400 hover:underline">https://www.mindtrail.xyz</a></li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Updates to This Policy</h2>
          <p className="text-white/70">
            This policy may be updated from time to time. We&apos;ll notify you via the landing page or extension update notes.
          </p>
        </div>
      </div>
    </div>
  );
}
