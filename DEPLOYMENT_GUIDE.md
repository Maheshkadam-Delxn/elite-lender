# Contact Form Deployment Guide

## Issue Fixed
The contact form was failing after deployment because it was using OAuth2 authentication with a token file (`google-oauth-token.json`) that doesn't exist in production environments.

## Solution Implemented
1. **Updated Google Sheets Authentication**: Modified `src/lib/google-sheets.js` to use service account authentication for production
2. **Added CORS Headers**: Enhanced `src/app/api/contact/route.js` with proper CORS headers
3. **Improved Error Handling**: Added better validation and error messages

## Required Environment Variables

Set these environment variables in your deployment platform (Vercel, Netlify, etc.):

```bash
# Google Sheets Configuration (Required)
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

## Google Service Account Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Sheets API and Google Drive API
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Give it a name and description
   - Click "Create and Continue"
5. Create a key for the service account:
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON" format
   - Download the JSON file
6. Extract the values from the JSON file:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY`
7. Share your Google Sheet with the service account email as Editor

## Testing the Contact Form

1. Deploy with the environment variables set
2. Visit your contact page
3. Fill out the form and submit
4. Check your Google Sheet for the new entry
5. Check the browser console and server logs for any errors

## Troubleshooting

- **"Google authentication not configured"**: Make sure all environment variables are set correctly
- **"Unable to access spreadsheet"**: Ensure the service account email has Editor access to the Google Sheet
- **CORS errors**: The API now includes proper CORS headers
- **Missing required fields**: The form now validates required fields before submission

## Development vs Production

- **Development**: Uses OAuth2 with `google-oauth-token.json` file (if available)
- **Production**: Uses Service Account authentication with environment variables
- **Fallback**: If service account credentials are not available, it will try OAuth2 as fallback
