'use client'
import { FaXTwitter, FaLinkedinIn, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";
import { FaPhone, FaRegEnvelope, FaRegClock, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import FooterLogo2 from "../../../public/insurance/logo2.png";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand info and socials */}
          <div className="md:col-span-1">
            <Link href="#" onClick={scrollToTop} className="flex items-center mb-4 cursor-pointer">
              <div className="relative w-48 sm:w-64 md:w-96 lg:w-[28rem] xl:w-[32rem] h-16 sm:h-20 md:h-28 lg:h-32 xl:h-36">
                <Image
                  src={FooterLogo2}
                  alt="Elite Finsols Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 12rem, (max-width: 768px) 16rem, (max-width: 1024px) 24rem, (max-width: 1280px) 28rem, 32rem"
                  priority
                />
              </div>
            </Link>
            <p className="mb-4">
              Empowering individuals and businesses with flexible loan solutions.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/r/1AdzMc8BCZ/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
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
                <span>Office No.303, Third Floor, Audumber Nivya, Narhe, Pune - 411041</span>
              </li>
              <li className="flex items-center">
                <FaPhone size={20} className="mr-2 flex-shrink-0 text-blue-400" />
                <span>+91 8308588867</span>
              </li>
              <li className="flex items-center">
                <FaPhone size={20} className="mr-2 flex-shrink-0 text-blue-400" />
                <span>+91 8669012275</span>
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
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="mb-4 md:mb-0">
              © {new Date().getFullYear()} Elite Finsols. All rights reserved
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="mb-4 md:mb-0">
            All logos and trademarks are the property of their respective owners. We are not affiliated with or endorsed by the banks shown.
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="mb-4 md:mb-0">
              Manage And Maintain By Delxn Technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
