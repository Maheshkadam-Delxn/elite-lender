"use client";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const LoanPlans = () => {
  const loans = [
    { 
      name: "Personal Loan", 
      img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", 
      link: "/loan-types/personal",
      color: "from-blue-100 to-blue-50",
    },
    { 
      name: "Home Loan", 
      img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", 
      link: "/loan-types/home",
      color: "from-green-100 to-green-50",
    },
    { 
      name: "Business Loan", 
      img: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", 
      link: "/loan-types/business",
      color: "from-purple-100 to-purple-50",
    },
    { 
      name: "Education Loan", 
      img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", 
      link: "/loans-types/education",
      color: "from-yellow-100 to-yellow-50",
    },
    { 
      name: "Car Loan", 
      img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", 
      link: "/loans-types/car",
      color: "from-red-100 to-red-50",
    },
    { 
      name: "Gold Loan", 
      img: "https://images.unsplash.com/photo-1610375461246-83df859d849d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", 
      link: "/loans-types/gold",
      color: "from-amber-100 to-amber-50",
    }
  ];

  return (
    <div className="w-full py-12 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Explore Our Loan Options
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our wide range of loan products tailored to your financial needs
          </p>
        </div>

        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {loans.map((loan, index) => (
              <Link 
                href={loan.link} 
                key={index}
                className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105"
              >
                <div className="aspect-square bg-gradient-to-br ${loan.color}">
                  <div className="relative h-full w-full">
                    <Image
                      src={loan.img}
                      alt={loan.name}
                      fill
                      className="object-cover"
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold text-sm sm:text-base">
                          {loan.name}
                        </h3>
                        <div className="bg-white/90 rounded-full p-1 group-hover:bg-white transition-all">
                          <FaArrowRight className="text-gray-800 text-xs" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 text-2xl">
                      {loan.icon}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanPlans;