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
      setStatusMessage(data.message || 'Thanks for joining the MindTrail newsletter! We\'ll keep you updated with the latest news and features.');
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
    <section id="early-access" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-lg p-10 shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated With Mindtrail</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our newsletter to receive updates, tips, and be the first to know about new features. 
              Never miss out on the latest Mindtrail developments!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {isSubmitting ? 'Submitting...' : 'Join Now'}
            </button>

            {submitStatus === 'success' && (
              <p className="mt-4 text-center text-green-600">
                {statusMessage}
              </p>
            )}

            {submitStatus === 'error' && (
              <p className="mt-4 text-center text-red-500">
                {statusMessage}
              </p>
            )}

            <p className="mt-6 text-center text-gray-500 text-sm">
              By joining our newsletter, you agree to receive emails from Mindtrail. We will never share your information with third parties.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
