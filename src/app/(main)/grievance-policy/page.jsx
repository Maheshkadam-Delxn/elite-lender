import React from "react";
import graveance from "../../../public/coverimg/graveance.png";
import Image from "next/image";

const page = () => {
  return (
    <div className="w-full h-auto flex flex-col lg:gap-10 phone:gap-5 p-6 bg-gray-50">
      {/* Header Section */}
      <div className="w-full h-56 bg-black p-6 relative">
        <Image src={graveance} layout="fill" objectFit="cover" alt="grievance-policy" />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 flex items-center pl-16 text-white">
          <h1 className="text-2xl font-bold">Grievance Redressal</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white shadow-md border border-gray-200 rounded-3xl p-8 text-gray-700 space-y-4 leading-relaxed">
        <p className="text-justify">
          Customers can lodge their complaints through various channels, including visiting our office, sending a written letter, emailing us, calling directly, or submitting a request via our website. If the resolution provided by our customer service team does not meet your expectations, or if you do not receive a response within 15 days, you may escalate your complaint to:
        </p>

        <div className="space-y-2 text-justify">
          <p>
            <span className="font-semibold">Grievance Redressal Officer (GRO):</span> Mr. Vinod Tongar
          </p>
          <p>
            <span className="font-semibold">Registered Office:</span> 3rd Floor, Plot No. 264/265, Vaswani Chamber, Dr. Annie Besant Road, Worli Colony, Mumbai - 400018
          </p>
          <p>
            <span className="font-semibold">Corporate Office:</span> 104, 1st Floor, A-Wing, Boomerang, Chandivali Farm Road, Andheri East, Mumbai - 40072
          </p>
          <p>
            <span className="font-semibold">Email:</span> 
            <a href="mailto:po@policysansar.com" className="text-blue-600 underline"> po@policysansar.com</a>
          </p>
          <p>
            <span className="font-semibold">Call:</span> +91 9644170004 (Monday to Friday, 10:30 AM - 06:00 PM)
          </p>
          <p>
            <span className="font-semibold">Response Time:</span> We aim to address complaints within 7 working days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
