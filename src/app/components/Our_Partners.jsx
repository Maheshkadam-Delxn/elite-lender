"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

const OurPartners = () => {
  const partners = [
    { id: 1, img: "/providers/axis-bank.png", name: "Axis Bank" },
    { id: 2, img: "/providers/indusind-bank.png", name: "IndusInd Bank" },
    { id: 3, img: "/providers/boi-bank.png", name: "Bank of India" },
    { id: 4, img: "/providers/kotak-mahindra-bank.png", name: "Kotak Mahindra Bank" },
    { id: 5, img: "/providers/federal-bank.png", name: "Federal Bank" },
    { id: 6, img: "/providers/hdfc-bank.png", name: "HDFC Bank" },
    { id: 7, img: "/providers/icici-bank.png", name: "ICICI Bank" },
    { id: 8, img: "/providers/sbi-bank.png", name: "SBI Bank" },
    { id: 9, img: "/providers/union-bank.png", name: "Union Bank" },
  ];

  const scrollContainerRef = useRef(null);
  const scrollSpeed = 1.5;

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationFrameId;
    let scrollPosition = 0;
    let paused = false;

    const scroll = () => {
      if (!paused && scrollContainer) {
        scrollPosition += scrollSpeed;
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Pause on hover
    const handleMouseEnter = () => (paused = true);
    const handleMouseLeave = () => (paused = false);

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="w-full py-12 sm:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-gray-900">
          Our Trusted Partners
        </h2>
        
        <div className="relative">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-hidden py-4 scrollbar-hide items-center"
          >
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 mx-3 px-2 py-1 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="relative w-32 h-16 sm:w-44 sm:h-22">
                  <Image
                    src={partner.img}
                    alt={partner.name}
                    fill
                    className="object-contain p-0" // Removed padding here
                    quality={100}
                    sizes="(max-width: 840px) 528px, (max-width: 868px) 576px"
                    onError={(e) => {
                      console.error(`Failed to load partner logo: ${partner.name}`);
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-12 px-4">
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto">
            Partnering with India's leading financial institutions to deliver exceptional services
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurPartners;