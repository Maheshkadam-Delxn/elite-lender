import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";
import fs from 'fs/promises';
import path from 'path';

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

// Eagerly attempt to load tokens at module init
loadTokensFromDisk().catch(() => {});

// Initialize OAuth2 client
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

    // Check if OAuth is configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json({ 
        success: false, 
        error: 'OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.' 
      }, { status: 400 });
    }

    // Check if we have valid tokens (try load from disk first)
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
    } catch (e) {
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
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const manualFolderId = process.env.MANUAL_GOOGLE_DRIVE_FOLDER_ID;

    console.log('🔧 Environment variables check:');
    console.log('   Spreadsheet ID:', spreadsheetId ? '✅ Present' : '❌ Missing');
    console.log('   Manual Folder ID:', manualFolderId ? '✅ Present' : '❌ Missing');
    console.log('   OAuth Client ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Present' : '❌ Missing');

    if (!spreadsheetId || !manualFolderId) {
      const missing = [];
      if (!spreadsheetId) missing.push('GOOGLE_SHEETS_SPREADSHEET_ID');
      if (!manualFolderId) missing.push('MANUAL_GOOGLE_DRIVE_FOLDER_ID');
      
      console.log('❌ Missing configuration:', missing);
      return NextResponse.json({ 
        success: false, 
        error: `Missing configuration: ${missing.join(', ')}` 
      }, { status: 400 });
    }

    const drive = google.drive({ version: "v3", auth });
    const sheets = google.sheets({ version: "v4", auth });

    console.log('✅ Google API clients initialized with OAuth');

    const targetFolderId = manualFolderId;
    console.log('📁 Using folder ID:', targetFolderId);

    // Verify the folder exists and is accessible
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

    // Upload all files in parallel
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

    // Prepare data for Google Sheets
    console.log('📊 Preparing data for Google Sheets...');
    const now = new Date();
    const values = [[
      now.toLocaleString('en-IN'),
      data.customerName,
      data.fatherName,
      data.motherName,
      data.maritalStatus,
      data.spouseName,
      data.contactNumber,
      data.altContactNumber,
      data.highestEducation,
      data.institutionName,
      data.personalEmail,
      data.officialEmail,
      data.currentAddress,
      data.permanentAddress,
      data.officeAddress,
      data.companyName,
      data.dateOfJoining,
      data.designation,
      data.totalWorkExp,
      data.ref1Name,
      data.ref1Contact,
      data.ref1Address,
      data.ref2Name,
      data.ref2Contact,
      data.ref2Address,
      data.loanAmount,
      data.loanTenure,
      data.loanPurpose,
      aadharLink,
      panLink,
      salaryLink,
      bankLink,
    ]];

    console.log('📈 Data prepared for sheets, row length:', values[0].length);

    // Google Sheets operations
    const sheetName = 'Quick Loan';
    
    try {
      console.log('📋 Checking if sheet exists...');
      // Check if sheet exists
      const meta = await sheets.spreadsheets.get({ spreadsheetId });
      const exists = (meta.data.sheets || []).some(s => s.properties?.title === sheetName);
      
      if (!exists) {
        console.log('📝 Creating new sheet:', sheetName);
        // Create new sheet
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: { 
            requests: [{ 
              addSheet: { 
                properties: { title: sheetName } 
              } 
            }] 
          }
        });
        
        // Add headers
        const header = [[
          'Date Time', 'Customer Name', 'Father Name', 'Mother Name', 'Marital Status', 'Spouse Name', 
          'Contact Number', 'Alt Contact', 'Highest Education', 'Institution', 'Personal Email', 
          'Official Email', 'Current Address', 'Permanent Address', 'Office Address', 'Company Name', 
          'Date Of Joining', 'Designation', 'Total Work Exp', 'Ref1 Name', 'Ref1 Contact', 'Ref1 Address', 
          'Ref2 Name', 'Ref2 Contact', 'Ref2 Address', 'Loan Amount', 'Loan Tenure', 'Loan Purpose', 
          'Aadhar Link', 'PAN Link', 'Salary Slips Link', 'Bank Statement Link'
        ]];
        // Compute the proper end column for the header length
        const toColumnLetter = (num) => {
          let s = '';
          while (num > 0) {
            const mod = (num - 1) % 26;
            s = String.fromCharCode(65 + mod) + s;
            num = Math.floor((num - 1) / 26);
          }
          return s;
        };
        const headerEndCol = toColumnLetter(header[0].length);
        
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetName}!A1:${headerEndCol}1`,
          valueInputOption: 'RAW',
          requestBody: { values: header }
        });
        console.log('✅ Headers added to sheet');

        // Freeze the header row and make only header bold
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                updateSheetProperties: {
                  properties: { title: sheetName, gridProperties: { frozenRowCount: 1 } },
                  fields: 'gridProperties.frozenRowCount,title'
                }
              },
              {
                repeatCell: {
                  range: { sheetId: (await sheets.spreadsheets.get({ spreadsheetId })).data.sheets.find(s => s.properties.title === sheetName).properties.sheetId, startRowIndex: 0, endRowIndex: 1 },
                  cell: { userEnteredFormat: { textFormat: { bold: true } } },
                  fields: 'userEnteredFormat.textFormat.bold'
                }
              }
            ]
          }
        });
        console.log('✅ Header row frozen and formatted');
      }

      // Ensure header exists and is correct on existing sheet
      if (exists) {
        const expectedHeader = [
          'Date Time', 'Customer Name', 'Father Name', 'Mother Name', 'Marital Status', 'Spouse Name',
          'Contact Number', 'Alt Contact', 'Highest Education', 'Institution', 'Personal Email',
          'Official Email', 'Current Address', 'Permanent Address', 'Office Address', 'Company Name',
          'Date Of Joining', 'Designation', 'Total Work Exp', 'Ref1 Name', 'Ref1 Contact', 'Ref1 Address',
          'Ref2 Name', 'Ref2 Contact', 'Ref2 Address', 'Loan Amount', 'Loan Tenure', 'Loan Purpose',
          'Aadhar Link', 'PAN Link', 'Salary Slips Link', 'Bank Statement Link'
        ];
        const headerRead = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${sheetName}!1:1` });
        const currentHeader = headerRead.data.values?.[0] || [];
        const needsUpdate = expectedHeader.length !== currentHeader.length || expectedHeader.some((h, i) => (currentHeader[i] || '') !== h);
        if (needsUpdate) {
          const toColumnLetter = (num) => {
            let s = '';
            while (num > 0) {
              const mod = (num - 1) % 26;
              s = String.fromCharCode(65 + mod) + s;
              num = Math.floor((num - 1) / 26);
            }
            return s;
          };
          const endCol = toColumnLetter(expectedHeader.length);
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1:${endCol}1`,
            valueInputOption: 'RAW',
            requestBody: { values: [expectedHeader] }
          });
          console.log('🔧 Header updated to expected schema');

          // Freeze and bold again to be safe
          const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId });
          const sheetId = sheetMeta.data.sheets.find(s => s.properties.title === sheetName).properties.sheetId;
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [
                { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } },
                { repeatCell: { range: { sheetId, startRowIndex: 0, endRowIndex: 1 }, cell: { userEnteredFormat: { textFormat: { bold: true } } }, fields: 'userEnteredFormat.textFormat.bold' } }
              ]
            }
          });
        }
      }

      // Append the new row
      console.log('📤 Appending data to sheet...');
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:A`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values }
      });

      console.log('✅ Data successfully saved to Google Sheets');

    } catch (sheetsError) {
      console.error('💥 Sheets error:', sheetsError);
      let message = `Google Sheets error: ${sheetsError.message}`;
      // Provide clearer guidance for permission issues
      if (sheetsError?.code === 403 || /The caller does not have permission/i.test(sheetsError?.message || '')) {
        message = `Unable to access spreadsheet. Please:
1) Verify GOOGLE_SHEETS_SPREADSHEET_ID is correct
2) Share the spreadsheet with ${authorizedEmail || 'the authorized Google account'} as Editor
3) Ensure you completed OAuth with the same account (${authorizedEmail || 'unknown'})`;
      }
      return NextResponse.json({ 
        success: false, 
        error: message 
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



// import { NextResponse } from "next/server";
// import { google } from "googleapis";
// import { Readable } from "stream";

// export const config = {
//   api: {
//     bodyParser: false,
//     sizeLimit: '50mb'
//   }
// };

// export async function POST(req) {
//   try {
//     console.log('🔍 Starting API request...');
//     const formData = await req.formData();
//     console.log('✅ Form data parsed successfully');

//     // Extract all form data
//     const data = {
//       customerName: formData.get('customerName') || '',
//       fatherName: formData.get('fatherName') || '',
//       motherName: formData.get('motherName') || '',
//       maritalStatus: formData.get('maritalStatus') || '',
//       spouseName: formData.get('spouseName') || '',
//       contactNumber: formData.get('contactNumber') || '',
//       altContactNumber: formData.get('altContactNumber') || '',
//       highestEducation: formData.get('highestEducation') || '',
//       institutionName: formData.get('institutionName') || '',
//       personalEmail: formData.get('personalEmail') || '',
//       officialEmail: formData.get('officialEmail') || '',
//       currentAddress: formData.get('currentAddress') || '',
//       permanentAddress: formData.get('permanentAddress') || '',
//       officeAddress: formData.get('officeAddress') || '',
//       companyName: formData.get('companyName') || '',
//       dateOfJoining: formData.get('dateOfJoining') || '',
//       designation: formData.get('designation') || '',
//       totalWorkExp: formData.get('totalWorkExp') || '',
//       ref1Name: formData.get('ref1Name') || '',
//       ref1Contact: formData.get('ref1Contact') || '',
//       ref1Address: formData.get('ref1Address') || '',
//       ref2Name: formData.get('ref2Name') || '',
//       ref2Contact: formData.get('ref2Contact') || '',
//       ref2Address: formData.get('ref2Address') || '',
//       loanAmount: formData.get('loanAmount') || '',
//       loanTenure: formData.get('loanTenure') || '',
//       loanPurpose: formData.get('loanPurpose') || '',
//     };

//     console.log('📝 Form data extracted:', Object.keys(data).length, 'fields');

//     // Get files
//     const aadhar = formData.get('aadhar');
//     const pan = formData.get('pan');
//     const salarySlips = formData.get('salarySlips');
//     const bankStatement = formData.get('bankStatement');

//     console.log('📁 Files received - Aadhar:', !!aadhar, 'PAN:', !!pan, 'Salary:', !!salarySlips, 'Bank:', !!bankStatement);

//     // Google configuration from environment variables
//     const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
//     const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
//     const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;

//     // MANUAL FOLDER ID - Add this to your environment variables
//     const manualFolderId = process.env.MANUAL_GOOGLE_DRIVE_FOLDER_ID;

//     console.log('🔧 Environment variables check:');
//     console.log('   Spreadsheet ID:', spreadsheetId ? '✅ Present' : '❌ Missing');
//     console.log('   Client Email:', clientEmail ? '✅ Present' : '❌ Missing');
//     console.log('   Private Key:', privateKeyRaw ? '✅ Present' : '❌ Missing');
//     console.log('   Manual Folder ID:', manualFolderId ? '✅ Present' : '❌ Missing');

//     if (!spreadsheetId || !clientEmail || !privateKeyRaw || !manualFolderId) {
//       const missing = [];
//       if (!spreadsheetId) missing.push('GOOGLE_SHEETS_SPREADSHEET_ID');
//       if (!clientEmail) missing.push('GOOGLE_SERVICE_ACCOUNT_EMAIL');
//       if (!privateKeyRaw) missing.push('GOOGLE_PRIVATE_KEY');
//       if (!manualFolderId) missing.push('MANUAL_GOOGLE_DRIVE_FOLDER_ID');

//       console.log('❌ Missing configuration:', missing);
//       return NextResponse.json({
//         success: false,
//         error: `Missing configuration: ${missing.join(', ')}`
//       }, { status: 400 });
//     }

//     // Service Account credentials
//     console.log('🔐 Setting up service account credentials...');
//     const serviceAccountKey = {
//       type: "service_account",
//       project_id: "extreme-flux-471006-e5",
//       private_key_id: "ddaea3b9f246c10b0c4c50c9a13ac076421382c7",
//       private_key: privateKeyRaw.replace(/\\n/g, '\n'),
//       client_email: clientEmail,
//       client_id: "106289488560286468942",
//       auth_uri: "https://accounts.google.com/o/oauth2/auth",
//       token_uri: "https://oauth2.googleapis.com/token",
//       auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//       client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/elite-734%40extreme-flux-471006-e5.iam.gserviceaccount.com",
//       universe_domain: "googleapis.com"
//     };

//     // Authenticate with Google Drive API
//     console.log('🔑 Authenticating with Google API...');
//     const auth = new google.auth.GoogleAuth({
//       credentials: serviceAccountKey,
//       scopes: [
//         "https://www.googleapis.com/auth/drive.file",
//         "https://www.googleapis.com/auth/drive",
//         "https://www.googleapis.com/auth/spreadsheets"
//       ],
//     });

//     const drive = google.drive({ version: "v3", auth });
//     const sheets = google.sheets({ version: "v4", auth });

//     console.log('✅ Google API clients initialized');

//     // Use the manual folder ID directly
//     const targetFolderId = manualFolderId;
//     console.log('📁 Using manual folder ID:', targetFolderId);

//     // Verify the folder exists and is accessible
//     try {
//       console.log('🔍 Verifying folder access...');
//       await drive.files.get({
//         fileId: targetFolderId,
//         fields: 'id,name',
//       });
//       console.log('✅ Folder is accessible');
//     } catch (folderError) {
//       console.error('❌ Folder is not accessible:', folderError.message);
//       return NextResponse.json({
//         success: false,
//         error: `The folder (${targetFolderId}) is not accessible. Please check: 
//         1. The folder exists
//         2. It's shared with ${clientEmail} as "Editor"
//         3. The folder ID is correct`
//       }, { status: 400 });
//     }

//     // Upload function for files
//     // async function uploadToDrive(file, label) {
//     //   if (!file || typeof file === 'string') {
//     //     console.log(`📭 No file provided for ${label}`);
//     //     return '';
//     //   }

//     //   try {
//     //     console.log(`📤 Starting upload for ${label}...`);
//     //     const arrayBuffer = await file.arrayBuffer();
//     //     const buffer = Buffer.from(arrayBuffer);
//     //     const stream = Readable.from(buffer);

//     //     const fileName = `${Date.now()}_${data.customerName}_${(file.name || label || 'file').replace(/[^a-zA-Z0-9._-]/g, '_')}`;

//     //     console.log(`📄 Uploading ${label}: ${fileName} to folder: ${targetFolderId}`);

//     //     const fileMetadata = {
//     //       name: fileName,
//     //       parents: [targetFolderId],
//     //     };

//     //     console.log(`🔄 Creating file in Drive for ${label}...`);
//     //     const response =  await drive.files.create({
//     //       requestBody: fileMetadata,
//     //       media: { 
//     //         mimeType: file.type || 'application/octet-stream', 
//     //         body: stream 
//     //       },
//     //       fields: "id,webViewLink",
//     //     });

//     //     console.log(`✅ File created for ${label}: ${response.data.id}`);

//     //     // Make the file publicly accessible
//     //     try {
//     //       console.log(`🔓 Setting permissions for ${label}...`);
//     //       await drive.permissions.create({
//     //         fileId: response.data.id,
//     //         requestBody: {
//     //           role: 'reader',
//     //           type: 'anyone'
//     //         },
//     //       });
//     //       console.log(`✅ Permissions set for ${label}`);
//     //     } catch (permError) {
//     //       console.warn(`⚠️ Could not set permissions for ${label}:`, permError.message);
//     //     }

//     //     console.log(`🎉 Successfully uploaded ${label}: ${response.data.id}`);
//     //     return response.data.webViewLink || `https://drive.google.com/file/d/${response.data.id}/view`;
//     //   } catch (error) {
//     //     console.error(`💥 Error uploading ${label}:`, error);
//     //     throw new Error(`Failed to upload ${label}: ${error.message}`);
//     //   }
//     // }
//     // Upload function for personal drive folders
//     async function uploadToDrive(file, label) {
//       if (!file || typeof file === 'string') {
//         console.log(`📭 No file provided for ${label}`);
//         return '';
//       }

//       try {
//         console.log(`📤 Starting upload for ${label}...`);
//         const arrayBuffer = await file.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);
//         const stream = Readable.from(buffer);

//         const fileName = `${Date.now()}_${data.customerName}_${(file.name || label || 'file').replace(/[^a-zA-Z0-9._-]/g, '_')}`;

//         console.log(`📄 Uploading ${label}: ${fileName}`);

//         const fileMetadata = {
//           name: fileName,
//           parents: [targetFolderId],
//         };

//         console.log(`🔄 Creating file in Drive for ${label}...`);
//         const response = await drive.files.create({
//           requestBody: fileMetadata,
//           media: {
//             mimeType: file.type || 'application/octet-stream',
//             body: stream
//           },
//           fields: "id,webViewLink",
//         });

//         console.log(`✅ File created for ${label}: ${response.data.id}`);

//         // Make the file publicly accessible
//         try {
//           console.log(`🔓 Setting permissions for ${label}...`);
//           await drive.permissions.create({
//             fileId: response.data.id,
//             requestBody: {
//               role: 'reader',
//               type: 'anyone'
//             },
//           });
//           console.log(`✅ Permissions set for ${label}`);
//         } catch (permError) {
//           console.warn(`⚠️ Could not set permissions for ${label}:`, permError.message);
//         }

//         console.log(`🎉 Successfully uploaded ${label}: ${response.data.id}`);
//         return response.data.webViewLink || `https://drive.google.com/file/d/${response.data.id}/view`;
//       } catch (error) {
//         console.error(`💥 Error uploading ${label}:`, error);

//         // More specific error handling
//         if (error.code === 403) {
//           throw new Error(`Access denied for ${label}. Please ensure the folder is shared with ${clientEmail} as "Editor".`);
//         }

//         throw new Error(`Failed to upload ${label}: ${error.message}`);
//       }
//     }

//     // Upload all files in parallel
//     console.log('🚀 Starting file uploads...');
//     let aadharLink = '', panLink = '', salaryLink = '', bankLink = '';

//     try {
//       [aadharLink, panLink, salaryLink, bankLink] = await Promise.all([
//         uploadToDrive(aadhar, 'Aadhar'),
//         uploadToDrive(pan, 'PAN'),
//         uploadToDrive(salarySlips, 'SalarySlips'),
//         uploadToDrive(bankStatement, 'BankStatement'),
//       ]);
//       console.log('✅ All files uploaded successfully');
//     } catch (uploadError) {
//       console.error('💥 File upload failed:', uploadError);
//       return NextResponse.json({
//         success: false,
//         error: uploadError.message
//       }, { status: 500 });
//     }

//     // Prepare data for Google Sheets
//     console.log('📊 Preparing data for Google Sheets...');
//     const now = new Date();
//     const values = [[
//       now.toLocaleString('en-IN'),
//       data.customerName,
//       data.fatherName,
//       data.motherName,
//       data.maritalStatus,
//       data.spouseName,
//       data.contactNumber,
//       data.altContactNumber,
//       data.highestEducation,
//       data.institutionName,
//       data.personalEmail,
//       data.officialEmail,
//       data.currentAddress,
//       data.permanentAddress,
//       data.officeAddress,
//       data.companyName,
//       data.dateOfJoining,
//       data.designation,
//       data.totalWorkExp,
//       data.ref1Name,
//       data.ref1Contact,
//       data.ref1Address,
//       data.ref2Name,
//       data.ref2Contact,
//       data.ref2Address,
//       data.loanAmount,
//       data.loanTenure,
//       data.loanPurpose,
//       aadharLink,
//       panLink,
//       salaryLink,
//       bankLink,
//     ]];

//     console.log('📈 Data prepared for sheets, row length:', values[0].length);

//     // Google Sheets operations
//     const sheetName = 'Quick Loan';

//     try {
//       console.log('📋 Checking if sheet exists...');
//       // Check if sheet exists
//       const meta = await sheets.spreadsheets.get({ spreadsheetId });
//       const exists = (meta.data.sheets || []).some(s => s.properties?.title === sheetName);

//       if (!exists) {
//         console.log('📝 Creating new sheet:', sheetName);
//         // Create new sheet
//         await sheets.spreadsheets.batchUpdate({
//           spreadsheetId,
//           requestBody: {
//             requests: [{
//               addSheet: {
//                 properties: { title: sheetName }
//               }
//             }]
//           }
//         });

//         // Add headers
//         const header = [[
//           'Date Time', 'Customer Name', 'Father Name', 'Mother Name', 'Marital Status', 'Spouse Name',
//           'Contact Number', 'Alt Contact', 'Highest Education', 'Institution', 'Personal Email',
//           'Official Email', 'Current Address', 'Permanent Address', 'Office Address', 'Company Name',
//           'Date Of Joining', 'Designation', 'Total Work Exp', 'Ref1 Name', 'Ref1 Contact', 'Ref1 Address',
//           'Ref2 Name', 'Ref2 Contact', 'Ref2 Address', 'Loan Amount', 'Loan Tenure', 'Loan Purpose',
//           'Aadhar Link', 'PAN Link', 'Salary Slips Link', 'Bank Statement Link'
//         ]];

//         await sheets.spreadsheets.values.update({
//           spreadsheetId,
//           range: `${sheetName}!A1:AE1`,
//           valueInputOption: 'RAW',
//           requestBody: { values: header }
//         });
//         console.log('✅ Headers added to sheet');
//       }

//       // Append the new row
//       console.log('📤 Appending data to sheet...');
//       await sheets.spreadsheets.values.append({
//         spreadsheetId,
//         range: `${sheetName}!A:A`,
//         valueInputOption: 'USER_ENTERED',
//         insertDataOption: 'INSERT_ROWS',
//         requestBody: { values }
//       });

//       console.log('✅ Data successfully saved to Google Sheets');

//     } catch (sheetsError) {
//       console.error('💥 Sheets error:', sheetsError);
//       return NextResponse.json({
//         success: false,
//         error: `Google Sheets error: ${sheetsError.message}`
//       }, { status: 500 });
//     }

//     console.log('🎉 Request completed successfully!');
//     return NextResponse.json({
//       success: true,
//       message: 'Loan application submitted successfully!',
//       data: {
//         fileLinks: {
//           aadhar: aadharLink,
//           pan: panLink,
//           salarySlips: salaryLink,
//           bankStatement: bankLink
//         }
//       }
//     });

//   } catch (error) {
//     console.error("💥 General error:", error);

//     let errorMessage = error.message;
//     if (error.code === 403) {
//       errorMessage = "Access denied. Please ensure the folder is shared with the service account as 'Editor'.";
//     }

//     return NextResponse.json({
//       success: false,
//       error: errorMessage
//     }, { status: 500 });
//   }
// }
