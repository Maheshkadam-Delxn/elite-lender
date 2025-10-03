import { google } from "googleapis";
 
export async function POST(req) {
  try {
    const { fname,lname,mobile,email,insuranceType } = await req.json();
 
    // Load the service account key
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
 
    // Create a Sheets client
    const sheets = google.sheets({ version: "v4", auth });
 
    // Add data to Google Sheet
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = `${insuranceType}!A:C`;
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[fname,lname,mobile, email]], // Data to append
      },
    });
 
    return new Response(
      JSON.stringify({ success: true, data: response.data }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}