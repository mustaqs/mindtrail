'use client';

import Carousel from './Carousel';

export default function Hero() {
  return (
    <section className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900">Mindtrail</h1>
        <h2 className="text-xl md:text-2xl text-gray-700 mb-6">Your Thinking Companion for the Web</h2>
        
        <p className="text-gray-600 mb-6">
          Researching, learning, or building something new?
        </p>
        
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Mindtrail helps you save, organize, and recall your tabs — so you can think 
          clearly, work better, and never lose your place again.
        </p>
        
        <a
          href="https://chromewebstore.google.com/detail/mindtrail-smart-tab-manag/jdlkiaielmolhdlgohcmoajjhdclchoa"
          className="bg-blue-500 text-white px-6 py-3 rounded font-medium hover:bg-blue-600 transition-colors inline-block mb-8"
        >
          Get Mindtrail
        </a>
        
        <p className="text-gray-500 text-sm mb-12">The calm after the clickstorm.</p>
        
        {/* Carousel - Increased size */}
        <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 shadow-lg border border-gray-200">
          <Carousel />
        </div>
      </div>
    </section>
  );
}
