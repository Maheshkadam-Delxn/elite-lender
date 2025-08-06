import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(request) {
  try {
    console.log('📤 Starting image upload process...');
    
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      console.error('❌ No image file provided');
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    console.log('📁 File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file type. Please upload JPEG, PNG, or WebP images only.' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size, 'bytes');
      return NextResponse.json({ 
        success: false, 
        error: 'File size too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;
    
    // Save to public/uploads/banners directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'banners');
    const filePath = path.join(uploadDir, fileName);
    
    console.log('📁 Upload directory:', uploadDir);
    console.log('📁 File path:', filePath);
    
    // Ensure directory exists
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('✅ Created upload directory:', uploadDir);
      } else {
        console.log('✅ Upload directory exists:', uploadDir);
      }
    } catch (dirError) {
      console.error('❌ Error creating directory:', dirError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create upload directory' 
      }, { status: 500 });
    }
    
    // Write file
    try {
      await writeFile(filePath, buffer);
      console.log('✅ File written successfully:', filePath);
    } catch (writeError) {
      console.error('❌ Error writing file:', writeError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to save image file' 
      }, { status: 500 });
    }
    
    const imageUrl = `/uploads/banners/${fileName}`;
    
    console.log('✅ Image uploaded successfully:', {
      url: imageUrl,
      filename: fileName,
      size: file.size,
      type: file.type,
      filePath: filePath
    });
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        url: imageUrl,
        filename: fileName,
        size: file.size,
        type: file.type
      }
    });
    
  } catch (error) {
    console.error('❌ Image upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload image: ' + error.message 
    }, { status: 500 });
  }
} 