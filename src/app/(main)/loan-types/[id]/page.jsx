"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FaArrowLeft, 
  FaCheckCircle, 
  FaStar, 
  FaShieldAlt, 
  FaClock, 
  FaFileAlt,
  FaHome,
  FaPercent,
  FaCalendarAlt,
  FaHandshake,
  FaTools,
  FaRocket,
  FaChartLine,
  FaBuilding,
  FaCalculator,
  FaHeadset,
  FaGraduationCap,
  FaGlobe,
  FaCar,
  FaBolt,
  FaCoins,
  FaLock,
  FaPiggyBank,
  FaWallet,
  FaBriefcase
} from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

const LoanTypeDetail = () => {
  const params = useParams();
  const router = useRouter();
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    loanType: "",
    loanAmount: "",
    message: ""
  });

  // Icon mapping
  const iconMap = {
    FaCheckCircle,
    FaStar,
    FaShieldAlt,
    FaClock,
    FaFileAlt,
    FaHome,
    FaPercent,
    FaCalendarAlt,
    FaHandshake,
    FaTools,
    FaRocket,
    FaChartLine,
    FaBuilding,
    FaCalculator,
    FaHeadset,
    FaGraduationCap,
    FaGlobe,
    FaCar,
    FaBolt,
    FaCoins,
    FaLock,
    FaPiggyBank,
    FaWallet,
    FaBriefcase
  };

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        // First try to get data from JSON file
        try {
          const response = await fetch('/data/loan-types.json');
          const data = await response.json();
          const loan = data.loanTypes.find(loan => loan.id === params.id);
          
          if (loan) {
            setLoanData(loan);
            setFormData(prev => ({ ...prev, loanType: loan.title }));
            setLoading(false);
            return;
          }
        } catch (jsonError) {
          console.log('JSON file not found, trying API...');
        }

        // If not found in JSON, try API
        const apiResponse = await fetch('/api/loan-types');
        const apiData = await apiResponse.json();
        
        if (apiData.success && apiData.data) {
          const loan = apiData.data.find(loan => 
            loan._id === params.id || 
            loan.title?.toLowerCase().replace(/\s+/g, '-') === params.id
          );
          
          if (loan) {
            setLoanData(loan);
            setFormData(prev => ({ ...prev, loanType: loan.title }));
          } else {
            toast.error("Loan type not found");
            router.push('/');
          }
        } else {
          toast.error("Error loading loan details");
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching loan data:', error);
        toast.error("Error loading loan details");
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLoanData();
    }
  }, [params.id, router]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.mobile) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      const response = await fetch('/api/form-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          insuranceType: formData.loanType // Using existing API structure
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Thank you! We'll get back to you soon.");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          loanType: loanData?.title || "",
          loanAmount: "",
          message: ""
        });
        setShowEnquiryForm(false);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Error submitting form. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!loanData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className={`${loanData.bgColor} py-16`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                {React.createElement(iconMap[loanData.icon], {
                  className: `${loanData.iconColor} text-6xl`
                })}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {loanData.title}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {loanData.subtitle}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {loanData.description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Features Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {loanData.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      {React.createElement(iconMap[feature.icon], {
                        className: `${feature.color} text-xl mt-1 flex-shrink-0`
                      })}
                      <p className="text-gray-700">{feature.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Types of Loan Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of {loanData.title}</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {loanData.typesOfLoan.map((type, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
                      <span className="text-gray-700">{type}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Loan Details Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-lg shadow-sm p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Details</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Loan Amount</h3>
                    <p className="text-blue-600 font-bold">{loanData.loanAmount.min}</p>
                    <p className="text-blue-600 font-bold">to {loanData.loanAmount.max}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Interest Rate</h3>
                    <p className="text-green-600 font-bold">{loanData.interestRate.min}</p>
                    <p className="text-green-600 font-bold">to {loanData.interestRate.max}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Tenure</h3>
                    <p className="text-purple-600 font-bold">{loanData.tenure.min}</p>
                    <p className="text-purple-600 font-bold">to {loanData.tenure.max}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Eligibility Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Eligibility</h3>
                <ul className="space-y-2">
                  {loanData.eligibility.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <FaCheckCircle className="text-green-500 text-sm mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Documents Required */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Documents Required</h3>
                <ul className="space-y-2">
                  {loanData.documents.map((doc, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <FaFileAlt className="text-blue-500 text-sm mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{doc}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanTypeDetail; 