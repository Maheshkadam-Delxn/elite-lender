import connectDB from '../../../../lib/mongodb';
import Admin from '../../../../models/Admin';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await connectDB();
    const { username, password } = await request.json();

    // Find admin by username
    const admin = await Admin.findOne({ username, isActive: true });
    
    if (!admin) {
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Return admin data (without password)
    const adminData = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      lastLogin: admin.lastLogin
    };

    return Response.json({ success: true, data: adminData });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
} 