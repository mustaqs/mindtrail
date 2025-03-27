import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0a0d1a] py-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-white text-xl font-bold">
              Mindtrail
            </Link>
            <p className="text-white/50 text-sm mt-2">
              Your thinking companion for the web
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <Link 
              href="/privacy" 
              className="text-white/70 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <a 
              href="mailto:support@mindtrail.xyz" 
              className="text-white/70 hover:text-white transition-colors"
            >
              Support
            </a>
            <a 
              href="https://www.mindtrail.xyz" 
              className="text-white/70 hover:text-white transition-colors"
            >
              Website
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} Mindtrail. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
