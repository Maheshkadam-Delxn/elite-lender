"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaWallet,
  FaHome,
  FaBriefcase,
  FaGraduationCap,
  FaCar,
  FaGem,
  FaPuzzlePiece,
  FaTrophy,
  FaStar,
  FaHandshake,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaCreditCard,
  FaUniversity,
  FaBuilding,
  FaChartLine,
  FaPiggyBank,
  FaHeart,
  FaLeaf,
  FaRocket,
  FaLightbulb,
  FaCog,
  FaTools,
  FaWrench,
  FaHammer,
  FaKey,
  FaLock,
  FaUnlock,
  FaTimesCircle,
  FaInfoCircle,
  FaQuestionCircle,
  FaExclamationCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaPlayCircle,
  FaPauseCircle,
  FaStopCircle,
  FaUser,
  FaUsers,
  FaUserTie,
  FaUserGraduate,
  FaUserCog,
  FaUserShield,
  FaUserCheck,
  FaUserPlus,
  FaUserMinus,
  FaUserTimes,
  FaUserEdit,
  FaUserClock,
  FaUserLock,
  FaUserUnlock,
  FaUserSecret,
  FaUserNinja,
  FaUserAstronaut,
  // Additional icons for banner features
  FaAward,
  FaCrown,
  FaDiamond,
  FaMedal,
  FaPercent,
  FaCalendarAlt,
  FaGlobe,
  FaBolt,
  FaCoins,
  FaFileAlt,
  FaCalculator,
  FaHeadset
} from 'react-icons/fa';

// Icon mapping object
const iconMap = {
  FaWallet,
  FaHome,
  FaBriefcase,
  FaGraduationCap,
  FaCar,
  FaGem,
  FaPuzzlePiece,
  FaTrophy,
  FaStar,
  FaHandshake,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaCreditCard,
  FaUniversity,
  FaBuilding,
  FaChartLine,
  FaPiggyBank,
  FaHeart,
  FaLeaf,
  FaRocket,
  FaLightbulb,
  FaCog,
  FaTools,
  FaWrench,
  FaHammer,
  FaKey,
  FaLock,
  FaUnlock,
  FaTimesCircle,
  FaInfoCircle,
  FaQuestionCircle,
  FaExclamationCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaPlayCircle,
  FaPauseCircle,
  FaStopCircle,
  FaUser,
  FaUsers,
  FaUserTie,
  FaUserGraduate,
  FaUserCog,
  FaUserShield,
  FaUserCheck,
  FaUserPlus,
  FaUserMinus,
  FaUserTimes,
  FaUserEdit,
  FaUserClock,
  FaUserLock,
  FaUserUnlock,
  FaUserSecret,
  FaUserNinja,
  FaUserAstronaut,
  // Additional icons for banner features
  FaAward,
  FaCrown,
  FaDiamond,
  FaMedal,
  FaPercent,
  FaCalendarAlt,
  FaGlobe,
  FaBolt,
  FaCoins,
  FaFileAlt,
  FaCalculator,
  FaHeadset
};

const Homee = () => {
  const [banner, setBanner] = useState({
    title: "Get the Best Loan Rates!",
    subtitle: "Compare Plans & Save Money!",
    bgColor: "bg-blue-600",
    images: [],
    features: [
      { icon: <FaCheckCircle className="text-green-500" />, text: "Lowest Rates" },
      { icon: <FaClock className="text-blue-500" />, text: "Quick Approval" },
      { icon: <FaShieldAlt className="text-purple-500" />, text: "Trusted Lenders" }
    ]
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [loanTypes, setLoanTypes] = useState([
    { 
      icon: <FaWallet className="text-2xl text-blue-600" />, 
      title: "Personal", 
      description: "Loan",
      bgColor: "bg-blue-50"
    },
    { 
      icon: <FaHome className="text-2xl text-green-600" />, 
      title: "Home", 
      description: "Loan",
      bgColor: "bg-green-50"
    },
    { 
      icon: <FaBriefcase className="text-2xl text-amber-600" />, 
      title: "Business", 
      description: "Loan",
      bgColor: "bg-amber-50"
    },
    { 
      icon: <FaGraduationCap className="text-2xl text-purple-600" />, 
      title: "Education", 
      description: "Loan",
      bgColor: "bg-purple-50"
    },
    { 
      icon: <FaCar className="text-2xl text-red-600" />, 
      title: "Vehicle", 
      description: "Loan",
      bgColor: "bg-red-50"
    },
    { 
      icon: <FaGem className="text-2xl text-yellow-600" />, 
      title: "Gold", 
      description: "Loan",
      bgColor: "bg-yellow-50"
    }
  ]);
  const [stats, setStats] = useState([
    { icon: <FaPuzzlePiece className="text-lg text-blue-600" />, value: "50+", label: "Loan Options" },
    { icon: <FaTrophy className="text-lg text-green-600" />, value: "95%", label: "Approval Rate" },
    { icon: <FaStar className="text-lg text-yellow-600" />, value: "4.8", label: "Customer Rating" }
  ]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [updateTimeout, setUpdateTimeout] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletedDefaults, setDeletedDefaults] = useState(new Set());
  const [networkError, setNetworkError] = useState(false);
  const router = useRouter();

  // Define default string IDs for loan types (same as admin dashboard)
  const defaultStringIds = ["personal", "home", "business", "education", "vehicle", "gold"];

  // Test icon mapping function
  const testIconMapping = () => {
    console.log('🏠 Testing icon mapping...');
    const testIcons = ['FaCheckCircle', 'FaStar', 'FaShieldAlt', 'FaClock', 'FaAward', 'FaCrown'];
    testIcons.forEach(iconName => {
      const IconComponent = iconMap[iconName];
      console.log(`🏠 ${iconName}:`, !!IconComponent);
    });
  };

  // Auto-scroll banner images with endless loop
  useEffect(() => {
    if (banner.images && banner.images.length > 1 && isAutoScrolling) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => {
          const nextIndex = (prev + 1) % banner.images.length;
          console.log('🏠 Auto-scrolling to image:', nextIndex, 'of', banner.images.length);
          return nextIndex;
        });
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    } else if (banner.images && banner.images.length === 1) {
      // If only one image, ensure it's displayed
      setCurrentImageIndex(0);
    }
  }, [banner.images?.length, isAutoScrolling]); // Only depend on length, not the entire images array

  // Ensure currentImageIndex is always valid
  useEffect(() => {
    if (banner.images && banner.images.length > 0) {
      if (currentImageIndex >= banner.images.length) {
        console.log('🏠 Fixing invalid currentImageIndex:', currentImageIndex, '-> 0');
        setCurrentImageIndex(0);
      }
    } else if (banner.images && banner.images.length === 0) {
      // If no images, reset to 0
      if (currentImageIndex !== 0) {
        console.log('🏠 No banner images, resetting currentImageIndex to 0');
        setCurrentImageIndex(0);
      }
    }
  }, [banner.images, currentImageIndex]);

  // Load deletedDefaults from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('deletedDefaults');
      if (saved) {
        setDeletedDefaults(new Set(JSON.parse(saved)));
      }
    }
    // Test icon mapping on mount
    testIconMapping();
    
    // Check initial network status
    if (navigator.onLine === false) {
      setNetworkError(true);
    }
  }, []);

  // Real-time update functionality
  useEffect(() => {
    // Only fetch data if network is available
    if (!networkError) {
      fetchData();
    }

    // Listen for storage events (when admin dashboard makes changes)
    const handleStorageChange = (e) => {
      if (e.key === 'deletedDefaults') {
        console.log('🏠 Homee - Storage change detected:', e.key, e.newValue);
        // Update local state immediately
        const newDeletedDefaults = new Set(JSON.parse(e.newValue || '[]'));
        setDeletedDefaults(newDeletedDefaults);
        
        // Immediately filter current loan types without waiting for API call
        setLoanTypes(prevLoanTypes => {
          const filtered = prevLoanTypes.filter(loan => {
            // Check if this is a default item using the stored _id
            if (defaultStringIds.includes(loan._id)) {
              const defaultKey = `${loan.title}-${loan.icon}`;
              const shouldShow = !newDeletedDefaults.has(defaultKey);
              console.log(`🏠 Homee - Filtering ${loan.title}: ${shouldShow ? 'SHOW' : 'HIDE'}`);
              return shouldShow;
            }
            return true;
          });
          console.log('🏠 Homee - Filtered loan types:', filtered.length);
          return filtered;
        });
        
        // Still fetch fresh data in background for consistency
        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }
        const timeout = setTimeout(() => {
          fetchData();
        }, 100);
        setUpdateTimeout(timeout);
      } else if (e.key === 'bannerLastUpdate') {
        console.log('🏠 Homee - Banner storage change detected');
        // Immediately fetch banner data for faster response
        fetchBannerData();
      }
    };

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('🏠 Network is back online');
      setNetworkError(false);
      // Retry fetching data when network comes back
      fetchData();
    };

    const handleOffline = () => {
      console.log('🏠 Network is offline');
      setNetworkError(true);
    };

    // Listen for custom events from admin dashboard
    const handleDataUpdate = () => {
      console.log('🏠 Homee - Custom data update event received');
      // Debounce the update to prevent multiple rapid calls
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      const timeout = setTimeout(() => {
        fetchData();
      }, 100);
      setUpdateTimeout(timeout);
    };

    // Listen for banner-specific updates
    const handleBannerUpdate = () => {
      console.log('🏠 Homee - Banner update event received');
      // Immediately fetch banner data for faster response
      fetchBannerData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dataUpdated', handleDataUpdate);
    window.addEventListener('bannerUpdated', handleBannerUpdate);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dataUpdated', handleDataUpdate);
      window.removeEventListener('bannerUpdated', handleBannerUpdate);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [networkError]);

  // Separate effect for polling based on network status
  useEffect(() => {
    let pollInterval;
    
    if (!networkError) {
      pollInterval = setInterval(() => {
        fetchData();
      }, 5000);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [networkError]);

  // Separate function for fetching banner data only
  const fetchBannerData = async () => {
    // Don't fetch if network is offline
    if (networkError) {
      console.log('🏠 Skipping banner fetch - network is offline');
      return;
    }
    
    try {
      const bannerRes = await fetch('/api/banner', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!bannerRes.ok) {
        throw new Error(`HTTP error! status: ${bannerRes.status}`);
      }
      
      const bannerData = await bannerRes.json();
      // Reduced logging to prevent console spam
      
      if (bannerData.success && bannerData.data) {
        const bannerFeatures = bannerData.data.features?.map(feature => {
          console.log('🏠 Processing banner feature:', feature);
          const IconComponent = iconMap[feature.icon];
          console.log('🏠 Icon component found:', !!IconComponent, 'for icon:', feature.icon);
          console.log('🏠 Color class:', feature.color);
          
          // Ensure color class is properly formatted
          let colorClass = feature.color || 'text-green-500';
          if (colorClass && !colorClass.startsWith('text-')) {
            colorClass = `text-${colorClass}`;
          }
          
          const finalIcon = IconComponent ? <IconComponent className={colorClass} /> : <FaCheckCircle className={colorClass} />;
          console.log('🏠 Final icon for', feature.icon, ':', !!finalIcon);
          
          return {
            icon: finalIcon,
            text: feature.text
          };
        }) || [];
        
        const bannerState = {
          title: bannerData.data.title,
          subtitle: bannerData.data.subtitle,
          bgColor: bannerData.data.bgColor || 'bg-blue-600',
          images: bannerData.data.images || [],
          features: bannerFeatures
        };
        
        console.log('🏠 Setting banner state:', bannerState);
        console.log('🏠 Banner images in state:', bannerState.images);
        console.log('🏠 Banner images count in state:', bannerState.images.length);
        
        // Only reset currentImageIndex if the number of images changed
        setBanner(prevBanner => {
          const newBanner = bannerState;
          if (prevBanner.images?.length !== newBanner.images?.length) {
            console.log('🏠 Image count changed, resetting currentImageIndex to 0');
            setCurrentImageIndex(0);
          } else if (newBanner.images?.length > 0 && currentImageIndex >= newBanner.images.length) {
            console.log('🏠 Current image index out of bounds, resetting to 0');
            setCurrentImageIndex(0);
          }
          // Don't reset if images are the same, maintain current position
          return newBanner;
        });
        
        // Banner updated successfully
      }
    } catch (error) {
      console.error('Error fetching banner data:', error);
      // Set default banner data on error to prevent crashes
      setBanner({
        title: "Get the Best Loan Rates!",
        subtitle: "Compare Plans & Save Money!",
        bgColor: "bg-blue-600",
        images: [],
        features: [
          { icon: <FaCheckCircle className="text-green-500" />, text: "Lowest Rates" },
          { icon: <FaClock className="text-blue-500" />, text: "Quick Approval" },
          { icon: <FaShieldAlt className="text-purple-500" />, text: "Trusted Lenders" }
        ]
      });
    }
  };

  const fetchData = async () => {
    // Don't fetch if network is offline
    if (networkError) {
      console.log('🏠 Skipping fetch - network is offline');
      return;
    }
    
    try {
      setIsUpdating(true);
      
      // Fetch banner data
      await fetchBannerData();

      // Fetch loan types data
      try {
        const loanTypesRes = await fetch('/api/loan-types', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (loanTypesRes.ok) {
          const loanTypesData = await loanTypesRes.json();
          console.log('🏠 Homee - Fetched loan types:', loanTypesData);
          if (loanTypesData.success && loanTypesData.data) {
            // Filter out deleted default items
            const filteredLoanTypes = loanTypesData.data.filter(loan => {
              // Check if this is a default item (has string _id)
              if (defaultStringIds.includes(loan._id)) {
                // This is a default item, check if it's been deleted
                const defaultKey = `${loan.title}-${loan.icon}`;
                return !deletedDefaults.has(defaultKey);
              }
              // This is a database item, always show it
              return true;
            });

            const dynamicLoanTypes = filteredLoanTypes.map((loan, idx) => {
              const IconComponent = iconMap[loan.icon];
              return {
                id: loan._id || loan.title?.toLowerCase().replace(/\s+/g, '-') || `loan-${idx}`,
                _id: loan._id, // Store original _id for filtering
                icon: IconComponent ? <IconComponent className={`text-2xl ${loan.iconColor}`} /> : <FaWallet className="text-2xl text-blue-600" />,
                title: loan.title,
                subtitle: loan.subtitle,
                description: loan.description,
                typesOfLoan: loan.typesOfLoan,
                features: loan.features,
                bgColor: loan.bgColor,
                iconColor: loan.iconColor,
                link: loan.link
              };
            });
            console.log('🏠 Homee - Processed loan types:', dynamicLoanTypes);
            setLoanTypes(dynamicLoanTypes);
          }
        }
      } catch (loanError) {
        console.error('Error fetching loan types:', loanError);
        // Set default loan types on network error
        setLoanTypes([
          { 
            icon: <FaWallet className="text-2xl text-blue-600" />, 
            title: "Personal", 
            description: "Loan",
            bgColor: "bg-blue-50"
          },
          { 
            icon: <FaHome className="text-2xl text-green-600" />, 
            title: "Home", 
            description: "Loan",
            bgColor: "bg-green-50"
          },
          { 
            icon: <FaBriefcase className="text-2xl text-amber-600" />, 
            title: "Business", 
            description: "Loan",
            bgColor: "bg-amber-50"
          },
          { 
            icon: <FaGraduationCap className="text-2xl text-purple-600" />, 
            title: "Education", 
            description: "Loan",
            bgColor: "bg-purple-50"
          },
          { 
            icon: <FaCar className="text-2xl text-red-600" />, 
            title: "Vehicle", 
            description: "Loan",
            bgColor: "bg-red-50"
          },
          { 
            icon: <FaGem className="text-2xl text-yellow-600" />, 
            title: "Gold", 
            description: "Loan",
            bgColor: "bg-yellow-50"
          }
        ]);
      }

      // Fetch stats data
      try {
        const statsRes = await fetch('/api/stats', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success && statsData.data) {
            const dynamicStats = statsData.data.map(stat => {
              const IconComponent = iconMap[stat.icon];
              return {
                icon: IconComponent ? <IconComponent className={`text-lg ${stat.iconColor}`} /> : <FaPuzzlePiece className="text-lg text-blue-600" />,
                value: stat.value,
                label: stat.label
              };
            });
            setStats(dynamicStats);
          }
        }
      } catch (statsError) {
        console.error('Error fetching stats:', statsError);
        // Set default stats on network error
        setStats([
          { icon: <FaPuzzlePiece className="text-lg text-blue-600" />, value: "50+", label: "Loan Options" },
          { icon: <FaTrophy className="text-lg text-green-600" />, value: "95%", label: "Approval Rate" },
          { icon: <FaStar className="text-lg text-yellow-600" />, value: "4.8", label: "Customer Rating" }
        ]);
      }

      setLastUpdate(Date.now());
      setNetworkError(false); // Clear network error on successful fetch
    } catch (error) {
      console.error('Error fetching data:', error);
      setNetworkError(true); // Set network error flag
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6">
      {/* Hero Banner Section */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className={`relative h-32 sm:h-40 md:h-48 rounded-xl overflow-hidden shadow-md ${banner.bgColor}`}>
          {/* Background Images Carousel */}
          {banner.images && banner.images.length > 0 && (
            <div className="absolute inset-0">
                            {banner.images.map((image, index) => (
                    <div
                      key={`${image.url}-${index}`}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || 'Banner Image'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    </div>
              ))}
              
              {/* Image Navigation Dots */}
              {banner.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {banner.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white scale-125' 
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                      title={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
              

            </div>
          )}
          

          
          {/* Content Overlay */}
          <div className="relative z-10 h-full flex items-center px-4 sm:px-6 md:px-8">
            <div className="text-white">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 text-center sm:text-left">
                {banner.title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg mb-3 opacity-90 text-center sm:text-left">
                {banner.subtitle}
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                {banner.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    {feature.icon}
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
            Your Trusted Loan Partner
          </h1>
            {isUpdating && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-gray-700 mb-1">
            <span>Financial Solutions</span>
            <FaHandshake className="text-blue-500 text-lg" />
            <span>You Can Trust</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            One-Stop Shop for All Your Loan Needs
            {isUpdating && (
              <span className="ml-2 text-blue-500">• Updating...</span>
            )}
            {networkError && (
              <span className="ml-2 text-orange-500">• Offline Mode</span>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Trust Image */}
          <div className="hidden lg:block w-1/3">
            <img 
              src="/core/growbar.png"
              alt="Trust"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>

          {/* Loan Types Grid */}
          <div className="w-full lg:w-2/3">
             {loanTypes.length === 0 ? (
               <div className="text-center py-8 mb-8">
                 <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
                   <FaWallet className="text-4xl text-gray-400 mx-auto mb-4" />
                   <h3 className="text-lg font-semibold text-gray-600 mb-2">No Loan Types Available</h3>
                   <p className="text-gray-500">Loan types will appear here once they are added through the admin dashboard.</p>
                 </div>
               </div>
             ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {loanTypes.map((loan, idx) => (
                <div
                  key={idx}
                     className={`${loan.bgColor} rounded-lg p-4 transition-all duration-200 hover:shadow-sm border border-gray-200 flex flex-col items-center text-center cursor-pointer hover:scale-105`}
                     onClick={() => {
                       // Navigate to the loan type detail page
                       const loanId = loan.id || loan.title?.toLowerCase().replace(/\s+/g, '-');
                       router.push(`/loan-types/${loanId}`);
                     }}
                >
                  <div className="mb-3 flex justify-center">
                    {loan.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1">
                      {loan.title}
                    </h3>
                    <p className="text-xs text-gray-600">
                         {loan.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
             )}

            {/* Stats - Smaller cards with left-aligned content */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white">
                      {stat.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-800 text-sm">{stat.value}</h3>
                      <p className="text-xs text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 text-center">
          <div className="bg-blue-600 rounded-lg p-5 text-white">
            <h2 className="text-lg sm:text-xl font-bold mb-2">Ready to Get Started?</h2>
            <p className="text-sm sm:text-base opacity-90 mb-4">Apply now and get instant approval</p>
            <button 
              className="bg-white text-blue-600 font-bold py-2 px-6 rounded-full text-sm sm:text-base hover:bg-gray-100 transition-all flex items-center mx-auto"
               onClick={() => router.push('/contact')}  // Add this onClick handler
              >
              Apply Now <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Homee;