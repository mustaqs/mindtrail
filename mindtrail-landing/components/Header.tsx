'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-bold text-gray-800 text-sm sm:text-base">
          Mindtrail is Live!
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
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
            href="https://chromewebstore.google.com/detail/mindtrail-smart-tab-manag/jdlkiaielmolhdlgohcmoajjhdclchoa" 
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Get Mindtrail
          </a>
        </nav>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white border-b border-gray-200">
          <a 
            href="#features" 
            className="block py-2 text-base text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#demo" 
            className="block py-2 text-base text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            Demo
          </a>
          <a 
            href="#reviews" 
            className="block py-2 text-base text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            Reviews
          </a>
          <a 
            href="https://chromewebstore.google.com/detail/mindtrail-smart-tab-manag/jdlkiaielmolhdlgohcmoajjhdclchoa" 
            className="block py-2 px-3 text-center bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors mt-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            Get Mindtrail
          </a>
        </div>
      </div>
    </header>
  );
}
