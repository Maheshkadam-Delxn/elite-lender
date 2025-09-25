export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      mobile,
      loanAmount,
      city,
      pincode,
      salaryMonthly,
      serviceSector,
      companyName,
      address,
      loanType
    } = body || {};

    // Basic validation for required fields
    if (!name || !email || !mobile || !loanAmount || !city || !pincode || !salaryMonthly || !serviceSector) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prefer native Google Sheets API if credentials are available
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;

    if (spreadsheetId && clientEmail && privateKeyRaw) {
      const { google } = await import('googleapis');
      const privateKey = (privateKeyRaw || '').replace(/\\n/g, '\n');

      // Determine sheet name based on loanType
      const normalizedType = (loanType || '').toString().trim().toLowerCase();
      let sheetName = 'General';
      if (normalizedType.includes('gold')) sheetName = 'Gold';
      else if (normalizedType.includes('car') || normalizedType.includes('vehicle')) sheetName = 'Car Loan';
      else if (normalizedType) sheetName = loanType; // use provided name for new/other cards

      const auth = new google.auth.JWT(clientEmail, undefined, privateKey, ['https://www.googleapis.com/auth/spreadsheets']);

      try {
        await auth.authorize();
      } catch (authErr) {
        console.error('Google auth error:', authErr?.message);
        return new Response(JSON.stringify({ success: false, error: 'Google auth failed. Ensure GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY are correct.' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const sheets = google.sheets({ version: 'v4', auth });

      // Ensure sheet exists
      try {
        const meta = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetsList = meta.data.sheets || [];
        const exists = sheetsList.some(s => s.properties && s.properties.title === sheetName);
        if (!exists) {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [{ addSheet: { properties: { title: sheetName } } }]
            }
          });
          // Optionally write header row
          const headerValues = [[
            'Date Time',
            'Full Name',
            'Email Address',
            'Mobile Number',
            'Required Loan Amount',
            'City',
            'Pincode',
            'Salary Monthly',
            'Service Sector',
            'Company Name',
            'Address',
            'Loan Type'
          ]];
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1:L1`,
            valueInputOption: 'RAW',
            requestBody: { values: headerValues }
          });
        }
      } catch (sheetMetaErr) {
        console.error('Sheets meta error:', sheetMetaErr?.message);
        return new Response(JSON.stringify({ success: false, error: 'Unable to access spreadsheet. Verify GOOGLE_SHEETS_SPREADSHEET_ID and that the sheet is shared with the service account.' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Prepare row
      const now = new Date();
      const values = [[
        now.toLocaleString('en-IN'),
        name,
        email,
        mobile,
        loanAmount,
        city,
        pincode,
        salaryMonthly,
        serviceSector,
        companyName || '',
        address || '',
        loanType || ''
      ]];

      try {
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `${sheetName}!A:A`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values }
        });
      } catch (appendErr) {
        console.error('Append error:', appendErr?.message);
        return new Response(JSON.stringify({ success: false, error: 'Failed to append row to sheet. Check sheet permissions and name.', details: appendErr?.message }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fallback to existing webhook flow if Google credentials are not configured
    const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
    if (!webhookUrl) {
      return new Response(JSON.stringify({ success: false, error: 'Google Sheets not configured. Set GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY or SHEETS_WEBHOOK_URL.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Map to the Google Script expected keys (webhook mode)
    const payload = {
      fullName: name,
      emailAddress: email,
      mobileNumber: mobile,
      requiredLoanAmount: loanAmount,
      city,
      pincode,
      salaryMonthly,
      serviceSector,
      companyName: companyName || '',
      address: address || '',
      loanType: loanType || '',
      sheetName: loanType || 'General' // let the script route to specific sheet
    };

    const resp = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await resp.text();
    if (!resp.ok) {
      return new Response(JSON.stringify({ success: false, error: 'Sheets webhook error', details: text }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      const json = JSON.parse(text);
      if (json && json.success) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch {}

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error?.message || 'Unexpected error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


