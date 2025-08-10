"use client";
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Unique = () => {
  const { ref: containerRef, inView: containerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const benefits = [
    {
      id: 1,
      title: "Fast Approval",
      description: "Get loan approval within 24 hours",
      icon: "⚡",
    },
    {
      id: 2,
      title: "Low Interest Rates",
      description: "Competitive rates starting from 8.5%",
      icon: "💰",
    },
    {
      id: 3,
      title: "Flexible Repayment",
      description: "Customized repayment plans",
      icon: "🔄",
    },
    {
      id: 4,
      title: "No Hidden Fees",
      description: "Transparent pricing with no surprises",
      icon: "🔍",
    },
  ];

  return (
    <div className="w-full py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={containerRef} className="flex flex-col lg:flex-row gap-8">
          {/* Left Content Section - Natural height cards */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: containerInView ? 1 : 0, y: containerInView ? 0 : 20 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our Loan Services?
              </h2>
              <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6"></div>
              <p className="text-lg text-gray-600">
                We provide financial solutions tailored to your unique needs with
                competitive rates and exceptional service.
              </p>
            </motion.div>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: containerInView ? 1 : 0, x: containerInView ? 0 : -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 text-blue-600 rounded-lg p-2 text-xl">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Image Section - Perfectly sized */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: containerInView ? 1 : 0, scale: containerInView ? 1 : 0.95 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full lg:w-1/2 flex items-start"
          >
            <div className="relative w-full h-[620px] rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1604594849809-dfedbc827105?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Happy customer with loan approval"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-blue-600/20"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Unique;