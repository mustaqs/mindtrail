import Link from 'next/link';
import { FaXTwitter, FaInstagram } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 sm:py-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center md:text-left md:flex-row md:justify-between md:items-start">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-gray-900 text-xl font-bold">
              Mindtrail
            </Link>
            <p className="text-gray-500 text-sm mt-2">
              Your thinking companion for the web
            </p>
          </div>
          
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8">
            <Link 
              href="/privacy" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </Link>
            <a 
              href="mailto:support@mindtrail.xyz" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Support
            </a>
            <a 
              href="https://www.mindtrail.xyz" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Website
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col items-center">
          {/* Social Links */}
          <div className="flex space-x-6 mb-4">
            <a 
              href="https://x.com/Mindtrailhq" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Follow us on X (Twitter)"
            >
              <FaXTwitter className="h-5 w-5" />
            </a>
            <a 
              href="https://instagram.com/mindtrailhq" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Follow us on Instagram"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
          </div>
          
          <p className="text-center text-gray-500 text-sm">
            {new Date().getFullYear()} Mindtrail. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
