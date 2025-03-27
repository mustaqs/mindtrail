'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1122]/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-bold text-white">
          Mindtrail is Live!
        </Link>
        
        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <a href="#features" className="text-sm text-white/80 hover:text-white transition-colors">
            Features
          </a>
          <a href="#demo" className="text-sm text-white/80 hover:text-white transition-colors">
            Demo
          </a>
          <a 
            href="#early-access" 
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Get Early Access
          </a>
        </nav>
      </div>
    </header>
  );
}
