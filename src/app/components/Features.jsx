"use client";
import React from "react";
import { 
  FaWallet, 
  FaUsers, 
  FaChartLine, 
  FaStar,
  FaTrophy,
  FaHandshake,
  FaRocket
} from "react-icons/fa";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const Features = () => {
  const [ref1, inView1] = useInView({ triggerOnce: true });
  const [ref2, inView2] = useInView({ triggerOnce: true });
  const [ref3, inView3] = useInView({ triggerOnce: true });
  const [ref4, inView4] = useInView({ triggerOnce: true });

  const achievements = [
    {
      icon: <FaWallet className="text-2xl" />,
      title: "Loan Options",
      value: 50,
      suffix: "+",
      description: "Diverse loan products",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: <FaUsers className="text-2xl" />,
      title: "Happy Customers",
      value: 100000,
      suffix: "+",
      description: "Trusted by families",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: <FaChartLine className="text-2xl" />,
      title: "Success Rate",
      value: 98,
      suffix: "%",
      description: "Approval success",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: <FaStar className="text-2xl" />,
      title: "Customer Rating",
      value: 4.9,
      suffix: "",
      description: "Out of 5 stars",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    }
  ];

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Achievements</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Trusted by thousands of customers for their financial needs.
          </p>
        </motion.div>

                 {/* Stats Grid */}
         <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              ref={index === 0 ? ref1 : index === 1 ? ref2 : index === 2 ? ref3 : ref4}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative"
            >
                             {/* Main Card */}
               <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
                 {/* Gradient overlay on hover */}
                 <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                 
                 {/* Content - Centered */}
                 <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                                       {/* Icon Container */}
                    <div className={`w-12 h-12 ${achievement.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <div className={achievement.iconColor}>
                        {achievement.icon}
                      </div>
                    </div>

                    {/* Text Content */}
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 group-hover:text-gray-900 transition-colors duration-300">
                        {index === 0 && inView1 && <CountUp start={0} end={achievement.value} duration={2.5} suffix={achievement.suffix} />}
                        {index === 1 && inView2 && <CountUp start={0} end={achievement.value} duration={2.5} separator="," suffix={achievement.suffix} />}
                        {index === 2 && inView3 && <CountUp start={0} end={achievement.value} duration={2.5} suffix={achievement.suffix} />}
                        {index === 3 && inView4 && <CountUp start={0} end={achievement.value} duration={2.5} decimals={1} suffix={achievement.suffix} />}
                      </h2>
                      <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1 group-hover:text-gray-900 transition-colors duration-300">
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                        {achievement.description}
                      </p>
                    </div>
                 </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
              </div>

              {/* Floating accent */}
              <div className={`absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br ${achievement.color} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 transform scale-0 group-hover:scale-100`}></div>
            </motion.div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default Features;
