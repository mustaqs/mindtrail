'use client';

import { useState, useRef } from 'react';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper } from 'swiper';
import Image from 'next/image';
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
    <div className="relative max-w-4xl mx-auto">
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
          setActiveIndex(swiper.realIndex);
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="mb-8"
      >
        {screenshots.map((screenshot, index) => (
          <SwiperSlide key={index}>
            <div className="relative flex justify-center">
              <Image 
                src={screenshot.image} 
                alt={`Mindtrail screenshot ${index + 1}`} 
                width={500}
                height={350}
                className="rounded-lg shadow-lg border border-gray-800 max-h-[500px] w-auto object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </SwiperComponent>

      <div className="flex justify-center items-center mb-8">
        <button 
          className="carousel-prev bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 hover:bg-blue-600 transition-colors"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <p className="text-gray-900 text-center text-lg font-bold max-w-2xl">
          {screenshots[activeIndex].caption}
        </p>
        
        <button 
          className="carousel-next bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center ml-4 hover:bg-blue-600 transition-colors"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
