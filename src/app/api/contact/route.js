import { addContactToSheet } from '../../../lib/google-sheets.js';

export async function POST(req) {
  try {
    const { name, email, message, phone, company, subject } = await req.json();

    // Store contact data in Google Sheets
    const sheetResult = await addContactToSheet({
      name,
      email,
      phone,
      company,
      subject,
      message
    });

    if (!sheetResult.success) {
      console.error('Google Sheets error:', sheetResult.error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: sheetResult.error,
        message: 'Failed to store contact data'
      }), { status: 500 });
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Contact form submitted successfully and stored in Google Sheets'
    }), { status: 200 });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      message: 'Failed to submit contact form'
    }), { status: 500 });
  }
}