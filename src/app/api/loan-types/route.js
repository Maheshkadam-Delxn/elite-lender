import connectDB from '../../../lib/mongodb';
import LoanType from '../../../models/LoanType';

export async function GET() {
  try {
    await connectDB();
    const loanTypes = await LoanType.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    
    // Default loan types that should always be available
    const defaultLoanTypes = [
      { 
        _id: "personal",
        title: "Personal", 
        subtitle: "Flexible financing for your needs",
        description: "Get the financial support you need with our personal loan options. Whether it's for medical expenses, debt consolidation, or any personal need, we offer competitive rates and flexible terms.", 
        typesOfLoan: ["Personal Loan", "Debt Consolidation", "Medical Loan"],
        features: [
          { icon: "FaCheckCircle", text: "Quick approval process", color: "text-green-500" },
          { icon: "FaStar", text: "Competitive interest rates", color: "text-blue-500" },
          { icon: "FaShieldAlt", text: "No collateral required", color: "text-purple-500" }
        ],
        icon: "FaWallet", 
        iconColor: "text-blue-600", 
        bgColor: "bg-blue-50", 
        order: 1,
        loanAmount: { min: "₹50,000", max: "₹25,00,000" },
        interestRate: { min: "10.49%", max: "24% p.a." },
        tenure: { min: "12 months", max: "60 months" },
        eligibility: [
          "Age between 21-58 years",
          "Minimum monthly income ₹25,000",
          "Good credit score (750+)",
          "Stable employment history"
        ],
        documents: [
          "PAN Card",
          "Aadhaar Card",
          "Salary slips (last 3 months)",
          "Bank statements (last 6 months)",
          "Address proof"
        ]
      },
      { 
        _id: "home",
        title: "Home", 
        subtitle: "Make your dream home a reality",
        description: "Turn your dream of owning a home into reality with our comprehensive home loan solutions. We offer competitive rates, flexible repayment options, and dedicated support throughout your home buying journey.", 
        typesOfLoan: ["Home Loan", "Construction Loan", "Home Improvement"],
        features: [
          { icon: "FaHome", text: "Low interest rates", color: "text-green-500" },
          { icon: "FaHandshake", text: "Flexible repayment terms", color: "text-blue-500" },
          { icon: "FaShieldAlt", text: "Government subsidies available", color: "text-purple-500" }
        ],
        icon: "FaHome", 
        iconColor: "text-green-600", 
        bgColor: "bg-green-50", 
        order: 2,
        loanAmount: { min: "₹5,00,000", max: "₹5,00,00,000" },
        interestRate: { min: "8.40%", max: "12% p.a." },
        tenure: { min: "5 years", max: "30 years" },
        eligibility: [
          "Age between 21-65 years",
          "Minimum monthly income ₹35,000",
          "Good credit score (750+)",
          "Property should be approved by bank"
        ],
        documents: [
          "PAN Card",
          "Aadhaar Card",
          "Salary slips (last 6 months)",
          "Bank statements (last 12 months)",
          "Property documents",
          "NOC from builder/society"
        ]
      },
      { 
        _id: "business",
        title: "Business", 
        subtitle: "Fuel your business growth",
        description: "Accelerate your business growth with our tailored business loan solutions. From working capital to equipment financing, we provide the financial support your business needs to thrive and expand.", 
        typesOfLoan: ["Business Loan", "Working Capital", "Equipment Finance"],
        features: [
          { icon: "FaRocket", text: "Fast business expansion", color: "text-green-500" },
          { icon: "FaChartLine", text: "Competitive business rates", color: "text-blue-500" },
          { icon: "FaHandshake", text: "Dedicated business support", color: "text-purple-500" }
        ],
        icon: "FaBriefcase", 
        iconColor: "text-amber-600", 
        bgColor: "bg-amber-50", 
        order: 3,
        loanAmount: { min: "₹10,00,000", max: "₹2,00,00,000" },
        interestRate: { min: "12%", max: "18% p.a." },
        tenure: { min: "12 months", max: "84 months" },
        eligibility: [
          "Business should be 3+ years old",
          "Minimum annual turnover ₹50 lakhs",
          "Good business credit history",
          "Proper business documentation"
        ],
        documents: [
          "Business PAN Card",
          "GST Registration",
          "Business license",
          "Financial statements (last 3 years)",
          "Bank statements (last 12 months)",
          "Business plan"
        ]
      },
      { 
        _id: "education",
        title: "Education", 
        subtitle: "Invest in your future",
        description: "Invest in your future with our education loan solutions. Whether you're pursuing higher studies in India or abroad, we provide comprehensive financing options to support your educational aspirations.", 
        typesOfLoan: ["Education Loan", "Student Loan", "Course Finance"],
        features: [
          { icon: "FaGraduationCap", text: "Study anywhere in the world", color: "text-green-500" },
          { icon: "FaClock", text: "Pay after course completion", color: "text-blue-500" },
          { icon: "FaHeart", text: "Special student benefits", color: "text-purple-500" }
        ],
        icon: "FaGraduationCap", 
        iconColor: "text-purple-600", 
        bgColor: "bg-purple-50", 
        order: 4,
        loanAmount: { min: "₹2,00,000", max: "₹50,00,000" },
        interestRate: { min: "8.50%", max: "14% p.a." },
        tenure: { min: "Course duration + 1 year", max: "15 years" },
        eligibility: [
          "Age between 16-35 years",
          "Admission to recognized institution",
          "Good academic record",
          "Co-applicant required (parent/guardian)"
        ],
        documents: [
          "Student PAN Card",
          "Admission letter",
          "Academic records",
          "Co-applicant documents",
          "Course fee structure",
          "Income proof of co-applicant"
        ]
      },
      { 
        _id: "vehicle",
        title: "Vehicle", 
        subtitle: "Drive your dreams",
        description: "Get behind the wheel of your dream vehicle with our comprehensive auto loan solutions. We offer competitive rates, quick processing, and flexible repayment options for all types of vehicles.", 
        typesOfLoan: ["Car Loan", "Two Wheeler Loan", "Commercial Vehicle"],
        features: [
          { icon: "FaCar", text: "100% on-road funding", color: "text-green-500" },
          { icon: "FaClock", text: "Quick disbursement", color: "text-blue-500" },
          { icon: "FaShieldAlt", text: "Comprehensive insurance", color: "text-purple-500" }
        ],
        icon: "FaCar", 
        iconColor: "text-red-600", 
        bgColor: "bg-red-50", 
        order: 5,
        loanAmount: { min: "₹1,00,000", max: "₹50,00,000" },
        interestRate: { min: "9.50%", max: "16% p.a." },
        tenure: { min: "12 months", max: "84 months" },
        eligibility: [
          "Age between 21-65 years",
          "Minimum monthly income ₹25,000",
          "Good credit score (700+)",
          "Valid driving license"
        ],
        documents: [
          "PAN Card",
          "Aadhaar Card",
          "Salary slips (last 3 months)",
          "Bank statements (last 6 months)",
          "Driving license",
          "Vehicle quotation"
        ]
      },
      { 
        _id: "gold",
        title: "Gold", 
        subtitle: "Secure your wealth",
        description: "Unlock the value of your gold assets with our secure gold loan solutions. Get instant cash against your gold jewelry with competitive interest rates and flexible repayment options.", 
        typesOfLoan: ["Gold Loan", "Jewelry Loan", "Gold Investment"],
        features: [
          { icon: "FaGem", text: "High loan-to-value ratio", color: "text-green-500" },
          { icon: "FaClock", text: "Instant loan approval", color: "text-blue-500" },
          { icon: "FaShieldAlt", text: "Safe gold storage", color: "text-purple-500" }
        ],
        icon: "FaGem", 
        iconColor: "text-yellow-600", 
        bgColor: "bg-yellow-50", 
        order: 6,
        loanAmount: { min: "₹10,000", max: "₹50,00,000" },
        interestRate: { min: "7.50%", max: "12% p.a." },
        tenure: { min: "3 months", max: "36 months" },
        eligibility: [
          "Age between 18-70 years",
          "Valid gold jewelry ownership",
          "Gold purity 18K or above",
          "No minimum income requirement"
        ],
        documents: [
          "PAN Card",
          "Aadhaar Card",
          "Gold jewelry for pledge",
          "Gold purity certificate",
          "Address proof"
        ]
      }
    ];
    
    // Combine database records with default types
    const allLoanTypes = [...defaultLoanTypes, ...loanTypes];
    
    return Response.json({ success: true, data: allLoanTypes });
  } catch (error) {
    console.error('Error fetching loan types:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    console.log('📥 Received data:', JSON.stringify(body, null, 2));
    
    // Create loan type data with explicit field handling
    const loanTypeData = {
      title: body.title,
      subtitle: body.subtitle || '',
      description: body.description,
      typesOfLoan: body.typesOfLoan || [],
      features: body.features || [],
      icon: body.icon,
      iconColor: body.iconColor || 'text-blue-600',
      bgColor: body.bgColor || 'bg-blue-50',
      link: body.link || '', // Explicitly set link field
      order: body.order || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
      loanAmount: body.loanAmount || { min: '', max: '' },
      interestRate: body.interestRate || { min: '', max: '' },
      tenure: body.tenure || { min: '', max: '' },
      eligibility: body.eligibility || [],
      documents: body.documents || []
    };
    
    console.log('🔧 Processed data:', JSON.stringify(loanTypeData, null, 2));
    
    // Use create method with all fields including link
    const loanType = await LoanType.create({
      title: loanTypeData.title,
      subtitle: loanTypeData.subtitle,
      description: loanTypeData.description,
      typesOfLoan: loanTypeData.typesOfLoan,
      features: loanTypeData.features,
      icon: loanTypeData.icon,
      iconColor: loanTypeData.iconColor,
      bgColor: loanTypeData.bgColor,
      order: loanTypeData.order,
      isActive: loanTypeData.isActive,
      link: loanTypeData.link,
      loanAmount: loanTypeData.loanAmount,
      interestRate: loanTypeData.interestRate,
      tenure: loanTypeData.tenure,
      eligibility: loanTypeData.eligibility,
      documents: loanTypeData.documents
    });
    
    console.log('✅ Saved successfully:', loanType._id);
    return Response.json({ success: true, data: loanType });
  } catch (error) {
    console.error('❌ Error creating loan type:', error);
    console.error('❌ Error details:', error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
} 