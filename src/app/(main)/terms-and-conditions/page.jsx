import React from "react";
import Image from "next/image";
import { FaGavel, FaFileContract, FaShieldAlt, FaUserCheck, FaHandshake, FaLock, FaExclamationTriangle, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";

const page = () => {
  return (
    <div className="w-full h-auto flex flex-col lg:gap-10 phone:gap-5 p-5">
      {/* Hero Section */}
      <div className="w-full h-56 bg-black p-6 relative">
        <Image 
          src="https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          layout="fill" 
          objectFit="cover" 
          alt="terms-and-conditions" 
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 flex items-center pl-16 text-white">
          <div>
            <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
            <p className="text-gray-200">Please read these terms carefully before using our services</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start text-base bg-white tablet:p-6 shadow-md border border-gray-200 rounded-3xl lg:p-8 phone:p-6 text-gray-700 space-y-6 leading-relaxed">
        
        {/* Introduction */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 lg:p-8 rounded-xl phone:p-6 tablet:p-6">
          <div className="flex items-center mb-4">
            <FaGavel className="text-blue-600 text-2xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Agreement Overview</h2>
          </div>
          <p className="text-gray-700 text-base leading-relaxed text-justify">
            Welcome to <strong>Elite Finsoles</strong>. These Terms and Conditions govern your use of our loan services, website, and any related applications. By accessing or using our services, you agree to be bound by these terms. If you do not agree with any part of these terms, please do not use our services.
          </p>
        </div>

        {/* Service Description */}
        <div className="lg:px-4 lg:py-6 phone:px-2 phone:py-3">
          <div className="flex items-center mb-4">
            <FaFileContract className="text-green-600 text-xl mr-3" />
            <h1 className="lg:text-2xl font-semibold phone:text-lg text-gray-800">
              1. Description of Services
            </h1>
          </div>
          <p className="text-justify leading-relaxed text-gray-700">
            Elite Finsoles provides comprehensive loan services including personal loans, home loans, business loans, education loans, vehicle loans, and gold loans. Our services include loan application processing, credit assessment, loan disbursement, and ongoing account management.
          </p>

          <p className="text-justify leading-relaxed text-gray-700 mt-4">
            By using our platform and providing your personal/contact details, you acknowledge your interest in exploring and applying for loan products. You consent to being contacted by Elite Finsoles via electronic communication or phone to discuss your loan application, provide assistance, send payment reminders, and fulfill your requests.
          </p>
        </div>

        {/* License and Access */}
        <div className="lg:px-4 lg:py-6 phone:px-2 phone:py-3">
          <div className="flex items-center mb-4">
            <FaShieldAlt className="text-purple-600 text-xl mr-3" />
            <h1 className="lg:text-2xl font-semibold phone:text-lg text-gray-800">
              2. License and Platform Access
            </h1>
          </div>
          <p className="text-justify leading-relaxed text-gray-700">
            Elite Finsoles grants you a limited license to access and use our platform and loan services for personal purposes only. This license strictly prohibits downloading or copying any information for the benefit of another individual, vendor, or third party.
          </p>

          <p className="text-justify leading-relaxed text-gray-700 mt-4">
            By using our platform, you agree that you will not:
          </p>

          <ul className="list-disc list-inside mt-4 text-gray-700 text-lg leading-relaxed">
            <li>Use our platform or its content for any commercial purpose without authorization.</li>
            <li>Engage in speculative, false, or fraudulent loan applications.</li>
            <li>Access, monitor, or copy any content using automated tools without permission.</li>
            <li>Violate any security measures designed to limit access to our platform.</li>
            <li>Take any action that places an unreasonable load on our infrastructure.</li>
          </ul>
        </div>

        {/* Eligibility */}
        <div className="lg:px-4 lg:py-6 phone:px-2 phone:py-3">
          <div className="flex items-center mb-4">
            <FaUserCheck className="text-green-600 text-xl mr-3" />
            <h1 className="lg:text-2xl font-semibold phone:text-lg text-gray-800">
              3. Eligibility
            </h1>
          </div>
          <p className="text-justify leading-relaxed text-gray-700">
            Our loan services are not available to individuals under the age of 18 or to users who have been suspended or removed from our system by Elite Finsoles for any reason. Each user is allowed to maintain only one active account, and the sale, transfer, or exchange of accounts to any third party is strictly prohibited.
          </p>
        </div>

        {/* Account Management */}
        <div className="lg:px-4 lg:py-6 phone:px-2 phone:py-3">
          <div className="flex items-center mb-4">
            <FaHandshake className="text-blue-600 text-xl mr-3" />
            <h1 className="lg:text-2xl font-semibold phone:text-lg text-gray-800">
              4. Your Account
            </h1>
          </div>
          <p className="text-justify leading-relaxed text-gray-700">
            By using our platform, you confirm that you are of legal age to enter into a binding contract and are not restricted from receiving services under the laws of India or any other applicable jurisdiction. You agree to use our platform solely for making legitimate loan applications for yourself or on behalf of another person for whom you are legally authorized to act.
          </p>

          <p className="text-justify leading-relaxed text-gray-700 mt-4">
            You also agree to provide true, accurate, current, and complete information as requested by our platform. If any information provided is found to be false, inaccurate, outdated, or incomplete, Elite Finsoles reserves the right to suspend or terminate your account.
          </p>
        </div>

        {/* Loan Terms */}
        <div className="lg:px-4 lg:py-6 phone:px-2 phone:py-3">
          <div className="flex items-center mb-4">
            <FaMoneyBillWave className="text-green-600 text-xl mr-3" />
            <h1 className="lg:text-2xl font-semibold phone:text-lg text-gray-800">
              5. Loan Terms and Conditions
            </h1>
          </div>
          <p className="text-justify leading-relaxed text-gray-700">
            All loan applications are subject to approval based on our credit assessment criteria. Elite Finsoles reserves the right to approve, reject, or modify any loan application at its sole discretion. Loan terms, including interest rates, repayment schedules, and fees, will be clearly communicated to you upon approval.
          </p>

          <p className="text-justify leading-relaxed text-gray-700 mt-4">
            You agree to repay the loan amount along with applicable interest and charges according to the agreed-upon schedule. Failure to make timely payments may result in additional charges, late fees, and potential legal action.
          </p>

          <div className="bg-yellow-50 p-4 rounded-lg mt-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Please ensure you understand all loan terms before accepting any loan offer. Contact our customer service team if you have any questions about your loan agreement.
            </p>
          </div>
        </div>

        {/* Privacy and Security */}
        <div className="lg:px-4 lg:py-6 phone:px-2 phone:py-3">
          <div className="flex items-center mb-4">
            <FaLock className="text-purple-600 text-xl mr-3" />
            <h1 className="lg:text-2xl font-semibold phone:text-lg text-gray-800">
              6. Privacy and Data Security
            </h1>
          </div>
          <p className="text-justify leading-relaxed text-gray-700">
            Elite Finsoles is committed to protecting your privacy and maintaining the security of your personal and financial information. We collect, use, and store your information in accordance with our Privacy Policy, which is incorporated into these Terms and Conditions by reference.
          </p>

          <p className="text-justify leading-relaxed text-gray-700 mt-4">
            You agree to provide accurate and complete information during the loan application process. Elite Finsoles may verify the information you provide through various means, including credit checks, employment verification, and document validation.
          </p>
        </div>

        {/* Disclaimers */}
        <div className="lg:px-4 lg:py-6 phone:px-2 phone:py-3">
          <div className="flex items-center mb-4">
            <FaExclamationTriangle className="text-orange-600 text-xl mr-3" />
            <h1 className="lg:text-2xl font-semibold phone:text-lg text-gray-800">
              7. Disclaimers and Limitations
            </h1>
          </div>
          <p className="text-justify leading-relaxed text-gray-700">
            Elite Finsoles provides loan services "as is" and "as available" without any warranties, express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free. Elite Finsoles is not responsible for any delays, failures, or other problems arising from factors beyond our control.
          </p>

          <p className="text-justify leading-relaxed text-gray-700 mt-4">
            Elite Finsoles's liability is limited to the maximum extent permitted by law. In no event shall Elite Finsoles be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 lg:p-8 rounded-xl phone:p-6 tablet:p-6">
          <div className="flex items-center mb-4">
            <FaCheckCircle className="text-green-600 text-xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
          </div>
          <p className="text-gray-700 text-base leading-relaxed mb-4 text-justify">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Elite Finsoles</h3>
              <p className="text-gray-600 text-sm">3rd Floor, Plot No.264/265, Vaswani Chamber,<br/>
              Dr.Annie Besant Road, Worli Colony, Mumbai-400018</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Contact Details</h3>
              <p className="text-gray-600 text-sm">Email: legal@elitefinsoles.com<br/>
              Phone: +91 9561113316</p>
            </div>
          </div>
        </div>

        {/* Updates */}
        <div className="bg-white lg:p-8 rounded-xl shadow-lg phone:p-6 tablet:p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Terms Updates</h2>
          <p className="text-gray-700 text-base leading-relaxed mb-4 text-justify">
            These Terms and Conditions may be updated periodically to reflect changes in our services or applicable laws. We will notify you of any material changes through our website or direct communication. Your continued use of our services after such changes constitutes acceptance of the updated terms.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Last Updated:</strong> December 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page; 