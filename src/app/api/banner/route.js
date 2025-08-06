import connectDB from '../../../lib/mongodb';
import Banner from '../../../models/Banner';

export async function GET(request) {
  try {
    await connectDB();
    
    // Add cache control headers to prevent caching
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
    const banner = await Banner.findOne({ isActive: true }).sort({ createdAt: -1 });
    
    if (!banner) {
      // Return default banner if none exists
      return Response.json({
        success: true,
        data: {
          title: "Get the Best Loan Rates!",
          subtitle: "Compare Plans & Save Money!",
          bgColor: "bg-blue-600",
          images: [],
          features: [
            { icon: "FaCheckCircle", text: "Lowest Rates", color: "text-green-500" },
            { icon: "FaClock", text: "Quick Approval", color: "text-blue-500" },
            { icon: "FaShieldAlt", text: "Trusted Lenders", color: "text-purple-500" }
          ]
        }
      }, { headers });
    }

    console.log('📤 Returning banner data:', JSON.stringify(banner, null, 2));
    console.log('🖼️ Banner images in response:', banner.images);
    console.log('🖼️ Banner images count in response:', banner.images?.length);
    return Response.json({ success: true, data: banner }, { headers });
  } catch (error) {
    console.error('Error fetching banner:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    console.log('🎨 Received banner data:', JSON.stringify(body, null, 2));
    console.log('🎨 Background color:', body.bgColor);
    console.log('🔧 Features:', body.features);
    console.log('🖼️ Images:', body.images);
    console.log('🖼️ Images count:', body.images?.length);
    
    // Deactivate all existing banners
    await Banner.updateMany({}, { isActive: false });
    
    // Create new banner
    const banner = new Banner(body);
    await banner.save();
    
    console.log('✅ Saved banner:', JSON.stringify(banner, null, 2));
    
    return Response.json({ success: true, data: banner });
  } catch (error) {
    console.error('Error creating banner:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
} 