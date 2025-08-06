"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaSignInAlt, 
  FaSignOutAlt, 
  FaEdit, 
  FaPlus, 
  FaTrash, 
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaBars,
  FaTimes as FaClose,
  FaImage,
  FaCreditCard,
  FaChartBar,
  FaChevronRight,
  FaUser,
  FaLock,
  FaUserTie,
  FaShieldAlt
} from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
  const router = useRouter();
  
  // Define default string IDs for loan types
  const defaultStringIds = ["personal", "home", "business", "education", "vehicle", "gold"];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('banner');
  const [showLogin, setShowLogin] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Navigation items for sidebar
  const navigationItems = [
    {
      id: 'banner',
      name: 'Banner',
      icon: <FaImage className="text-lg" />,
      description: 'Manage homepage banner'
    },
    {
      id: 'loan-types',
      name: 'Loan Types',
      icon: <FaCreditCard className="text-lg" />,
      description: 'Manage loan products'
    },
    {
      id: 'stats',
      name: 'Statistics',
      icon: <FaChartBar className="text-lg" />,
      description: 'Manage site statistics'
    }
  ];

  // Form states
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    bgColor: 'bg-blue-600',
    images: [],
    features: [{ icon: 'FaCheckCircle', text: '', color: 'text-green-500' }]
  });
  const [loanTypeForm, setLoanTypeForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    typesOfLoan: '',
    features: [{ icon: 'FaCheckCircle', text: '', color: 'text-green-500' }],
    icon: 'FaWallet',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    link: '',
    order: 0,
    eligibility: [''],
    documents: [''],
    loanAmount: { min: '', max: '' },
    interestRate: { min: '', max: '' },
    tenure: { min: '', max: '' }
  });
  const [statForm, setStatForm] = useState({
    value: '',
    label: '',
    icon: '',
    iconColor: 'text-blue-600',
    order: 0
  });

  // Data states
  const [bannerData, setBannerData] = useState(null);
  const [loanTypes, setLoanTypes] = useState([]);
  const [stats, setStats] = useState([]);
  const [deletedDefaults, setDeletedDefaults] = useState(() => {
    // Load deletedDefaults from localStorage on component mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('deletedDefaults');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  // Helper function to update deletedDefaults and save to localStorage
  const updateDeletedDefaults = (newSet) => {
    setDeletedDefaults(newSet);
    const serialized = JSON.stringify([...newSet]);
    localStorage.setItem('deletedDefaults', serialized);
    // Trigger event for home page to update
    window.dispatchEvent(new CustomEvent('dataUpdated'));
    
    // Force a storage event for cross-tab communication
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'deletedDefaults',
      newValue: serialized,
      oldValue: localStorage.getItem('deletedDefaults')
    }));
  };

  // Helper function to trigger home page updates
  const triggerHomePageUpdate = () => {
    // Trigger immediately for faster response
    window.dispatchEvent(new CustomEvent('dataUpdated'));
    
    // Also trigger a storage event to ensure cross-tab communication
    const currentDeletedDefaults = localStorage.getItem('deletedDefaults');
    localStorage.setItem('deletedDefaults', currentDeletedDefaults || '[]');
  };

  // Helper function to trigger banner-specific updates
  const triggerBannerUpdate = () => {
    // Trigger banner update event
    window.dispatchEvent(new CustomEvent('bannerUpdated'));
    
    // Also trigger general data update
    window.dispatchEvent(new CustomEvent('dataUpdated'));
    
    // Force a storage event for cross-tab communication
    const bannerUpdateTime = Date.now();
    localStorage.setItem('bannerLastUpdate', bannerUpdateTime.toString());
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'bannerLastUpdate',
      newValue: bannerUpdateTime.toString(),
      oldValue: localStorage.getItem('bannerLastUpdate')
    }));
  };

  // Check if admin is logged in
  useEffect(() => {
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
      setIsLoggedIn(true);
      setShowLogin(false);
      fetchData();
    }
  }, []);

  // Refetch data when deletedDefaults changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [deletedDefaults]);

  const fetchData = async () => {
    try {
      // Fetch banner
      const bannerRes = await fetch('/api/banner');
      const bannerResult = await bannerRes.json();
      if (bannerResult.success) {
        setBannerData(bannerResult.data);
      }

                   // Fetch loan types
      const loanTypesRes = await fetch('/api/loan-types');
      const loanTypesResult = await loanTypesRes.json();
      console.log('📊 Fetched loan types:', loanTypesResult);
      if (loanTypesResult.success) {
        // Filter out deleted default items
        const filteredLoanTypes = loanTypesResult.data.filter(loan => {
          // Check if this is a default item (has string _id)
          if (defaultStringIds.includes(loan._id)) {
            // This is a default item, check if it's been deleted
            const defaultKey = `${loan.title}-${loan.icon}`;
            return !deletedDefaults.has(defaultKey);
          }
          return true; // Keep database items
        });
        console.log('🔍 Filtered loan types:', filteredLoanTypes);
        setLoanTypes(filteredLoanTypes);
      }

      // Fetch stats
      const statsRes = await fetch('/api/stats');
      const statsResult = await statsRes.json();
      if (statsResult.success) {
        setStats(statsResult.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const result = await response.json();
      if (result.success) {
        setAdmin(result.data);
        setIsLoggedIn(true);
        setShowLogin(false);
        localStorage.setItem('adminData', JSON.stringify(result.data));
        toast.success('Login successful!');
        fetchData();
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('Login error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminData');
    setIsLoggedIn(false);
    setAdmin(null);
    setShowLogin(true);
    toast.success('Logged out successfully');
  };

     const handleSubmit = async (e) => {
     e.preventDefault();
     setIsLoading(true);
     try {
      let endpoint = '';
      let formData = {};
      let method = 'POST';

      switch (activeTab) {
        case 'banner':
          endpoint = '/api/banner';
          // Filter out empty features and ensure bgColor is included
          formData = {
            ...bannerForm,
            images: bannerForm.images || [], // Explicitly include images
            features: bannerForm.features.filter(feature => feature.text.trim() && feature.icon.trim())
          };
          console.log('🎨 Banner form submission - editingItem:', editingItem);
          console.log('🎨 Banner form submission - formData:', formData);
          console.log('🖼️ Images being saved:', formData.images);
          console.log('🖼️ Images count being saved:', formData.images.length);
          break;
        case 'loan-types':
          if (editingItem) {
            endpoint = `/api/loan-types/${editingItem._id}`;
            method = 'PUT';
          } else {
            endpoint = '/api/loan-types';
          }
          // Process loan type form data
          formData = {
            ...loanTypeForm,
            link: loanTypeForm.link || '',
            // Convert typesOfLoan string to array
            typesOfLoan: loanTypeForm.typesOfLoan ? 
              loanTypeForm.typesOfLoan.split(',').map(item => item.trim()).filter(item => item) : [],
            // Filter out empty eligibility and documents
            eligibility: loanTypeForm.eligibility.filter(item => item.trim()),
            documents: loanTypeForm.documents.filter(doc => doc.trim()),
            // Filter out empty features
            features: loanTypeForm.features.filter(feature => feature.text.trim())
          };
          break;
        case 'stats':
          if (editingItem) {
            endpoint = `/api/stats/${editingItem._id}`;
            method = 'PUT';
          } else {
            endpoint = '/api/stats';
          }
          formData = statForm;
          break;
      }

      console.log('📤 Sending data to:', endpoint);
      console.log('📤 Form data:', JSON.stringify(formData, null, 2));
      console.log('🎨 Banner bgColor:', formData.bgColor);
      console.log('🔧 Banner features:', formData.features);
      console.log('🖼️ Banner images:', formData.images);
      console.log('🖼️ Banner images length:', formData.images?.length);
      
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

                     const result = await response.json();
        console.log('📋 API Response:', result);
        if (result.success) {
          toast.success(editingItem ? 'Data updated successfully!' : 'Data saved successfully!');
          setShowForm(false);
          setEditingItem(null);
          
          // Always fetch fresh data to ensure consistency
          await fetchData();
          
          // Trigger banner-specific update for faster response
          if (activeTab === 'banner') {
            triggerBannerUpdate();
          } else {
            // Trigger home page update for other content
            triggerHomePageUpdate();
          }
          
          resetForms();
        } else {
          console.error('❌ API Error:', result.error);
          toast.error(result.error || 'Error saving data');
        }
     } catch (error) {
       toast.error('Error saving data');
     } finally {
       setIsLoading(false);
     }
  };

  const resetForms = () => {
    setBannerForm({
      title: '',
      subtitle: '',
      bgColor: 'bg-blue-600',
      images: [],
      features: [{ icon: 'FaCheckCircle', text: '', color: 'text-green-500' }]
    });
    
    // Calculate next order number for loan types (considering both default and database items)
    const nextOrder = loanTypes.length > 0 
      ? Math.max(...loanTypes.map(loan => loan.order || 0)) + 1 
      : 7; // Start after default items (1-6)
    
    setLoanTypeForm({
      title: '',
      subtitle: '',
      description: '',
      typesOfLoan: '',
      features: [{ icon: 'FaCheckCircle', text: '', color: 'text-green-500' }],
      icon: 'FaWallet',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '',
      order: nextOrder,
      eligibility: [''],
      documents: [''],
      loanAmount: { min: '', max: '' },
      interestRate: { min: '', max: '' },
      tenure: { min: '', max: '' }
    });
    setStatForm({
      value: '',
      label: '',
      icon: '',
      iconColor: 'text-blue-600',
      order: 0
    });
  };

  const addFeature = () => {
    setBannerForm(prev => ({
      ...prev,
      features: [...prev.features, { icon: 'FaCheckCircle', text: '', color: 'text-green-500' }]
    }));
  };

  const removeFeature = (index) => {
    setBannerForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index, field, value) => {
    setBannerForm(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  // Loan Type Form Helper Functions
  const addLoanFeature = () => {
    setLoanTypeForm(prev => ({
      ...prev,
      features: [...prev.features, { icon: 'FaCheckCircle', text: '', color: 'text-green-500' }]
    }));
  };

  const removeLoanFeature = (index) => {
    setLoanTypeForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateLoanFeature = (index, field, value) => {
    setLoanTypeForm(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const addEligibility = () => {
    setLoanTypeForm(prev => ({
      ...prev,
      eligibility: [...prev.eligibility, '']
    }));
  };

  const removeEligibility = (index) => {
    setLoanTypeForm(prev => ({
      ...prev,
      eligibility: prev.eligibility.filter((_, i) => i !== index)
    }));
  };

  const updateEligibility = (index, value) => {
    setLoanTypeForm(prev => ({
      ...prev,
      eligibility: prev.eligibility.map((item, i) => i === index ? value : item)
    }));
  };

  const addDocument = () => {
    setLoanTypeForm(prev => ({
      ...prev,
      documents: [...prev.documents, '']
    }));
  };

  const removeDocument = (index) => {
    setLoanTypeForm(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const updateDocument = (index, value) => {
    setLoanTypeForm(prev => ({
      ...prev,
      documents: prev.documents.map((item, i) => i === index ? value : item)
    }));
  };

  // Image upload functions
  const handleImageUpload = async (file) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Uploading image...');
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        const newImage = {
          url: result.data.url,
          alt: file.name,
          order: bannerForm.images.length
        };
        
        setBannerForm(prev => {
          const updatedForm = {
            ...prev,
            images: [...prev.images, newImage]
          };
          console.log('🖼️ Updated banner form with new image:', updatedForm);
          console.log('🖼️ Images count after upload:', updatedForm.images.length);
          return updatedForm;
        });
        
        toast.dismiss(loadingToast);
        toast.success('Image uploaded successfully!');
      } else {
        toast.dismiss(loadingToast);
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Error uploading image');
    }
  };

  const removeImage = (index) => {
    setBannerForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    toast.success('Image removed from banner');
  };

  const reorderImages = (fromIndex, toIndex) => {
    setBannerForm(prev => {
      const newImages = [...prev.images];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      
      // Update order
      newImages.forEach((image, index) => {
        image.order = index;
      });
      
      return {
        ...prev,
        images: newImages
      };
    });
  };

  // Reset file input after upload
  const resetFileInput = () => {
    const fileInput = document.getElementById('banner-image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
        <Toaster />
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main login container */}
        <div className="relative z-10 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
          {/* Logo/Brand section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaUserTie className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Admin Portal
            </h1>
            <p className="text-gray-600 font-medium">Elite Finsoles Dashboard</p>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mt-3"></div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100"
                >
                  {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <FaSignInAlt className="text-lg" />
              )}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Security notice */}
            <div className="text-center pt-4">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <FaShieldAlt className="text-green-500" />
                <span>Secure Admin Access</span>
              </div>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-xs text-gray-500">
            © 2024 Elite Finsoles. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex">
      <Toaster />
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white/90 backdrop-blur-lg shadow-xl transition-all duration-300 ease-in-out border-r border-white/20 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaUserTie className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Admin
                  </h2>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <FaClose className="text-gray-600" /> : <FaBars className="text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-800'
              }`}
            >
              <div className={`${activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}>
                {item.icon}
              </div>
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <div className="font-semibold">{item.name}</div>
                  <div className={`text-xs ${activeTab === item.id ? 'text-blue-100' : 'text-gray-400'}`}>
                    {item.description}
                  </div>
                </div>
              )}
              {sidebarOpen && activeTab === item.id && (
                <FaChevronRight className="text-sm" />
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-sm" />
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-semibold text-gray-800">{admin?.username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaSignOutAlt className="text-sm" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {navigationItems.find(item => item.id === activeTab)?.name}
              </h1>
              <div className="w-1 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              <p className="text-gray-600 font-medium">
                {navigationItems.find(item => item.id === activeTab)?.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">Welcome back</p>
                <p className="text-xs text-gray-500">{admin?.username}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <FaUserTie className="text-white text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto admin-scrollbar">
          {/* Content based on active tab */}
          <div className="max-w-6xl mx-auto">
            
            {/* Action Buttons */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {activeTab === 'banner' ? 'Banner Management' : 
                   activeTab === 'loan-types' ? 'Loan Types Management' : 
                   'Statistics Management'}
                </h2>
              </div>
              
              <div className="flex gap-3">
                {activeTab === 'loan-types' && (
                  <>
                    <button
                      onClick={() => {
                        setLoanTypeForm({
                          title: 'Personal Loan',
                          subtitle: 'Flexible personal financing',
                          description: 'Quick and easy personal loans with competitive rates',
                          typesOfLoan: 'Personal, Emergency, Medical, Travel',
                          features: [
                            { icon: 'FaCheckCircle', text: 'Quick Approval', color: 'text-green-500' },
                            { icon: 'FaClock', text: '24-48 Hours', color: 'text-blue-500' },
                            { icon: 'FaShieldAlt', text: 'Secure Process', color: 'text-purple-500' }
                          ],
                          icon: 'FaWallet',
                          iconColor: 'text-blue-600',
                          bgColor: 'bg-blue-50',
                          link: '',
                          order: 1,
                          eligibility: ['Age 21-65', 'Minimum income ₹25,000', 'Good credit score'],
                          documents: ['PAN Card', 'Aadhaar Card', 'Bank Statements', 'Salary Slips'],
                          loanAmount: { min: '₹50,000', max: '₹25,00,000' },
                          interestRate: { min: '10.49%', max: '24% p.a.' },
                          tenure: { min: '12 months', max: '60 months' }
                        });
                        setShowForm(true);
                      }}
                      className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <FaPlus />
                      Add Sample Data
                    </button>
                    {loanTypes.length > 0 && (
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete ALL loan types? This action cannot be undone.')) {
                            try {
                              // Delete all database items
                              const deletePromises = loanTypes
                                .filter(loan => loan._id)
                                .map(loan => 
                                  fetch(`/api/loan-types/${loan._id}`, { method: 'DELETE' })
                                );
                              
                              await Promise.all(deletePromises);
                              
                              // Mark all default items as deleted
                              const defaultKeys = loanTypes
                                .filter(loan => defaultStringIds.includes(loan._id))
                                .map(loan => `${loan.title}-${loan.icon}`);
                              
                              updateDeletedDefaults(new Set([...deletedDefaults, ...defaultKeys]));
                              
                              toast.success('All loan types deleted successfully');
                              fetchData();
                              // Trigger home page update immediately
                              triggerHomePageUpdate();
                            } catch (error) {
                              console.error('Error deleting all loan types:', error);
                              toast.error('Error deleting loan types');
                            }
                          }
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <FaTrash />
                        Delete All
                      </button>
                    )}
                    {deletedDefaults.size > 0 && (
                      <button
                        onClick={() => {
                          updateDeletedDefaults(new Set());
                          toast.success('Default loan types restored');
                          fetchData();
                          // Trigger home page update immediately
                          triggerHomePageUpdate();
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <FaPlus />
                        Restore Defaults
                      </button>
                    )}
                  </>
                )}
                
                {activeTab === 'loan-types' && (
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditingItem(null);
                      resetForms();
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <FaPlus />
                    Add New
                  </button>
                )}
              </div>
            </div>

          {/* Data Display */}
          <div className="space-y-4">
            {activeTab === 'banner' && bannerData && (
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold">Current Banner</h3>
                  <button
                    onClick={() => {
                      console.log('🎨 Editing banner data:', bannerData);
                      setEditingItem(bannerData);
                      const formData = {
                        title: bannerData.title,
                        subtitle: bannerData.subtitle,
                        bgColor: bannerData.bgColor || 'bg-blue-600',
                        images: bannerData.images || [],
                        features: bannerData.features?.map(feature => ({
                          icon: feature.icon,
                          text: feature.text,
                          color: feature.color
                        })) || [{ icon: 'FaCheckCircle', text: '', color: 'text-green-500' }]
                      };
                      console.log('🎨 Setting form data:', formData);
                      console.log('🖼️ Images from database:', bannerData.images);
                      console.log('🖼️ Images count from database:', bannerData.images?.length);
                      setBannerForm(formData);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <FaEdit />
                    Edit Banner
                  </button>
                </div>
                <p><strong>Title:</strong> {bannerData.title}</p>
                <p><strong>Subtitle:</strong> {bannerData.subtitle}</p>
                <p><strong>Background Color:</strong> {bannerData.bgColor || 'bg-blue-600'}</p>
                <p><strong>Images:</strong> {bannerData.images?.length || 0} uploaded</p>
                {bannerData.images && bannerData.images.length > 0 && (
                  <div className="mt-2">
                    <p><strong>Image URLs:</strong></p>
                    <div className="bg-gray-50 p-2 rounded text-xs font-mono max-h-20 overflow-y-auto">
                      {bannerData.images.map((img, index) => (
                        <div key={index} className="text-blue-600">
                          {index + 1}. {img.url}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-2">
                  <strong>Features:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {bannerData.features?.map((feature, index) => (
                      <li key={index}>{feature.text} ({feature.icon})</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

                         {activeTab === 'loan-types' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {loanTypes.length === 0 ? (
                   <div className="col-span-full text-center py-8 text-gray-500">
                     <p>No loan types added yet.</p>
                     <p className="text-sm">Click "Add New" to create your first loan type.</p>
                   </div>
                 ) : (
                   loanTypes.map((loan, index) => (
                     <div key={loan._id || `${loan.title}-${loan.icon}`} className="border rounded-lg p-4 relative hover:shadow-md transition-shadow">
                       <div className="flex justify-between items-start mb-2">
                         <h3 className="font-semibold">{loan.title}</h3>
                         <div className="flex gap-1">
                           <button
                             onClick={() => {
                               const isDefault = defaultStringIds.includes(loan._id);
                               
                               // For default items, we'll create a new one (not edit the original)
                               if (isDefault) {
                                 setEditingItem(null); // This will create a new item
                                 setLoanTypeForm({
                                   title: loan.title,
                                   subtitle: loan.subtitle || '',
                                   description: loan.description,
                                   typesOfLoan: Array.isArray(loan.typesOfLoan) ? loan.typesOfLoan.join(', ') : (loan.typesOfLoan || ''),
                                   features: loan.features && loan.features.length > 0 ? loan.features : [{ icon: 'FaCheckCircle', text: '', color: 'text-green-500' }],
                                   icon: loan.icon,
                                   iconColor: loan.iconColor,
                                   bgColor: loan.bgColor,
                                   link: loan.link || '',
                                   order: loan.order,
                                   eligibility: loan.eligibility && loan.eligibility.length > 0 ? loan.eligibility : [''],
                                   documents: loan.documents && loan.documents.length > 0 ? loan.documents : [''],
                                   loanAmount: loan.loanAmount || { min: '', max: '' },
                                   interestRate: loan.interestRate || { min: '', max: '' },
                                   tenure: loan.tenure || { min: '', max: '' }
                                 });
                               } else {
                                 setEditingItem(loan);
                                 setLoanTypeForm({
                                   title: loan.title,
                                   subtitle: loan.subtitle || '',
                                   description: loan.description,
                                   typesOfLoan: Array.isArray(loan.typesOfLoan) ? loan.typesOfLoan.join(', ') : (loan.typesOfLoan || ''),
                                   features: loan.features && loan.features.length > 0 ? loan.features : [{ icon: 'FaCheckCircle', text: '', color: 'text-green-500' }],
                                   icon: loan.icon,
                                   iconColor: loan.iconColor,
                                   bgColor: loan.bgColor,
                                   link: loan.link || '',
                                   order: loan.order,
                                   eligibility: loan.eligibility && loan.eligibility.length > 0 ? loan.eligibility : [''],
                                   documents: loan.documents && loan.documents.length > 0 ? loan.documents : [''],
                                   loanAmount: loan.loanAmount || { min: '', max: '' },
                                   interestRate: loan.interestRate || { min: '', max: '' },
                                   tenure: loan.tenure || { min: '', max: '' }
                                 });
                               }
                               setShowForm(true);
                             }}
                             className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                             title={defaultStringIds.includes(loan._id) ? "Create editable copy" : "Edit"}
                           >
                             <FaEdit />
                           </button>
                           <button
                             onClick={async () => {
                               const isDefault = defaultStringIds.includes(loan._id);
                               const confirmMessage = isDefault 
                                 ? `Are you sure you want to remove "${loan.title}" from the display? You can restore it later using the "Restore Defaults" button.`
                                 : 'Are you sure you want to delete this loan type?';
                               
                               if (confirm(confirmMessage)) {
                                 try {
                                   // Check if loan is a default item (has string _id) or database item (has ObjectId _id)
                                   if (isDefault) {
                                     // For default items, mark them as deleted in local state
                                     const defaultKey = `${loan.title}-${loan.icon}`;
                                     const newDeletedDefaults = new Set([...deletedDefaults, defaultKey]);
                                     updateDeletedDefaults(newDeletedDefaults);
                                     toast.success(`"${loan.title}" removed from display. Use "Restore Defaults" to bring it back.`);
                                     // Optimistically update the UI
                                     setLoanTypes(prev => prev.filter(item => 
                                       !(item.title === loan.title && item.icon === loan.icon && defaultStringIds.includes(item._id))
                                     ));
                                     // Trigger home page update
                                     triggerHomePageUpdate();
                                     return;
                                   }
                                   
                                   const response = await fetch(`/api/loan-types/${loan._id}`, {
                                     method: 'DELETE'
                                   });
                                   
                                   if (response.ok) {
                                     toast.success('Loan type deleted successfully');
                                     // Optimistically update the UI
                                     setLoanTypes(prev => prev.filter(item => item._id !== loan._id));
                                     // Trigger home page update immediately
                                     triggerHomePageUpdate();
                                   } else {
                                     const errorData = await response.json();
                                     toast.error(errorData.error || 'Failed to delete loan type');
                                   }
                                 } catch (error) {
                                   console.error('Error deleting loan type:', error);
                                   toast.error('Error deleting loan type');
                                 }
                               }
                             }}
                             className="p-1 text-red-600 hover:text-red-800 transition-colors"
                             title={defaultStringIds.includes(loan._id) ? "Remove default item" : "Delete"}
                           >
                             <FaTrash />
                           </button>
                         </div>
                       </div>
                       <p className="text-gray-600">{loan.description}</p>
                       <p className="text-sm text-gray-500">Icon: {loan.icon}</p>
                       <p className="text-sm text-gray-500">Order: {loan.order}</p>
                       {defaultStringIds.includes(loan._id) && (
                         <div className="absolute bottom-2 right-2">
                           <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Default</span>
                         </div>
                       )}
                     </div>
                   ))
                 )}
               </div>
             )}

            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">{stat.value}</h3>
                        <p className="text-gray-600">{stat.label}</p>
                        <p className="text-sm text-gray-500 mt-1">Icon: {stat.icon}</p>
                        <p className="text-xs text-gray-400 mt-1">Order: {stat.order || 0}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingItem(stat);
                            setStatForm({
                              value: stat.value || '',
                              label: stat.label || '',
                              icon: stat.icon || '',
                              iconColor: stat.iconColor || 'text-blue-600',
                              order: stat.order || 0
                            });
                            setShowForm(true);
                          }}
                          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
                        >
                          <FaEdit className="text-xs" />
                          Edit
                        </button>
                        {stat._id && (
                          <button
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this statistic?')) {
                                try {
                                  const response = await fetch(`/api/stats/${stat._id}`, {
                                    method: 'DELETE'
                                  });
                                  const result = await response.json();
                                  
                                  if (result.success) {
                                    toast.success('Statistic deleted successfully');
                                    fetchData();
                                    triggerHomePageUpdate();
                                  } else {
                                    toast.error(result.error || 'Error deleting statistic');
                                  }
                                } catch (error) {
                                  console.error('Error deleting statistic:', error);
                                  toast.error('Error deleting statistic');
                                }
                              }
                            }}
                            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 text-sm"
                          >
                            <FaTrash className="text-xs" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-semibold">
                 {activeTab === 'banner' ? (editingItem ? 'Edit Banner' : 'Add New Banner') : 
                  activeTab === 'loan-types' ? (editingItem ? 'Edit Loan Type' : 'Add New Loan Type') : 
                  activeTab === 'stats' ? (editingItem ? 'Edit Statistic' : 'Add New Statistic') : 
                  'Add/Edit'}
               </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  resetForms();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'banner' && (
                <>
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={bannerForm.title}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Get the Best Loan Rates!"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle *</label>
                      <input
                        type="text"
                        value={bannerForm.subtitle}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, subtitle: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Compare Plans & Save Money!"
                        required
                      />
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Banner Images</label>
                    <div className="space-y-4">
                      {/* Image Requirements Warning */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <div className="text-yellow-600 mt-0.5">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="text-sm text-yellow-800">
                            <p className="font-semibold">Image Requirements:</p>
                            <ul className="mt-1 space-y-1">
                              <li>• <strong>Aspect Ratio:</strong> 6:1 to 8:1 (width:height)</li>
                              <li>• <strong>Recommended Size:</strong> 1152×192px (6:1 ratio)</li>
                              <li>• <strong>File Types:</strong> JPEG, PNG, WebP</li>
                              <li>• <strong>Max Size:</strong> 5MB per image</li>
                              <li>• <strong>Multiple Images:</strong> Will auto-scroll every 5 seconds</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors"
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                          const files = Array.from(e.dataTransfer.files);
                          files.forEach(file => {
                            if (file.type.startsWith('image/')) {
                              handleImageUpload(file);
                            }
                          });
                        }}
                      >
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            files.forEach(file => {
                              handleImageUpload(file);
                            });
                            // Reset file input after processing
                            setTimeout(() => {
                              resetFileInput();
                            }, 100);
                          }}
                          className="hidden"
                          id="banner-image-upload"
                        />
                        <label htmlFor="banner-image-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-2">
                            <FaImage className="text-3xl text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">Click to upload images</p>
                              <p className="text-xs text-gray-500">or drag and drop multiple images</p>
                            </div>
                          </div>
                        </label>
                      </div>

                      {/* Uploaded Images */}
                      {bannerForm.images.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-700">
                              Uploaded Images ({bannerForm.images.length})
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Are you sure you want to remove all images?')) {
                                  setBannerForm(prev => ({ ...prev, images: [] }));
                                  toast.success('All images removed');
                                }
                              }}
                              className="text-xs text-red-600 hover:text-red-800 font-medium"
                            >
                              Remove All
                            </button>
                          </div>
                          <div className="space-y-2">
                            {bannerForm.images.map((image, index) => (
                              <div key={index} className="relative group border border-gray-200 rounded-lg p-2 bg-gray-50">
                                <div className="flex items-center gap-3">
                                  {/* Drag Handle */}
                                  <div className="flex flex-col gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (index > 0) {
                                          reorderImages(index, index - 1);
                                          toast.success(`Moved image ${index + 1} up`);
                                        }
                                      }}
                                      disabled={index === 0}
                                      className="w-6 h-6 bg-blue-500 text-white rounded text-xs flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                      title="Move up"
                                    >
                                      ↑
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (index < bannerForm.images.length - 1) {
                                          reorderImages(index, index + 1);
                                          toast.success(`Moved image ${index + 1} down`);
                                        }
                                      }}
                                      disabled={index === bannerForm.images.length - 1}
                                      className="w-6 h-6 bg-blue-500 text-white rounded text-xs flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                      title="Move down"
                                    >
                                      ↓
                                    </button>
                                  </div>
                                  
                                  {/* Image Preview */}
                                  <div className="flex-1">
                                    <img
                                      src={image.url}
                                      alt={image.alt}
                                      className="w-full h-20 object-cover rounded border border-gray-200"
                                      onError={(e) => {
                                        console.error('Image failed to load:', image.url);
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                    <div 
                                      className="hidden w-full h-20 bg-gray-100 rounded border border-gray-200 flex items-center justify-center"
                                      style={{ display: 'none' }}
                                    >
                                      <div className="text-center">
                                        <FaImage className="text-gray-400 text-lg mx-auto mb-1" />
                                        <p className="text-xs text-gray-500">Image failed to load</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Image Info */}
                                  <div className="flex-1 text-xs">
                                    <div className="font-medium text-gray-700">
                                      Position: {index + 1} of {bannerForm.images.length}
                                    </div>
                                    <div className="text-gray-500 truncate">
                                      {image.url.split('/').pop()}
                                    </div>
                                    <div className="text-gray-400">
                                      Order: {image.order}
                                    </div>
                                  </div>
                                  
                                  {/* Actions */}
                                  <div className="flex flex-col gap-1">
                                    <button
                                      type="button"
                                      onClick={() => removeImage(index)}
                                      className="w-6 h-6 bg-red-500 text-white rounded text-xs flex items-center justify-center hover:bg-red-600 transition-all"
                                      title="Remove image"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-200">
                            <p>💡 <strong>Image Sequence:</strong> Use ↑↓ buttons to reorder images. First image will be the default banner image. Images will auto-scroll every 3 seconds.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Background Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Color (fallback if no images)</label>
                    <select
                      value={bannerForm.bgColor}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, bgColor: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="bg-blue-600">🔵 Blue</option>
                      <option value="bg-green-600">🟢 Green</option>
                      <option value="bg-purple-600">🟣 Purple</option>
                      <option value="bg-red-600">🔴 Red</option>
                      <option value="bg-orange-600">🟠 Orange</option>
                      <option value="bg-indigo-600">🔷 Indigo</option>
                      <option value="bg-pink-600">🌸 Pink</option>
                      <option value="bg-teal-600">🔷 Teal</option>
                      <option value="bg-cyan-600">🔷 Cyan</option>
                      <option value="bg-yellow-600">🟡 Yellow</option>
                      <option value="bg-gray-600">⚫ Gray</option>
                      <option value="bg-slate-600">⚫ Slate</option>
                      <option value="bg-zinc-600">⚫ Zinc</option>
                      <option value="bg-neutral-600">⚫ Neutral</option>
                      <option value="bg-stone-600">⚫ Stone</option>
                    </select>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                    <div className="space-y-2">
                      {bannerForm.features.map((feature, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <select
                            value={feature.icon}
                            onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="FaCheckCircle">✓ Check Circle</option>
                            <option value="FaStar">★ Star</option>
                            <option value="FaShieldAlt">🛡️ Shield</option>
                            <option value="FaClock">⏰ Clock</option>
                            <option value="FaHandshake">🤝 Handshake</option>
                            <option value="FaHeart">❤️ Heart</option>
                            <option value="FaLeaf">🍃 Leaf</option>
                            <option value="FaRocket">🚀 Rocket</option>
                            <option value="FaLightbulb">💡 Lightbulb</option>
                            <option value="FaTrophy">🏆 Trophy</option>
                            <option value="FaAward">🏅 Award</option>
                            <option value="FaGem">💎 Gem</option>
                            <option value="FaCrown">👑 Crown</option>
                            <option value="FaDiamond">💎 Diamond</option>
                            <option value="FaMedal">🥇 Medal</option>
                            <option value="FaHome">🏠 Home</option>
                            <option value="FaCar">🚗 Car</option>
                            <option value="FaGraduationCap">🎓 Graduation</option>
                            <option value="FaBriefcase">💼 Briefcase</option>
                            <option value="FaWallet">👛 Wallet</option>
                            <option value="FaPiggyBank">🐷 Piggy Bank</option>
                            <option value="FaPercent">% Percent</option>
                            <option value="FaCalendarAlt">📅 Calendar</option>
                            <option value="FaTools">🔧 Tools</option>
                            <option value="FaGlobe">🌍 Globe</option>
                            <option value="FaBolt">⚡ Bolt</option>
                            <option value="FaCoins">🪙 Coins</option>
                            <option value="FaLock">🔒 Lock</option>
                            <option value="FaFileAlt">📄 File</option>
                            <option value="FaBuilding">🏢 Building</option>
                            <option value="FaChartLine">📈 Chart</option>
                            <option value="FaCalculator">🧮 Calculator</option>
                            <option value="FaHeadset">🎧 Headset</option>
                          </select>
                          <input
                            type="text"
                            value={feature.text}
                            onChange={(e) => updateFeature(index, 'text', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Feature description"
                          />
                          <select
                            value={feature.color}
                            onChange={(e) => updateFeature(index, 'color', e.target.value)}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="text-green-500">🟢 Green</option>
                            <option value="text-blue-500">🔵 Blue</option>
                            <option value="text-purple-500">🟣 Purple</option>
                            <option value="text-orange-500">🟠 Orange</option>
                            <option value="text-red-500">🔴 Red</option>
                            <option value="text-indigo-500">🔷 Indigo</option>
                            <option value="text-pink-500">🌸 Pink</option>
                            <option value="text-yellow-500">🟡 Yellow</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        + Add Feature
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'loan-types' && (
                <>
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={loanTypeForm.title}
                        onChange={(e) => setLoanTypeForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Personal Loan"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={loanTypeForm.subtitle}
                        onChange={(e) => setLoanTypeForm(prev => ({ ...prev, subtitle: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Flexible financing for your needs"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={loanTypeForm.description}
                      onChange={(e) => setLoanTypeForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Detailed description of the loan type..."
                      required
                    />
                  </div>

                  {/* Types of Loan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Types of Loan (comma-separated)</label>
                    <input
                      type="text"
                      value={loanTypeForm.typesOfLoan}
                      onChange={(e) => setLoanTypeForm(prev => ({ ...prev, typesOfLoan: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Personal Loan, Debt Consolidation, Medical Loan"
                    />
                  </div>

                  {/* Key Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
                    <div className="space-y-2">
                      {loanTypeForm.features.map((feature, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <select
                            value={feature.icon}
                            onChange={(e) => updateLoanFeature(index, 'icon', e.target.value)}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="FaCheckCircle">✓ Check Circle</option>
                            <option value="FaStar">★ Star</option>
                            <option value="FaShieldAlt">🛡️ Shield</option>
                            <option value="FaClock">⏰ Clock</option>
                            <option value="FaHandshake">🤝 Handshake</option>
                            <option value="FaHeart">❤️ Heart</option>
                            <option value="FaLeaf">🍃 Leaf</option>
                            <option value="FaRocket">🚀 Rocket</option>
                            <option value="FaLightbulb">💡 Lightbulb</option>
                            <option value="FaTrophy">🏆 Trophy</option>
                            <option value="FaAward">🏅 Award</option>
                            <option value="FaGem">💎 Gem</option>
                            <option value="FaCrown">👑 Crown</option>
                            <option value="FaDiamond">💎 Diamond</option>
                            <option value="FaMedal">🥇 Medal</option>
                            <option value="FaHome">🏠 Home</option>
                            <option value="FaCar">🚗 Car</option>
                            <option value="FaGraduationCap">🎓 Graduation</option>
                            <option value="FaBriefcase">💼 Briefcase</option>
                            <option value="FaWallet">👛 Wallet</option>
                            <option value="FaPiggyBank">🐷 Piggy Bank</option>
                            <option value="FaPercent">% Percent</option>
                            <option value="FaCalendarAlt">📅 Calendar</option>
                            <option value="FaTools">🔧 Tools</option>
                            <option value="FaGlobe">🌍 Globe</option>
                            <option value="FaBolt">⚡ Bolt</option>
                            <option value="FaCoins">🪙 Coins</option>
                            <option value="FaLock">🔒 Lock</option>
                            <option value="FaFileAlt">📄 File</option>
                            <option value="FaBuilding">🏢 Building</option>
                            <option value="FaChartLine">📈 Chart</option>
                            <option value="FaCalculator">🧮 Calculator</option>
                            <option value="FaHeadset">🎧 Headset</option>
                          </select>
                          <input
                            type="text"
                            value={feature.text}
                            onChange={(e) => updateLoanFeature(index, 'text', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Feature description"
                          />
                          <select
                            value={feature.color}
                            onChange={(e) => updateLoanFeature(index, 'color', e.target.value)}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="text-green-500">🟢 Green</option>
                            <option value="text-blue-500">🔵 Blue</option>
                            <option value="text-purple-500">🟣 Purple</option>
                            <option value="text-orange-500">🟠 Orange</option>
                            <option value="text-red-500">🔴 Red</option>
                            <option value="text-indigo-500">🔷 Indigo</option>
                            <option value="text-pink-500">🌸 Pink</option>
                            <option value="text-yellow-500">🟡 Yellow</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeLoanFeature(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addLoanFeature}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        + Add Feature
                      </button>
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loan Details</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Loan Amount (Min)</label>
                        <input
                          type="text"
                          value={loanTypeForm.loanAmount.min}
                          onChange={(e) => setLoanTypeForm(prev => ({ 
                            ...prev, 
                            loanAmount: { ...prev.loanAmount, min: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., ₹50,000"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Loan Amount (Max)</label>
                        <input
                          type="text"
                          value={loanTypeForm.loanAmount.max}
                          onChange={(e) => setLoanTypeForm(prev => ({ 
                            ...prev, 
                            loanAmount: { ...prev.loanAmount, max: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., ₹25,00,000"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Interest Rate (Min)</label>
                        <input
                          type="text"
                          value={loanTypeForm.interestRate.min}
                          onChange={(e) => setLoanTypeForm(prev => ({ 
                            ...prev, 
                            interestRate: { ...prev.interestRate, min: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 10.99%"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Interest Rate (Max)</label>
                        <input
                          type="text"
                          value={loanTypeForm.interestRate.max}
                          onChange={(e) => setLoanTypeForm(prev => ({ 
                            ...prev, 
                            interestRate: { ...prev.interestRate, max: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 24%"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Tenure (Min)</label>
                        <input
                          type="text"
                          value={loanTypeForm.tenure.min}
                          onChange={(e) => setLoanTypeForm(prev => ({ 
                            ...prev, 
                            tenure: { ...prev.tenure, min: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 12 months"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Tenure (Max)</label>
                        <input
                          type="text"
                          value={loanTypeForm.tenure.max}
                          onChange={(e) => setLoanTypeForm(prev => ({ 
                            ...prev, 
                            tenure: { ...prev.tenure, max: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 60 months"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Eligibility */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                    <div className="space-y-2">
                      {loanTypeForm.eligibility.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <span className="text-green-500 text-lg">✓</span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateEligibility(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Age between 21-65 years"
                          />
                          <button
                            type="button"
                            onClick={() => removeEligibility(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addEligibility}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        + Add Eligibility
                      </button>
                    </div>
                  </div>

                  {/* Documents Required */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Documents Required</label>
                    <div className="space-y-2">
                      {loanTypeForm.documents.map((doc, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <span className="text-blue-500 text-lg">📄</span>
                          <input
                            type="text"
                            value={doc}
                            onChange={(e) => updateDocument(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., PAN Card"
                          />
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addDocument}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        + Add Document
                      </button>
                    </div>
                  </div>

                  {/* Visual Settings */}
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                      <select
                        value={loanTypeForm.icon}
                        onChange={(e) => setLoanTypeForm(prev => ({ ...prev, icon: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="FaWallet">👛 Wallet</option>
                        <option value="FaHome">🏠 Home</option>
                        <option value="FaBriefcase">💼 Briefcase</option>
                        <option value="FaGraduationCap">🎓 Graduation</option>
                        <option value="FaCar">🚗 Car</option>
                        <option value="FaGem">💎 Gem</option>
                        <option value="FaPiggyBank">🐷 Piggy Bank</option>
                        <option value="FaCreditCard">💳 Credit Card</option>
                        <option value="FaUniversity">🏛️ University</option>
                        <option value="FaBuilding">🏢 Building</option>
                        <option value="FaChartLine">📈 Chart</option>
                        <option value="FaHandshake">🤝 Handshake</option>
                        <option value="FaShieldAlt">🛡️ Shield</option>
                        <option value="FaStar">★ Star</option>
                        <option value="FaTrophy">🏆 Trophy</option>
                        <option value="FaAward">🏅 Award</option>
                        <option value="FaHeart">❤️ Heart</option>
                        <option value="FaLeaf">🍃 Leaf</option>
                        <option value="FaRocket">🚀 Rocket</option>
                        <option value="FaLightbulb">💡 Lightbulb</option>
                        <option value="FaCog">⚙️ Cog</option>
                        <option value="FaTools">🔧 Tools</option>
                        <option value="FaWrench">🔧 Wrench</option>
                        <option value="FaHammer">🔨 Hammer</option>
                        <option value="FaKey">🔑 Key</option>
                        <option value="FaLock">🔒 Lock</option>
                        <option value="FaUnlock">🔓 Unlock</option>
                        <option value="FaCheckCircle">✓ Check Circle</option>
                        <option value="FaTimesCircle">✗ Times Circle</option>
                        <option value="FaInfoCircle">ℹ️ Info Circle</option>
                        <option value="FaQuestionCircle">❓ Question Circle</option>
                        <option value="FaExclamationCircle">❗ Exclamation Circle</option>
                        <option value="FaPlusCircle">➕ Plus Circle</option>
                        <option value="FaMinusCircle">➖ Minus Circle</option>
                        <option value="FaPlayCircle">▶️ Play Circle</option>
                        <option value="FaPauseCircle">⏸️ Pause Circle</option>
                        <option value="FaStopCircle">⏹️ Stop Circle</option>
                        <option value="FaUser">👤 User</option>
                        <option value="FaUsers">👥 Users</option>
                        <option value="FaUserTie">👔 User Tie</option>
                        <option value="FaUserGraduate">🎓 User Graduate</option>
                        <option value="FaUserCog">⚙️ User Cog</option>
                        <option value="FaUserShield">🛡️ User Shield</option>
                        <option value="FaUserCheck">✓ User Check</option>
                        <option value="FaUserPlus">➕ User Plus</option>
                        <option value="FaUserMinus">➖ User Minus</option>
                        <option value="FaUserTimes">✗ User Times</option>
                        <option value="FaUserEdit">✏️ User Edit</option>
                        <option value="FaUserClock">⏰ User Clock</option>
                        <option value="FaUserLock">🔒 User Lock</option>
                        <option value="FaUserUnlock">🔓 User Unlock</option>
                        <option value="FaUserSecret">🤐 User Secret</option>
                        <option value="FaUserNinja">🥷 User Ninja</option>
                        <option value="FaUserAstronaut">👨‍🚀 User Astronaut</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon Color</label>
                      <select
                        value={loanTypeForm.iconColor}
                        onChange={(e) => setLoanTypeForm(prev => ({ ...prev, iconColor: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="text-blue-600">🔵 Blue</option>
                        <option value="text-green-600">🟢 Green</option>
                        <option value="text-amber-600">🟠 Amber</option>
                        <option value="text-purple-600">🟣 Purple</option>
                        <option value="text-red-600">🔴 Red</option>
                        <option value="text-yellow-600">🟡 Yellow</option>
                        <option value="text-orange-600">🟠 Orange</option>
                        <option value="text-indigo-600">🔷 Indigo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                      <select
                        value={loanTypeForm.bgColor}
                        onChange={(e) => setLoanTypeForm(prev => ({ ...prev, bgColor: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="bg-blue-50">🔵 Blue</option>
                        <option value="bg-green-50">🟢 Green</option>
                        <option value="bg-amber-50">🟠 Amber</option>
                        <option value="bg-purple-50">🟣 Purple</option>
                        <option value="bg-red-50">🔴 Red</option>
                        <option value="bg-yellow-50">🟡 Yellow</option>
                        <option value="bg-orange-50">🟠 Orange</option>
                        <option value="bg-indigo-50">🔷 Indigo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                      <input
                        type="number"
                        value={loanTypeForm.order === 0 ? '0' : loanTypeForm.order || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numValue = value === '' ? 0 : parseInt(value) || 0;
                          setLoanTypeForm(prev => ({ ...prev, order: numValue }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'stats' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                      <input
                        type="text"
                        value={statForm.value}
                        onChange={(e) => setStatForm(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="e.g., 50+"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                      <input
                        type="text"
                        value={statForm.label}
                        onChange={(e) => setStatForm(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="e.g., Loan Options"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                      <input
                        type="text"
                        value={statForm.icon}
                        onChange={(e) => setStatForm(prev => ({ ...prev, icon: e.target.value }))}
                        placeholder="e.g., FaPuzzlePiece"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon Color</label>
                      <select
                        value={statForm.iconColor}
                        onChange={(e) => setStatForm(prev => ({ ...prev, iconColor: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="text-blue-600">Blue</option>
                        <option value="text-green-600">Green</option>
                        <option value="text-yellow-600">Yellow</option>
                        <option value="text-purple-600">Purple</option>
                        <option value="text-red-600">Red</option>
                      </select>
                    </div>
                                         <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                               <input
                          type="number"
                          value={statForm.order === 0 ? '0' : statForm.order || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            const numValue = value === '' ? 0 : parseInt(value) || 0;
                            setStatForm(prev => ({ ...prev, order: numValue }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                    resetForms();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                                 <button
                   type="submit"
                   disabled={isLoading}
                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isLoading ? (
                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                   ) : (
                     <FaSave />
                   )}
                   {isLoading ? 'Saving...' : (editingItem ? 
                   (activeTab === 'banner' ? 'Update Banner' : 
                    activeTab === 'loan-types' ? 'Update Loan Type' : 
                    activeTab === 'stats' ? 'Update Statistic' : 'Update') : 
                   (activeTab === 'banner' ? 'Save Banner' : 
                    activeTab === 'loan-types' ? 'Save Loan Type' : 
                    activeTab === 'stats' ? 'Save Statistic' : 'Save'))}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
          </div>
        </div>
  );
};

export default AdminDashboard; 
