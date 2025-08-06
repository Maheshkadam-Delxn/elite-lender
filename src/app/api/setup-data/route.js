import connectDB from '../../../lib/mongodb';
import Banner from '../../../models/Banner';
import LoanType from '../../../models/LoanType';
import Stat from '../../../models/Stat';

export async function POST() {
  try {
    await connectDB();
    
    // Check if data already exists
    const existingBanner = await Banner.findOne({});
    const existingLoanTypes = await LoanType.findOne({});
    const existingStats = await Stat.findOne({});
    
    if (existingBanner && existingLoanTypes && existingStats) {
      return Response.json({ 
        success: false, 
        message: 'Default data already exists' 
      }, { status: 400 });
    }

    // Create default banner
    if (!existingBanner) {
      const banner = new Banner({
        title: "Get the Best Loan Rates!",
        subtitle: "Compare Plans & Save Money!",
        features: [
          { icon: "FaCheckCircle", text: "Lowest Rates", color: "text-green-500" },
          { icon: "FaClock", text: "Quick Approval", color: "text-blue-500" },
          { icon: "FaShieldAlt", text: "Trusted Lenders", color: "text-purple-500" }
        ],
        isActive: true
      });
      await banner.save();
    }

    // Create default loan types
    if (!existingLoanTypes) {
      const defaultLoanTypes = [
        { title: "Personal", description: "Loan", icon: "FaWallet", iconColor: "text-blue-600", bgColor: "bg-blue-50", link: "/loans/personal", order: 1 },
        { title: "Home", description: "Loan", icon: "FaHome", iconColor: "text-green-600", bgColor: "bg-green-50", link: "/loans/home", order: 2 },
        { title: "Business", description: "Loan", icon: "FaBriefcase", iconColor: "text-amber-600", bgColor: "bg-amber-50", link: "/loans/business", order: 3 },
        { title: "Education", description: "Loan", icon: "FaGraduationCap", iconColor: "text-purple-600", bgColor: "bg-purple-50", link: "/loans/education", order: 4 },
        { title: "Vehicle", description: "Loan", icon: "FaCar", iconColor: "text-red-600", bgColor: "bg-red-50", link: "/loans/vehicle", order: 5 },
        { title: "Gold", description: "Loan", icon: "FaGem", iconColor: "text-yellow-600", bgColor: "bg-yellow-50", link: "/loans/gold", order: 6 }
      ];

      for (const loanTypeData of defaultLoanTypes) {
        const loanType = new LoanType(loanTypeData);
        await loanType.save();
      }
    }

    // Create default stats
    if (!existingStats) {
      const defaultStats = [
        { value: "50+", label: "Loan Options", icon: "FaPuzzlePiece", iconColor: "text-blue-600", order: 1 },
        { value: "95%", label: "Approval Rate", icon: "FaTrophy", iconColor: "text-green-600", order: 2 },
        { value: "4.8", label: "Customer Rating", icon: "FaStar", iconColor: "text-yellow-600", order: 3 }
      ];

      for (const statData of defaultStats) {
        const stat = new Stat(statData);
        await stat.save();
      }
    }

    return Response.json({ 
      success: true, 
      message: 'Default data created successfully' 
    });
  } catch (error) {
    console.error('Error setting up data:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 