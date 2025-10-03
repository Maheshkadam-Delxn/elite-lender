import { google } from 'googleapis';
import { auth } from './google-auth.js';
import fs from 'fs';
import path from 'path';

// Load tokens from file
const tokenPath = path.join(process.cwd(), 'google-oauth-token.json');

export async function initializeGoogleAuth() {
  try {
    if (fs.existsSync(tokenPath)) {
      const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      auth.setCredentials(tokens);
      return auth;
    } else {
      throw new Error('Google OAuth tokens not found');
    }
  } catch (error) {
    console.error('Error initializing Google Auth:', error);
    throw error;
  }
}

export async function addContactToSheet(contactData) {
  try {
    const authClient = await initializeGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // The spreadsheet ID from environment variables
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || process.env.GOOGLE_SPREADSHEET_ID;
    const sheetName = 'Contact us';

    // Validate spreadsheet ID
    if (!spreadsheetId) {
      throw new Error('Google Spreadsheet ID not configured. Please set GOOGLE_SHEETS_SPREADSHEET_ID or GOOGLE_SPREADSHEET_ID environment variable.');
    }

    // Prepare the data row - matching your exact column structure
    const values = [
      [
        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), // Date Time
        contactData.name, // Full Name
        contactData.email, // Email Address
        contactData.phone || '', // Phone Number
        contactData.company || '', // Company
        contactData.subject, // Subject
        contactData.message // Message
      ]
    ];

    // Check if the sheet exists, if not create it with headers
    try {
      await sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
        ranges: [sheetName]
      });
    } catch (error) {
      // Sheet doesn't exist, create it with headers
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetId,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName
                }
              }
            }
          ]
        }
      });

      // Add the specific headers you requested
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!A1:G1`,
        valueInputOption: 'RAW',
        resource: {
          values: [
            ['Date Time', 'Full Name', 'Email Address', 'Phone Number', 'Company', 'Subject', 'Message']
          ]
        }
      });
    }

    // Append the data to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: `${sheetName}!A:G`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: values
      }
    });

    return {
      success: true,
      data: response.data,
      message: 'Contact data successfully added to Google Sheets'
    };

  } catch (error) {
    console.error('Error adding contact to sheet:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to add contact data to Google Sheets'
    };
  }
}

export async function getContactSheetData() {
  try {
    const authClient = await initializeGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || process.env.GOOGLE_SPREADSHEET_ID;
    const sheetName = 'Contact us';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: `${sheetName}!A:G`
    });

    return {
      success: true,
      data: response.data.values || []
    };

  } catch (error) {
    console.error('Error getting contact sheet data:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
}
