'use client';

import { useState } from 'react';

export default function EarlyAccess() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatusMessage('Please enter a valid email address');
      setSubmitStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');
    
    try {
      const response = await fetch('/api/join-waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please try again later.');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setSubmitStatus('success');
      setStatusMessage(data.message || 'Thanks for signing up! Check your email soon for access instructions.');
      setEmail('');
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="early-access" className="py-20 bg-[#0a1122]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-[#111827] rounded-lg p-10 shadow-xl border border-gray-800">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Get Early Access to Mindtrail</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Be one of the first to experience the future of tab management. Sign up now 
              and get exclusive early access to Mindtrail!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-[#1a1f2e] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-500 text-white py-3 px-6 rounded-md font-medium transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Get Early Access'}
            </button>

            {submitStatus === 'success' && (
              <p className="mt-4 text-center text-green-400">
                {statusMessage}
              </p>
            )}

            {submitStatus === 'error' && (
              <p className="mt-4 text-center text-red-400">
                {statusMessage}
              </p>
            )}

            <p className="mt-4 text-xs text-center text-white/50">
              By signing up for early access, you agree to receive emails from Mindtrail. You 
              will receive an email with installation instructions shortly. We'll never share 
              your information with third parties.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
