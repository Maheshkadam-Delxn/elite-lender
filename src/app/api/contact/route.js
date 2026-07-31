import connectDB from '../../../lib/mongodb';
import Enquiry from '../../../models/Enquiry';

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

    await connectDB();

    await Enquiry.create({
      source: 'contact',
      name,
      email,
      phone: phone || '',
      company: company || '',
      subject,
      message
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Contact form submitted successfully'
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
