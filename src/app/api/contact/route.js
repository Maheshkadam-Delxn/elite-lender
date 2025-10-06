import { addContactToSheet } from '../../../lib/google-sheets.js';

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req) {
  try {
    const { name, email, message, phone, company, subject } = await req.json();

    // Validate required fields
    if (!name || !email || !message || !subject) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields',
        message: 'Please fill in all required fields'
      }), { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

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
      }), { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Contact form submitted successfully and stored in Google Sheets'
    }), { 
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      message: 'Failed to submit contact form'
    }), { 
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
}