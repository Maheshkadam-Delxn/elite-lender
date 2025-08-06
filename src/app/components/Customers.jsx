"use client";
import React, { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  { 
    name: "Rahul Jori", 
    text: "Elite Finsoles made my home loan process incredibly smooth! I got approved in just 48 hours with the best interest rate in the market.",
    loanType: "Home Loan"
  },
  { 
    name: "Neha Verma", 
    text: "I was struggling to get a business loan until I found Elite Finsoles. Their personalized approach and fast processing helped expand my business.",
    loanType: "Business Loan"
  },
  { 
    name: "Amit Gupta", 
    text: "Amazing service! I got my car loan approved with minimal documentation and the most competitive rates available.",
    loanType: "Car Loan"
  },
  { 
    name: "Priya Singh", 
    text: "Elite Finsoles's education loan helped fulfill my daughter's dream of studying abroad. Transparent terms and flexible repayment options.",
    loanType: "Education Loan"
  },
  { 
    name: "Rajesh Kumar", 
    text: "The personal loan process was so quick and hassle-free. Elite Finsoles truly understands customer needs.",
    loanType: "Personal Loan"
  },
  { 
    name: "Sneha Patel", 
    text: "Excellent service for my gold loan. Fast approval and competitive interest rates. Highly recommended!",
    loanType: "Gold Loan"
  },
];

const Customers = () => {
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollSpeed = 0.5; // Pixels per frame (reduced from 1 to 0.3 for slower scrolling)

  useEffect(() => {
    let animationId;
    let currentPosition = 0;

    const animate = () => {
      currentPosition += scrollSpeed;
      
      // Never reset - let it scroll infinitely
      // The multiple sets of testimonials will create the endless effect
      setScrollPosition(currentPosition);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [scrollSpeed]);

  // Create multiple sets of testimonials for seamless looping
  const testimonialSets = Array.from({ length: 5 }, (_, setIndex) => 
    testimonials.map((testimonial, index) => ({
      ...testimonial,
      key: `${setIndex}-${index}`
    }))
  ).flat();

  return (
    <div className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Content Section */}
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Clients Speak</h1>
            <p className="text-lg text-gray-700 mb-8">
              Elite Finsoles designs and delivers innovative financial solutions using 
              cutting-edge technologies as per industry standards. With a growing 
              presence across India, we offer the most competitive loan products 
              with transparent terms and fast approvals.
            </p>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Our Legacy</h3>
                <p className="text-gray-600">
                  Years of trust and thousands of satisfied customers across India
                </p>
              </div>
            </div>
          </div>

          {/* Right Testimonial Scroller */}
          <div className="lg:w-1/2 w-full">
            <div className="relative h-[400px] overflow-hidden">
              <div
                ref={containerRef}
                className="absolute w-full"
                style={{
                  transform: `translateY(-${scrollPosition}px)`
                }}
              >
                {testimonialSets.map((testimonial) => (
                  <div 
                    key={testimonial.key}
                    className="mb-6 last:mb-0"
                  >
                    <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start mb-4">
                        <Quote className="text-blue-500 h-5 w-5 mt-1 flex-shrink-0" />
                        <p className="text-gray-700 ml-3">{testimonial.text}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full border border-gray-400 mr-2"></div>
                        <div className="text-sm font-medium text-gray-900">
                          {testimonial.name}
                          <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {testimonial.loanType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;