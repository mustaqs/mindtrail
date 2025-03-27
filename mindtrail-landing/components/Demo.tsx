'use client';

import { useRef, useState } from 'react';

export default function Demo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
    <section id="demo" className="py-20 bg-[#0a1122]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">See Mindtrail in Action</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Watch how Mindtrail helps you organize your browser tabs and boost your productivity.
          </p>
        </div>

        <div className="bg-[#111827] rounded-lg p-6 shadow-xl border border-gray-800 overflow-hidden">
          <div className="relative aspect-video rounded-md overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster="/images/screenshot1.png"
              controls
              preload="metadata"
            >
              <source src="/video/mindtrail-demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href="#early-access"
            className="bg-blue-500 text-white px-6 py-3 rounded font-medium hover:bg-blue-600 transition-colors inline-block"
          >
            Get Early Access
          </a>
        </div>
      </div>
    </section>
  );
}
