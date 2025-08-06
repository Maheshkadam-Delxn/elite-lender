import React from "react";
import Image from "next/image";
import { FaShieldAlt, FaLock, FaEye, FaHandshake, FaUserCheck, FaFileContract } from "react-icons/fa";

const Page = () => {
  return (
    <div className="w-full h-auto flex flex-col lg:gap-10 phone:gap-5 p-5">
      {/* Hero Section */}
      <div className="w-full h-56 bg-black p-6 relative">
        <Image 
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
          layout="fill" 
          objectFit="cover" 
          alt="privacy-policy" 
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 flex items-center pl-16 text-white">
          <div>
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-gray-200">Your privacy and data security are our top priorities</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start text-base bg-white tablet:p-6 shadow-md border border-gray-200 rounded-3xl lg:p-8 phone:p-6 text-gray-700 space-y-6 leading-relaxed">
        {/* Introduction Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 lg:p-8 rounded-xl phone:p-6 tablet:p-6">
          <div className="flex items-center mb-4">
            <FaShieldAlt className="text-blue-600 text-2xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Privacy Commitment</h2>
          </div>
          <p className="text-gray-700 text-base leading-relaxed text-justify">
            <strong>Elite Finsoles</strong> is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our loan services, or interact with our platform. By using our services, you consent to the data practices described in this policy.
          </p>
        </div>

        {/* Information Collection */}
        <div className="lg:px-4 lg:py-6 phone:px-2 phone:py-3">
          <div className="flex items-center mb-4">
            <FaUserCheck className="text-green-600 text-xl mr-3" />
            <h2 className="lg:text-2xl font-semibold phone:text-lg text-gray-800">Information We Collect</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Name, address, and contact details</li>
                <li>Employment and income information</li>
                <li>Bank account and financial details</li>
                <li>Identity verification documents</li>
                <li>Credit history and score information</li>
                <li>Loan application and transaction data</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Cookies and tracking data</li>
                <li>Location data (with consent)</li>
                <li>Communication preferences</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="lg:px-4 lg:py-6 phone:px-2 phone:py-3">
          <div className="flex items-center mb-4">
            <FaHandshake className="text-purple-600 text-xl mr-3" />
            <h2 className="lg:text-2xl font-semibold phone:text-lg text-gray-800">How We Use Your Information</h2>
          </div>
          <p className="text-gray-700 text-base leading-relaxed mb-4 text-justify">
            We use the collected information for the following purposes:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Loan Processing</h4>
                <p className="text-sm text-gray-700">Evaluate loan applications, verify eligibility, and process loan disbursements</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Customer Service</h4>
                <p className="text-sm text-gray-700">Provide support, respond to inquiries, and maintain account relationships</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Risk Assessment</h4>
                <p className="text-sm text-gray-700">Conduct credit checks, assess financial capacity, and manage loan risks</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Legal Compliance</h4>
                <p className="text-sm text-gray-700">Meet regulatory requirements, prevent fraud, and ensure legal compliance</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-2">Service Improvement</h4>
                <p className="text-sm text-gray-700">Enhance our services, develop new products, and improve user experience</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <h4 className="font-semibold text-teal-800 mb-2">Communication</h4>
                <p className="text-sm text-gray-700">Send important updates, payment reminders, and relevant offers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Sharing */}
        <div className="lg:px-4 lg:py-6 phone:px-2 phone:py-3">
          <div className="flex items-center mb-4">
            <FaFileContract className="text-red-600 text-xl mr-3" />
            <h2 className="lg:text-2xl font-semibold phone:text-lg text-gray-800">Information Sharing</h2>
          </div>
          <p className="text-gray-700 text-base leading-relaxed mb-4 text-justify">
            We may share your information with the following parties:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>Credit Bureaus:</strong> To report loan performance and obtain credit information</li>
            <li><strong>Financial Institutions:</strong> For loan processing, verification, and regulatory compliance</li>
            <li><strong>Service Providers:</strong> For payment processing, document verification, and technical support</li>
            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights and safety</li>
            <li><strong>Business Partners:</strong> With your consent for specific services or offers</li>
          </ul>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> We will never sell your personal information to third parties for marketing purposes without your explicit consent.
            </p>
          </div>
        </div>

        {/* Data Security */}
        <div className="lg:px-4 lg:py-6 phone:px-2 phone:py-3">
          <div className="flex items-center mb-4">
            <FaLock className="text-green-600 text-xl mr-3" />
            <h2 className="lg:text-2xl font-semibold phone:text-lg text-gray-800">Data Security</h2>
          </div>
          <p className="text-gray-700 text-base leading-relaxed mb-4 text-justify">
            Elite Finsoles implements comprehensive security measures to protect your personal information:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Safeguards</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>SSL encryption for all data transmission</li>
                <li>Secure servers with firewalls and intrusion detection</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Multi-factor authentication for account access</li>
                <li>Encrypted storage of sensitive information</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Operational Safeguards</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Strict access controls and employee training</li>
                <li>Regular monitoring and incident response procedures</li>
                <li>Compliance with industry security standards</li>
                <li>Secure disposal of outdated information</li>
                <li>Regular backup and disaster recovery procedures</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="lg:px-4 lg:py-6 phone:px-2 phone:py-3">
          <div className="flex items-center mb-4">
            <FaEye className="text-blue-600 text-xl mr-3" />
            <h2 className="lg:text-2xl font-semibold phone:text-lg text-gray-800">Your Privacy Rights</h2>
          </div>
          <p className="text-gray-700 text-base leading-relaxed mb-4 text-justify">
            You have the following rights regarding your personal information:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800">Access & Review</h4>
                <p className="text-sm text-gray-600">Request access to your personal information and review how it's used</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-800">Correction</h4>
                <p className="text-sm text-gray-600">Request correction of inaccurate or incomplete information</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-800">Deletion</h4>
                <p className="text-sm text-gray-600">Request deletion of your data (subject to legal requirements)</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-gray-800">Portability</h4>
                <p className="text-sm text-gray-600">Request a copy of your data in a portable format</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-gray-800">Objection</h4>
                <p className="text-sm text-gray-600">Object to certain types of processing</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h4 className="font-semibold text-gray-800">Withdrawal</h4>
                <p className="text-sm text-gray-600">Withdraw consent for data processing (where applicable)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 lg:p-8 rounded-xl phone:p-6 tablet:p-6">
          <div className="flex items-center mb-4">
            <FaFileContract className="text-green-600 text-xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
          </div>
          <p className="text-gray-700 text-base leading-relaxed mb-4 text-justify">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Elite Finsoles</h3>
              <p className="text-gray-600 text-sm">3rd Floor, Plot No.264/265, Vaswani Chamber,<br/>
              Dr.Annie Besant Road, Worli Colony, Mumbai-400018</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Contact Details</h3>
              <p className="text-gray-600 text-sm">Email: privacy@elitefinsoles.com<br/>
              Phone: +91 9561113316</p>
            </div>
          </div>
        </div>

        {/* Policy Updates */}
        <div className="bg-white lg:p-8 rounded-xl shadow-lg phone:p-6 tablet:p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Policy Updates</h2>
          <p className="text-gray-700 text-base leading-relaxed mb-4 text-justify">
            This Privacy Policy may be updated periodically to reflect changes in our practices or applicable laws. We will notify you of any material changes through our website or direct communication. Your continued use of our services after such changes constitutes acceptance of the updated policy.
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

export default Page;