'use client';

import { useState, useRef } from 'react';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Carousel() {
  // Use the existing screenshot images with their captions
  const screenshots = [
    {
      image: "/images/screenshot1.png",
      caption: "Welcome to Mindtrail - Your Thinking Companion"
    },
    {
      image: "/images/screenshot2.png",
      caption: "Add a quick note to remember why it mattered."
    },
    {
      image: "/images/screenshot3.png",
      caption: "Save only the tabs that matter - in one click."
    },
    {
      image: "/images/screenshot4.png",
      caption: "See all your saved sessions — clean and searchable."
    },
    {
      image: "/images/screenshot5.png",
      caption: "Reopen exactly where you left off — instantly."
    }
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<Swiper | null>(null);

  return (
    <div className="relative">
      <SwiperComponent
        modules={[Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        navigation={{
          prevEl: '.carousel-prev',
          nextEl: '.carousel-next'
        }}
        onSlideChange={(swiper) => {
          // When using loop mode, we need to handle the real index
          const realIndex = swiper.realIndex;
          setActiveIndex(realIndex);
        }}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        className="rounded-md overflow-hidden"
      >
        {screenshots.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="aspect-video relative">
              <img
                src={item.image}
                alt={`Mindtrail Screenshot ${i + 1}`}
                className="w-full h-full object-contain"
                style={{ maxHeight: '500px' }}
              />
            </div>
            <p className="text-center text-white/80 text-sm mt-4 mb-2">{item.caption}</p>
          </SwiperSlide>
        ))}
      </SwiperComponent>
      
      {/* Custom Navigation - Larger touch targets for mobile */}
      <button className="carousel-prev absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white w-10 h-10 flex items-center justify-center rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button className="carousel-next absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white w-10 h-10 flex items-center justify-center rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      
      {/* Custom Pagination that highlights based on activeIndex */}
      <div className="flex justify-center mt-4 space-x-3">
        {screenshots.map((_, index) => (
          <button 
            key={index}
            onClick={() => {
              if (swiperRef.current) {
                swiperRef.current.slideToLoop(index);
              }
            }}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === activeIndex ? 'bg-blue-500' : 'bg-gray-500/50 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
