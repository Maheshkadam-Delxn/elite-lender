"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaUser, 
  FaBuilding,
  FaArrowRight,
  FaWhatsapp,
  FaLinkedin,
  FaFacebook,
  FaInstagram
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const Contact = () => {
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true });
  const { ref: formRef, inView: formInView } = useInView({ triggerOnce: true });
  const { ref: infoRef, inView: infoInView } = useInView({ triggerOnce: true });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Thank you! Your message has been sent successfully.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "",
          message: ""
        });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaPhone className="text-2xl" />,
      title: "Phone",
      value: "+91 9561113316",
      link: "tel:+919561113316",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: "Email",
              value: "el@elitefinsoles.com",
              link: "mailto:el@elitefinsoles.com",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
         {
       icon: <FaMapMarkerAlt className="text-2xl" />,
       title: "Address",
       value: "Pune, Maharashtra, India",
       link: "https://maps.app.goo.gl/mx6aUSib4fSMzKRi9",
       color: "text-purple-600",
       bgColor: "bg-purple-50"
     },
    {
      icon: <FaClock className="text-2xl" />,
      title: "Business Hours",
      value: "Mon - Fri: 9:00 AM - 6:00 PM",
      link: "#",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const socialLinks = [
    {
      icon: <FaWhatsapp className="text-xl" />,
      name: "WhatsApp",
      link: "https://wa.me/919561113316",
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100"
    },
    {
      icon: <FaLinkedin className="text-xl" />,
      name: "LinkedIn",
      link: "#",
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100"
    },
    {
      icon: <FaFacebook className="text-xl" />,
      name: "Facebook",
      link: "#",
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100"
    },
    {
      icon: <FaInstagram className="text-xl" />,
      name: "Instagram",
      link: "#",
      color: "text-pink-600",
      bgColor: "bg-pink-50 hover:bg-pink-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Toaster />
      
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, y: 50 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative py-12 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Get in Touch with
            <span className="text-blue-600"> Elite Finsoles</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Ready to transform your financial future? Let's connect and discuss how we can help you achieve your goals.
          </p>
          <button
            onClick={() => {
              document.getElementById('contact-form')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            Contact Us
            <FaArrowRight />
          </button>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mt-8"></div>
        </div>
      </motion.div>

      {/* Contact Form & Info Section */}
      <div className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Left Column - Contact Form & Follow Us */}
            <div className="space-y-6">
              {/* Contact Form */}
              <motion.div
                ref={formRef}
                id="contact-form"
                initial={{ opacity: 0, x: -50 }}
                animate={formInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-2xl shadow-xl p-6 lg:p-8"
              >
                <div className="mb-6">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Tell us more about your requirements..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-base hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message
                        <FaArrowRight />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>

              {/* Follow Us Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-8 lg:p-12"
              >
                <div className="mb-8">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                    Follow Us
                  </h2>
                  <p className="text-gray-600">
                    Stay connected with us on social media.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={formInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                      className={`${social.bgColor} ${social.color} p-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3`}
                    >
                      {social.icon}
                      <span className="font-semibold">{social.name}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Contact Information & Immediate Assistance */}
            <div className="space-y-6">
              {/* Contact Information */}
              <motion.div
                ref={infoRef}
                initial={{ opacity: 0, x: 50 }}
                animate={infoInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-2xl shadow-xl p-8 lg:p-12"
              >
                <div className="mb-8">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                    Contact Information
                  </h2>
                  <p className="text-gray-600">
                    Reach out to us through any of these channels.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.a
                      key={index}
                      href={info.link}
                      initial={{ opacity: 0, y: 20 }}
                      animate={infoInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`${info.bgColor} ${info.color} p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-4`}
                    >
                      <div className="flex-shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {info.title}
                        </h3>
                        <p className="text-gray-600">
                          {info.value}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Need Immediate Assistance */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={infoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 lg:p-12 text-white"
              >
                <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                  Need Immediate Assistance?
                </h2>
                <p className="text-blue-100 mb-6">
                  Call us directly for urgent inquiries or immediate support.
                </p>
                <a
                  href="tel:+919561113316"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <FaPhone className="mr-2" />
                  Call Now: +91 9561113316
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Contact;
