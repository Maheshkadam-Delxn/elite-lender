'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaStar, FaShieldAlt, FaClock, FaHandshake, FaHeart, FaLeaf, FaRocket, FaLightbulb, FaTrophy, FaAward, FaGem, FaCrown, FaDiamond, FaMedal } from 'react-icons/fa';

const iconMap = {
  FaCheckCircle,
  FaStar,
  FaShieldAlt,
  FaClock,
  FaHandshake,
  FaHeart,
  FaLeaf,
  FaRocket,
  FaLightbulb,
  FaTrophy,
  FaAward,
  FaGem,
  FaCrown,
  FaDiamond,
  FaMedal
};

const LoanTypeDetail = ({ loan, isOpen, onClose }) => {
  if (!loan) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${loan.bgColor}`}>
                  {loan.icon && typeof loan.icon === 'object' ? (
                    loan.icon
                  ) : (
                    <div className={`text-2xl ${loan.iconColor}`}>
                      {loan.icon}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{loan.title}</h2>
                  {loan.subtitle && (
                    <p className="text-lg text-gray-600">{loan.subtitle}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600">{loan.description}</p>
              </div>

              {/* Types of Loan */}
              {loan.typesOfLoan && loan.typesOfLoan.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Types of Loan</h3>
                  <div className="flex flex-wrap gap-2">
                    {loan.typesOfLoan.map((type, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {loan.features && loan.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Features</h3>
                  <div className="grid gap-3">
                    {loan.features.map((feature, index) => {
                      const IconComponent = iconMap[feature.icon];
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          {IconComponent && (
                            <IconComponent className={`text-lg ${feature.color}`} />
                          )}
                          <span className="text-gray-700">{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Contact/Apply Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  onClick={() => {
                    // Add your application logic here
                    alert('Application form will open here');
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoanTypeDetail; 