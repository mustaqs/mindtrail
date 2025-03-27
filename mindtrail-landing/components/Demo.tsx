'use client';

import { useState, useRef } from 'react';

export default function Demo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section id="demo" className="py-20 bg-gradient-to-b from-[#0a1122] to-[#111827]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">See Mindtrail in Action</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Watch how Mindtrail helps you save, organize, and revisit your tabs with just a few clicks.
          </p>
        </div>

        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-800">
          <video 
            ref={videoRef}
            className="w-full"
            poster="/images/video-poster.jpg"
            onClick={togglePlay}
          >
            <source src="/video/mindtrail-demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <button 
            className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {!isPlaying && (
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
