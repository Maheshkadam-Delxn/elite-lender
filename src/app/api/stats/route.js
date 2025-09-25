import connectDB from '../../../lib/mongodb';
import Stat from '../../../models/Stat';

export async function GET() {
  try {
    await connectDB();
    const stats = await Stat.find({ isActive: true }).sort({ order: 1, createdAt: 1 });

    // Default stats that should always be shown alongside DB stats
    const defaultStats = [
      { value: "50+", label: "Loan Options", icon: "FaPuzzlePiece", iconColor: "text-blue-600" },
      { value: "95%", label: "Approval Rate", icon: "FaTrophy", iconColor: "text-green-600" },
      { value: "4.8", label: "Customer Rating", icon: "FaStar", iconColor: "text-yellow-600" }
    ];

    // If no DB stats, return defaults
    if (stats.length === 0) {
      return Response.json({ success: true, data: defaultStats });
    }

    // Merge defaults with DB stats; DB can override by label
    const labels = new Set(stats.map(s => s.label));
    const merged = [
      ...defaultStats.filter(d => !labels.has(d.label)),
      ...stats,
    ];

    return Response.json({ success: true, data: merged });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const stat = new Stat(body);
    await stat.save();
    
    return Response.json({ success: true, data: stat });
  } catch (error) {
    console.error('Error creating stat:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
} 