'use client'
import { FaXTwitter, FaLinkedinIn, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";
import { FaPhone, FaRegEnvelope, FaRegClock, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import FooterLogo from "../../../public/insurance/logo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand info and socials */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src={FooterLogo}
                alt="Elite Finsoles Logo"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <h3 className="text-2xl font-bold text-blue-400">
                  Elite<span className="text-purple-400">Finsoles</span>
                </h3>
                <p className="text-gray-400 text-sm">Your Trusted Financial Partner</p>
              </div>
            </div>
            <p className="mb-4">
              Empowering individuals and businesses with flexible loan solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaXTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links and Products - side by side */}
          <div className="grid grid-cols-2 gap-8 md:col-span-1">
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                <li><Link href="/about-us" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Our Products</h4>
              <ul className="space-y-2">
                <li><Link href="/loan-types/personal" className="hover:text-blue-400 transition-colors">Personal Loan</Link></li>
                <li><Link href="/loan-types/home" className="hover:text-blue-400 transition-colors">Home Loan</Link></li>
                <li><Link href="/loan-types/business" className="hover:text-blue-400 transition-colors">Business Loan</Link></li>
                <li><Link href="/loan-types/education" className="hover:text-blue-400 transition-colors">Education Loan</Link></li>
                <li><Link href="/loan-types/vehicle" className="hover:text-blue-400 transition-colors">Vehicle Loan</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt size={20} className="mr-2 mt-1 flex-shrink-0 text-blue-400" />
                <span>123 Financial Street, Banking District, Mumbai - 400001</span>
              </li>
              <li className="flex items-center">
                <FaPhone size={20} className="mr-2 flex-shrink-0 text-blue-400" />
                <span>+91 9561113316</span>
              </li>
              <li className="flex items-center">
                <FaRegEnvelope size={20} className="mr-2 flex-shrink-0 text-blue-400" />
                <span>elite@finsoles.com</span>
              </li>
              <li className="flex items-center">
                <FaRegClock size={20} className="mr-2 flex-shrink-0 text-blue-400" />
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">
              © {new Date().getFullYear()} Elite Finsoles. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
