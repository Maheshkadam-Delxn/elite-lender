import connectDB from '../../../lib/mongodb';
import Admin from '../../../models/Admin';

export async function POST() {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return Response.json({ 
        success: false, 
        message: 'Admin user already exists' 
      }, { status: 400 });
    }

    // Create default admin user
    const admin = new Admin({
      username: 'admin',
      email: 'admin@elitelender.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'super_admin'
    });

    await admin.save();

    return Response.json({ 
      success: true, 
      message: 'Default admin user created successfully',
      data: {
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 