# Google Sheets Setup for Contact Form

This guide will help you set up Google Sheets integration for the contact form to store contact data in a sheet named "Contact us". The contact form now only stores data in Google Sheets (no email notifications).

## Prerequisites

1. You should already have Google OAuth tokens set up (google-oauth-token.json file exists)
2. Google API credentials configured in your environment variables

## Step 1: Create a Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Elite Lender Contact Data" or similar
4. Copy the spreadsheet ID from the URL

The URL will look like:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
```

## Step 2: Configure Environment Variables

Add the following environment variable to your `.env.local` file:

```env
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
```

Replace `your_spreadsheet_id_here` with the actual spreadsheet ID from step 1.

**Note:** The system will also check for `GOOGLE_SPREADSHEET_ID` as a fallback, but `GOOGLE_SHEETS_SPREADSHEET_ID` is preferred.

## Step 3: Share the Spreadsheet

1. In your Google Spreadsheet, click the "Share" button
2. Add the email address associated with your Google OAuth credentials
3. Give it "Editor" permissions

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Go to the contact page
3. Fill out and submit the contact form
4. Check your Google Spreadsheet - you should see:
   - A new sheet named "Contact us" (created automatically if it doesn't exist)
   - Headers: Date Time, Full Name, Email Address, Phone Number, Company, Subject, Message
   - The submitted form data in a new row with proper date/time formatting

## Sheet Structure

The "Contact us" sheet will have the following columns:

| Column | Header | Description |
|--------|--------|-------------|
| A | Date Time | When the form was submitted (Indian timezone) |
| B | Full Name | The contact's full name |
| C | Email Address | The contact's email address |
| D | Phone Number | The contact's phone number (optional) |
| E | Company | The contact's company name (optional) |
| F | Subject | The subject of the message |
| G | Message | The message content |

## Troubleshooting

### Common Issues:

1. **"Spreadsheet not found" error**
   - Check that the `GOOGLE_SHEETS_SPREADSHEET_ID` environment variable is set correctly
   - Verify the spreadsheet exists and is accessible
   - Ensure the spreadsheet ID is correct (from the URL)

2. **"Permission denied" error**
   - Ensure the spreadsheet is shared with the Google account used for OAuth
   - Check that the account has Editor permissions

3. **"Sheet not found" error**
   - The system will automatically create a "Contact us" sheet if it doesn't exist
   - If this fails, manually create a sheet named "Contact us" in your spreadsheet

4. **OAuth token expired**
   - If you get authentication errors, you may need to refresh your OAuth tokens
   - Run the setup process again to get new tokens

## Security Notes

- Keep your `GOOGLE_SPREADSHEET_ID` environment variable secure
- Don't commit it to version control
- The spreadsheet should only be accessible to authorized personnel
- Consider setting up proper access controls on the Google Sheet

## Support

If you encounter any issues, check the server logs for detailed error messages. The contact form now relies entirely on Google Sheets integration, so if it fails, the form submission will fail. Make sure to test the integration thoroughly.
