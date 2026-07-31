import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";
import fs from 'fs/promises';
import path from 'path';
import connectDB from '../../../../lib/mongodb';
import Enquiry from '../../../../models/Enquiry';

// Ensure Node.js runtime (googleapis not supported on Edge runtime)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '50mb'
  }
};

// Token storage: persisted to disk to avoid repeated OAuth prompts
let oauthTokens = null;
const TOKEN_PATH = process.env.GOOGLE_OAUTH_TOKEN_PATH || path.join(process.cwd(), 'google-oauth-token.json');

async function loadTokensFromDisk() {
  try {
    const raw = await fs.readFile(TOKEN_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.access_token || parsed.refresh_token)) {
      oauthTokens = parsed;
      try {
        const auth = getOAuthClient();
        auth.setCredentials(parsed);
      } catch (_) {}
      return parsed;
    }
  } catch (_) {
    // ignore if not found or invalid
  }
  return null;
}

async function saveTokensToDisk(tokens) {
  try {
    const dir = path.dirname(TOKEN_PATH);
    try { await fs.mkdir(dir, { recursive: true }); } catch (_) {}
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2), 'utf8');
  } catch (e) {
    console.warn('⚠️ Failed to persist OAuth tokens:', e?.message);
  }
}

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/quickloan/submit'
  );
}

export async function POST(req) {
  try {
    console.log('🔍 Starting API request...');

    // Use OAuth (previous behavior)
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json({ 
        success: false, 
        error: 'OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.' 
      }, { status: 400 });
    }

    // Load tokens (from disk) if not already in memory
    if (!oauthTokens) {
      await loadTokensFromDisk();
    }

    if (!oauthTokens) {
      const authUrl = getOAuthClient().generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.metadata.readonly',
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/spreadsheets'
        ],
        include_granted_scopes: true,
        prompt: 'consent'
      });
      
      return NextResponse.json({ 
        success: false, 
        error: 'OAuth authentication required.',
        authUrl: authUrl
      }, { status: 401 });
    }

    const auth = getOAuthClient();
    auth.setCredentials(oauthTokens);

    // Identify which Google account is authorized
    let authorizedEmail = '';
    try {
      const oauth2 = google.oauth2({ version: 'v2', auth });
      const me = await oauth2.userinfo.get();
      authorizedEmail = me?.data?.email || '';
      console.log('👤 Authorized Google account:', authorizedEmail || 'unknown');
    } catch ( e) {
      console.warn('⚠️ Could not fetch authorized user info:', e?.message);
    }

    const formData = await req.formData();
    console.log('✅ Form data parsed successfully');

    // Extract all form data
    const data = {
      customerName: formData.get('customerName') || '',
      fatherName: formData.get('fatherName') || '',
      motherName: formData.get('motherName') || '',
      maritalStatus: formData.get('maritalStatus') || '',
      spouseName: formData.get('spouseName') || '',
      contactNumber: formData.get('contactNumber') || '',
      altContactNumber: formData.get('altContactNumber') || '',
      highestEducation: formData.get('highestEducation') || '',
      institutionName: formData.get('institutionName') || '',
      personalEmail: formData.get('personalEmail') || '',
      officialEmail: formData.get('officialEmail') || '',
      currentAddress: formData.get('currentAddress') || '',
      permanentAddress: formData.get('permanentAddress') || '',
      officeAddress: formData.get('officeAddress') || '',
      companyName: formData.get('companyName') || '',
      dateOfJoining: formData.get('dateOfJoining') || '',
      designation: formData.get('designation') || '',
      totalWorkExp: formData.get('totalWorkExp') || '',
      ref1Name: formData.get('ref1Name') || '',
      ref1Contact: formData.get('ref1Contact') || '',
      ref1Address: formData.get('ref1Address') || '',
      ref2Name: formData.get('ref2Name') || '',
      ref2Contact: formData.get('ref2Contact') || '',
      ref2Address: formData.get('ref2Address') || '',
      loanAmount: formData.get('loanAmount') || '',
      loanTenure: formData.get('loanTenure') || '',
      loanPurpose: formData.get('loanPurpose') || '',
    };

    console.log('📝 Form data extracted:', Object.keys(data).length, 'fields');

    // Get files
    const aadhar = formData.get('aadhar');
    const pan = formData.get('pan');
    const salarySlips = formData.get('salarySlips');
    const bankStatement = formData.get('bankStatement');

    console.log('📁 Files received - Aadhar:', !!aadhar, 'PAN:', !!pan, 'Salary:', !!salarySlips, 'Bank:', !!bankStatement);

    // Google configuration from environment variables
    const manualFolderId = process.env.MANUAL_GOOGLE_DRIVE_FOLDER_ID;

    console.log('🔧 Environment variables check:');
    console.log('   Manual Folder ID:', manualFolderId ? '✅ Present' : '❌ Missing');
    console.log('   OAuth Client ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Present' : '❌ Missing');

    if (!manualFolderId) {
      console.log('❌ Missing configuration: MANUAL_GOOGLE_DRIVE_FOLDER_ID');
      return NextResponse.json({
        success: false,
        error: 'Missing configuration: MANUAL_GOOGLE_DRIVE_FOLDER_ID'
      }, { status: 400 });
    }

    const drive = google.drive({ version: "v3", auth });

    console.log('✅ Google Drive client initialized with OAuth');

    const targetFolderId = manualFolderId;
    console.log('📁 Using folder ID:', targetFolderId);

    // Verify the folder exists and is accessible (strict)
    try {
      console.log('🔍 Verifying folder access...');
      await drive.files.get({
        fileId: targetFolderId,
        fields: 'id,name',
        supportsAllDrives: true,
      });
      console.log('✅ Folder is accessible');
    } catch (folderError) {
      console.error('❌ Folder is not accessible:', folderError.message);
      return NextResponse.json({ 
        success: false, 
        error: `The folder (${targetFolderId}) is not accessible. Please check:\n` +
        `1. The folder exists in Google Drive (My Drive or Shared Drive)\n` +
        `2. The authorized account ${authorizedEmail || '(unknown)'} has at least Editor access\n` +
        `3. The folder ID is correct\n` +
        `4. If it is a Shared Drive, ensure membership and try again` 
      }, { status: 400 });
    }

    // Upload function for files
    async function uploadToDrive(file, label) {
      if (!file || typeof file === 'string') {
        console.log(`📭 No file provided for ${label}`);
        return '';
      }
      
      try {
        console.log(`📤 Starting upload for ${label}...`);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const stream = Readable.from(buffer);

        const fileName = `${Date.now()}_${data.customerName}_${(file.name || label || 'file').replace(/[^a-zA-Z0-9._-]/g, '_')}`;

        console.log(`📄 Uploading ${label}: ${fileName} to folder: ${targetFolderId}`);

        const fileMetadata = {
          name: fileName,
          parents: [targetFolderId],
        };

        console.log(`🔄 Creating file in Drive for ${label}...`);
        const response = await drive.files.create({
          requestBody: fileMetadata,
          media: { 
            mimeType: file.type || 'application/octet-stream', 
            body: stream 
          },
          fields: "id,webViewLink",
          supportsAllDrives: true,
        });

        console.log(`✅ File created for ${label}: ${response.data.id}`);

        // Make the file publicly accessible
        try {
          console.log(`🔓 Setting permissions for ${label}...`);
          await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
              role: 'reader',
              type: 'anyone'
            },
            supportsAllDrives: true,
          });
          console.log(`✅ Permissions set for ${label}`);
        } catch (permError) {
          console.warn(`⚠️ Could not set permissions for ${label}:`, permError.message);
        }

        console.log(`🎉 Successfully uploaded ${label}: ${response.data.id}`);
        return response.data.webViewLink || `https://drive.google.com/file/d/${response.data.id}/view`;
      } catch (error) {
        console.error(`💥 Error uploading ${label}:`, error);
        throw new Error(`Failed to upload ${label}: ${error.message}`);
      }
    }

    // Upload all files in parallel (strict)
    console.log('🚀 Starting file uploads...');
    let aadharLink = '', panLink = '', salaryLink = '', bankLink = '';
    try {
      [aadharLink, panLink, salaryLink, bankLink] = await Promise.all([
        uploadToDrive(aadhar, 'Aadhar'),
        uploadToDrive(pan, 'PAN'),
        uploadToDrive(salarySlips, 'SalarySlips'),
        uploadToDrive(bankStatement, 'BankStatement'),
      ]);
      console.log('✅ All files uploaded successfully');
    } catch (uploadError) {
      console.error('💥 File upload failed:', uploadError);
      return NextResponse.json({ 
        success: false, 
        error: uploadError.message 
      }, { status: 500 });
    }

    // Save application data + file links to MongoDB
    console.log('📊 Saving application to MongoDB...');
    try {
      await connectDB();
      await Enquiry.create({
        source: 'quick-loan',
        name: data.customerName,
        mobile: data.contactNumber,
        loanType: 'Quick Loan',
        loanAmount: data.loanAmount,
        fatherName: data.fatherName,
        motherName: data.motherName,
        maritalStatus: data.maritalStatus,
        spouseName: data.spouseName,
        altContactNumber: data.altContactNumber,
        highestEducation: data.highestEducation,
        institutionName: data.institutionName,
        personalEmail: data.personalEmail,
        officialEmail: data.officialEmail,
        currentAddress: data.currentAddress,
        permanentAddress: data.permanentAddress,
        officeAddress: data.officeAddress,
        companyName: data.companyName,
        dateOfJoining: data.dateOfJoining,
        designation: data.designation,
        totalWorkExp: data.totalWorkExp,
        ref1Name: data.ref1Name,
        ref1Contact: data.ref1Contact,
        ref1Address: data.ref1Address,
        ref2Name: data.ref2Name,
        ref2Contact: data.ref2Contact,
        ref2Address: data.ref2Address,
        loanTenure: data.loanTenure,
        loanPurpose: data.loanPurpose,
        aadharLink,
        panLink,
        salarySlipsLink: salaryLink,
        bankStatementLink: bankLink
      });
      console.log('✅ Application saved to MongoDB');
    } catch (dbError) {
      console.error('💥 MongoDB save error:', dbError);
      return NextResponse.json({
        success: false,
        error: `Failed to save application: ${dbError.message}`
      }, { status: 500 });
    }

    console.log('🎉 Request completed successfully!');
    return NextResponse.json({
      success: true,
      message: 'Loan application submitted successfully!',
      data: {
        fileLinks: {
          aadhar: aadharLink,
          pan: panLink,
          salarySlips: salaryLink,
          bankStatement: bankLink
        }
      }
    });

  } catch (error) {
    console.error("💥 General error:", error);
    
    let errorMessage = error.message;
    if (error.code === 401) {
      // Only clear tokens if we don't have a refresh token to auto-refresh
      if (!oauthTokens?.refresh_token) {
        oauthTokens = null;
        await saveTokensToDisk({});
        errorMessage = "Authentication expired. Please re-authenticate.";
      } else {
        errorMessage = "Temporary auth error. Please retry.";
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}

// Handle OAuth callback
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    
    if (code) {
      console.log('🔐 Processing OAuth callback with code...');
      
      const auth = getOAuthClient();
      const { tokens } = await auth.getToken(code);
      
      // Merge with existing to preserve refresh_token if absent
      const existing = oauthTokens || {};
      const merged = { ...existing, ...tokens };
      if (!merged.refresh_token && existing.refresh_token) {
        merged.refresh_token = existing.refresh_token;
      }

      // Store and persist
      oauthTokens = merged;
      auth.setCredentials(merged);
      await saveTokensToDisk(merged);
      
      console.log('✅ OAuth authentication successful!');
      
      // Redirect back to the quickloan page after successful auth
      return NextResponse.redirect(new URL('/quickloan', req.url));
    }
    
    // If no code, return auth URL
    const authUrl = getOAuthClient().generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets'
      ],
      prompt: 'consent'
    });
    
    return NextResponse.json({ 
      success: false, 
      message: 'OAuth authentication required',
      authUrl: authUrl
    });
    
  } catch (error) {
    console.error('💥 OAuth error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'OAuth authentication failed: ' + error.message 
    }, { status: 400 });
  }
}
