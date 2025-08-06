"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaUsers, FaHandshake, FaChartLine, FaHeadset, FaLightbulb, FaUserTie, FaGraduationCap, FaMicrophone, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const AboutUs = () => {
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true });
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true });
  const { ref: storyRef, inView: storyInView } = useInView({ triggerOnce: true });
  const { ref: featuresRef, inView: featuresInView } = useInView({ triggerOnce: true });

  const stats = [
    { icon: <FaUsers className="text-3xl lg:text-4xl" />, value: "500+", label: "Happy Clients", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: <FaHandshake className="text-3xl lg:text-4xl" />, value: "₹10Cr+", label: "Loans Processed", color: "text-green-600", bgColor: "bg-green-50" },
    { icon: <FaChartLine className="text-3xl lg:text-4xl" />, value: "5+", label: "Years Experience", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: <FaHeadset className="text-3xl lg:text-4xl" />, value: "24/7", label: "Support Available", color: "text-orange-600", bgColor: "bg-orange-50" }
  ];

  const features = [
    {
      icon: <FaLightbulb className="text-2xl lg:text-3xl" />,
      title: "Tailored Solutions",
      description: "Personalized loan solutions, debt management, and credit repair services designed for your unique needs.",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <FaUserTie className="text-2xl lg:text-3xl" />,
      title: "Expert Guidance",
      description: "Professional finance advisory, business coaching, and public speaking to empower your decisions.",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <FaChartLine className="text-2xl lg:text-3xl" />,
      title: "Financial Growth",
      description: "Helping individuals and businesses achieve financial freedom with sustainable strategies.",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: <FaHandshake className="text-2xl lg:text-3xl" />,
      title: "Trusted Partnership",
      description: "Leading financial consultancy firm based in Pune, India, committed to your success.",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, y: 50 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 lg:mb-8 leading-tight">
              Transforming Your
              <br />
              <span className="text-yellow-300 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Financial Journey
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8 lg:mb-10">
              Empowering individuals and businesses with innovative financial solutions, expert guidance, and personalized strategies for sustainable growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold text-base hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started Today
                <FaArrowRight className="ml-2" />
              </Link>
              <Link
                href="tel:+919561113316"
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-base hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Call Us Now
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        ref={statsRef}
        initial={{ opacity: 0, y: 50 }}
        animate={statsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Delivering exceptional results and building lasting relationships with our clients
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${stat.bgColor} rounded-xl p-6 lg:p-8 text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20`}
              >
                <div className={`${stat.color} mb-4 flex justify-center`}>
                  {stat.icon}
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 font-semibold text-base">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Our Story Section */}
      <motion.div
        ref={storyRef}
        initial={{ opacity: 0, y: 50 }}
        animate={storyInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
            <div className="text-center mb-10 lg:mb-12">
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4">
                Our Story
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                  I am the Founder and CEO of <span className="font-bold text-blue-600">Elite Finsoles</span>, a pioneering financial consultancy firm revolutionizing the financial landscape in Pune, India.
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-l-4 border-blue-600 shadow-lg">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3">
                    "Engineered Solutions for Your Financial Needs"
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    This philosophy drives our commitment to blending cutting-edge innovation with deeply personalized service.
                  </p>
                </div>

                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                  As a <span className="font-semibold text-green-600">Finance Advisor</span>, <span className="font-semibold text-purple-600">Business Coach</span>, and <span className="font-semibold text-orange-600">Public Speaker</span>, I'm passionate about empowering others to unlock their financial potential and achieve lasting success.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="w-48 h-48 lg:w-56 lg:h-56 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                    <div className="w-40 h-40 lg:w-48 lg:h-48 bg-white rounded-full flex items-center justify-center">
                      <FaGraduationCap className="text-5xl lg:text-6xl text-blue-600" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">★</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
                    Elite Finsoles
                  </h3>
                  <p className="text-gray-600 text-base">Pioneering Financial Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        ref={featuresRef}
        initial={{ opacity: 0, y: 50 }}
        animate={featuresInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              We combine expertise, innovation, and personalized service to deliver exceptional results
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${feature.bgColor} rounded-xl p-6 lg:p-8 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20`}
              >
                <div className={`${feature.color} mb-4 flex justify-center`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed text-sm lg:text-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 lg:p-12 text-center text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-8 left-8 w-24 h-24 bg-white rounded-full"></div>
              <div className="absolute bottom-8 right-8 w-20 h-20 bg-white rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Ready to Transform Your Financial Future?
              </h2>
              <p className="text-lg lg:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Let's connect and build your success story together
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold text-base hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started Today
                  <FaArrowRight className="ml-2" />
                </Link>
                <Link
                  href="tel:+919561113316"
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-base hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  Call Us Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;
