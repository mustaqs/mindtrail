'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-bold text-gray-800">
          Mindtrail is Live!
        </Link>
        
        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Features
          </a>
          <a href="#demo" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Demo
          </a>
          <a href="#reviews" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Reviews
          </a>
          <a 
            href="#early-access" 
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Join Early Access
          </a>
        </nav>
      </div>
    </header>
  );
}
