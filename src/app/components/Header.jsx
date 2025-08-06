"use client";
import React, { useState, useEffect, useRef } from "react";
import Logo from "../../../public/insurance/logo.png";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { IoIosArrowForward } from "react-icons/io";
import {
  FaHome,
  FaBriefcase,
  FaGraduationCap,
  FaCar,
  FaPiggyBank,
  FaUser,
} from "react-icons/fa";

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSubmenu = () => setIsSubmenuOpen(!isSubmenuOpen);

  // Product items data
  const products = [
    {
      href: "/loan-types/personal",
      label: "Personal Loan",
      icon: <FaUser className="mr-2 text-blue-600" size={18} />,
    },
    {
      href: "/loan-types/home",
      label: "Home Loan",
      icon: <FaHome className="mr-2 text-blue-600" size={18} />,
    },
    {
      href: "/loan-types/business",
      label: "Business Loan",
      icon: <FaBriefcase className="mr-2 text-blue-600" size={18} />,
    },
    {
      href: "/loan-types/education",
      label: "Education Loan",
      icon: <FaGraduationCap className="mr-2 text-blue-600" size={18} />,
    },
    {
      href: "/loan-types/vehicle",
      label: "Vehicle Loan",
      icon: <FaCar className="mr-2 text-blue-600" size={18} />,
    },
    {
      href: "/loan-types/gold",
      label: "Gold Loan",
      icon: <FaPiggyBank className="mr-2 text-blue-600" size={18} />,
    },
  ];

  // Close the menu if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        duration: 0.2,
        ease: [0.165, 0.84, 0.44, 1],
      },
    },
  };

  const handleCloseModal = () => setShowLoginModal(false);

  return (
    <header className="w-full sticky top-0 z-20 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] border-b border-gray-200">
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 md:p-10 rounded-lg shadow-lg flex flex-col items-start gap-6 w-full max-w-md"
          >
            <div className="w-full flex items-start justify-between">
              <div className="flex flex-col items-start gap-3">
                <h1 className="text-xl md:text-2xl font-semibold">Login to Elite Finsoles</h1>
                <hr className="w-48 md:w-64" />
              </div>
              <button className="text-red-500 text-xl font-extrabold" onClick={handleCloseModal}>
                <RxCross1 />
              </button>
            </div>
            <form className="w-full flex flex-col gap-4 items-end">
              <input
                placeholder="Enter Mobile Number"
                className="p-3 md:p-4 border border-slate-300 w-full rounded-lg outline-none"
              />
              <input
                type="submit"
                value="Login"
                className="p-3 md:p-4 bg-blue-700 text-white w-1/3 rounded-lg cursor-pointer"
              />
            </form>
          </motion.div>
        </div>
      )}

      <div className="container mx-auto px-4 py-2 md:py-3 flex items-center justify-between">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3"
        >
          <div className="relative w-12 h-12 md:w-16 md:h-16">
            <Image
              src={Logo}
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-xl md:text-2xl font-bold text-blue-800">Elite Finsoles</h1>
            <p className="text-xs md:text-sm text-gray-600">Turning Possibilities Into Realities</p>
          </div>
        </Link>

        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMenu}
          className="block lg:hidden text-black focus:outline-none p-2"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <RxCross1 className="text-2xl" />
          ) : (
            <RxHamburgerMenu className="text-2xl" />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/"
            className="relative py-2 text-black hover:text-blue-700 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-700 after:w-0 after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </Link>

          {/* Products Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
            ref={dropdownRef}
          >
            <button className="relative py-2 text-black hover:text-blue-700 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-700 after:w-0 after:transition-all after:duration-300 hover:after:w-full">
              Products
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="absolute top-full left-0 mt-1 bg-white shadow-lg border rounded-md py-2 w-56 z-10"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {products.map((product) => (
                    <Link
                      key={product.href}
                      href={product.href}
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-black hover:bg-gray-50 transition-colors text-sm"
                    >
                      <div className="flex items-center">
                        {product.icon}
                        {product.label}
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/about-us"
            className="relative py-2 text-black hover:text-blue-700 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-700 after:w-0 after:transition-all after:duration-300 hover:after:w-full"
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className="relative py-2 text-black hover:text-blue-700 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-700 after:w-0 after:transition-all after:duration-300 hover:after:w-full"
          >
            Contact Us
          </Link>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              className="fixed top-0 right-0 w-4/5 h-full bg-white shadow-2xl z-50 flex flex-col p-6 overflow-y-auto"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              transition={{ type: "tween" }}
            >
              <div className="flex justify-between items-center mb-8">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <div className="relative w-16 h-16">
                    <Image
                      src={Logo}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
                <button onClick={toggleMenu} className="text-2xl">
                  <RxCross1 />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 border-b border-gray-200"
                >
                  Home
                </Link>

                <div className="border-b border-gray-200">
                  <button
                    onClick={toggleSubmenu}
                    className="w-full flex justify-between items-center py-3"
                  >
                    <span>Products</span>
                    <IoIosArrowForward
                      className={`transition-transform ${isSubmenuOpen ? "rotate-90" : ""}`}
                    />
                  </button>
                  {isSubmenuOpen && (
                    <div className="pl-4 py-2 space-y-3">
                      {products.map((product) => (
                        <Link
                          key={product.href}
                          href={product.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block py-2 text-gray-700 hover:text-blue-600"
                        >
                          <div className="flex items-center">
                            {product.icon}
                            {product.label}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/about-us"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 border-b border-gray-200"
                >
                  About Us
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 border-b border-gray-200"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;