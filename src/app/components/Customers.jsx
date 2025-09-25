"use client";
import React, { useEffect, useRef, useState } from "react";
import { Quote, Star, X, ChevronDown, Check } from "lucide-react";

const testimonials = [
  { 
    name: "Rahul Jori", 
    text: "Elite Finsols made my home loan process incredibly smooth! I got approved in just 48 hours with the best interest rate in the market.",
    loanType: "Home Loan",
    rating: 5
  },
  { 
    name: "Neha Verma", 
    text: "I was struggling to get a business loan until I found Elite Finsols. Their personalized approach and fast processing helped expand my business.",
    loanType: "Business Loan",
    rating: 5
  },
  { 
    name: "Amit Gupta", 
    text: "Amazing service! I got my car loan approved with minimal documentation and the most competitive rates available.",
    loanType: "Car Loan",
    rating: 4
  },
  { 
    name: "Priya Singh", 
    text: "Elite Finsols's education loan helped fulfill my daughter's dream of studying abroad. Transparent terms and flexible repayment options.",
    loanType: "Education Loan",
    rating: 4
  },
  { 
    name: "Rajesh Kumar", 
    text: "The personal loan process was so quick and hassle-free. Elite Finsols truly understands customer needs.",
    loanType: "Personal Loan",
    rating: 3
  },
  { 
    name: "Sneha Patel", 
    text: "Excellent service for my gold loan. Fast approval and competitive interest rates. Highly recommended!",
    loanType: "Gold Loan",
    rating: 3
  },
];

const Customers = () => {
  const containerRef = useRef(null);
  const positionRef = useRef(0);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    text: "",
    rating: 0,
    loanType: "",
    otherLoanType: "",
  });
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoanMenuOpen, setIsLoanMenuOpen] = useState(false);
  const contentRef = useRef(null);
  const [baseLoopHeight, setBaseLoopHeight] = useState(0);
  const scrollSpeed = 0.9; // pixels per frame
  const repeatCount = 2; // render two copies for seamless looping

  useEffect(() => {
    let animationId;
    let currentPosition = positionRef.current || 0;

    const animate = () => {
      currentPosition += scrollSpeed;
      if (baseLoopHeight > 0) {
        // Loop within one base set height for seamless scrolling
        const looped = currentPosition % baseLoopHeight;
        if (containerRef.current) {
          containerRef.current.style.transform = `translateY(-${looped}px)`;
        }
        positionRef.current = looped;
      } else {
        if (containerRef.current) {
          containerRef.current.style.transform = `translateY(-${currentPosition}px)`;
        }
        positionRef.current = currentPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [scrollSpeed, baseLoopHeight]);

  // Measure content height and compute base height for one set
  useEffect(() => {
    const measure = () => {
      if (contentRef.current) {
        const total = contentRef.current.scrollHeight;
        const base = repeatCount > 0 ? total / repeatCount : total;
        setBaseLoopHeight(base || 0);
        // Reset position after measurement to avoid jump
        positionRef.current = 0;
        if (containerRef.current) {
          containerRef.current.style.transform = 'translateY(0px)';
        }
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [repeatCount, userFeedbacks.length]);

  // Submit feedback
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedbackData.rating < 1 || feedbackData.rating > 5) {
      alert("Please select a rating between 1 and 5 stars");
      return;
    }
    if (!feedbackData.name.trim() || !feedbackData.text.trim()) {
      alert("Please fill in your name and feedback");
      return;
    }
    if (feedbackData.loanType === "Other" && !feedbackData.otherLoanType.trim()) {
      alert("Please specify the loan type when selecting 'Other'");
      return;
    }

    const resolvedLoanType = feedbackData.loanType === "Other"
      ? feedbackData.otherLoanType.trim()
      : feedbackData.loanType;

    const newFeedback = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: feedbackData.name.trim(),
      text: feedbackData.text.trim(),
      loanType: resolvedLoanType || "",
      rating: feedbackData.rating,
    };

    setUserFeedbacks((prev) => [...prev, newFeedback]);
    setFeedbackData({ name: "", text: "", rating: 0, loanType: "", otherLoanType: "" });
    setShowFeedbackForm(false);
  };

  // Rating click
  const handleStarClick = (rating) => {
    setFeedbackData((prev) => ({ ...prev, rating }));
  };

  // Handle loan type change and clear custom text when not Other
  const handleLoanTypeChange = (value) => {
    setFeedbackData((prev) => ({
      ...prev,
      loanType: value,
      otherLoanType: value === "Other" ? prev.otherLoanType : "",
    }));
  };

  // All testimonials combined
  const allTestimonials = [...testimonials, ...userFeedbacks];

  // Create multiple sets of testimonials for seamless looping
  const testimonialSets = Array.from({ length: repeatCount }, (_, setIndex) => 
    allTestimonials.map((testimonial, index) => ({
      ...testimonial,
      renderKey: `${setIndex}-${index}-${testimonial.id ?? ''}`
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
              Elite Finsols designs and delivers innovative financial solutions using 
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
                ref={(el) => { containerRef.current = el; contentRef.current = el; }}
                className="absolute w-full will-change-transform"
              >
                {testimonialSets.map((testimonial) => (
                  <div 
                    key={testimonial.renderKey}
                    className="mb-6 last:mb-0"
                  >
                    <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start mb-4">
                        <Quote className="text-blue-500 h-5 w-5 mt-1 flex-shrink-0" />
                        <p className="text-gray-700 ml-3">{testimonial.text}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full border border-gray-400 mr-2"></div>
                          <div className="text-sm font-medium text-gray-900">
                            {testimonial.name}
                            {testimonial.loanType && (
                              <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                {testimonial.loanType}
                              </span>
                            )}
                          </div>
                        </div>
                        {testimonial.rating ? (
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowFeedbackForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Share Your Experience
          </button>
        </div>

        {/* Feedback Form Modal */}
        {showFeedbackForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Share Your Feedback</h3>
                <button
                  onClick={() => setShowFeedbackForm(false)}
                  className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Your Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={feedbackData.name}
                    onChange={(e) => setFeedbackData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Rating <span className="text-red-500">*</span> (1 - 5)</label>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleStarClick(i + 1)}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                        aria-label={`Set rating ${i + 1}`}
                      >
                        <Star
                          className={`h-8 w-8 ${i < (hoverRating || feedbackData.rating) ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-yellow-300"}`}
                        />
                      </button>
                    ))}
                  </div>
                  {feedbackData.rating > 0 && (
                    <p className="text-sm text-gray-600 mt-1">{feedbackData.rating} star{feedbackData.rating !== 1 ? "s" : ""} selected</p>
                  )}
                </div>

                {/* Loan Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Loan Type</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsLoanMenuOpen((v) => !v)}
                      className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <span className={`truncate ${feedbackData.loanType ? 'text-gray-900' : 'text-gray-400'}`}>
                        {feedbackData.loanType || 'Select loan type (optional)'}
                      </span>
                      <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isLoanMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isLoanMenuOpen && (
                      <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                        {['Home Loan','Business Loan','Car Loan','Education Loan','Personal Loan','Gold Loan','Other',''].map((opt) => (
                          <button
                            key={opt || 'none'}
                            type="button"
                            onClick={() => { handleLoanTypeChange(opt); setIsLoanMenuOpen(false); }}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${feedbackData.loanType === opt ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`${opt ? 'text-gray-900' : 'text-gray-400'}`}>{opt || 'None'}</span>
                              {feedbackData.loanType === opt && <Check className="h-4 w-4 text-blue-600" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {feedbackData.loanType === "Other" && (
                    <input
                      type="text"
                      value={feedbackData.otherLoanType}
                      onChange={(e) => setFeedbackData((p) => ({ ...p, otherLoanType: e.target.value }))}
                      className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                      placeholder="Please specify loan type"
                    />
                  )}
                </div>

                {/* Feedback */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Your Feedback <span className="text-red-500">*</span></label>
                  <textarea
                    value={feedbackData.text}
                    onChange={(e) => setFeedbackData((p) => ({ ...p, text: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                    rows={4}
                    placeholder="Tell us about your experience..."
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;