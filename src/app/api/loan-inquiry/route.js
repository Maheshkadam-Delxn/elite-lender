import connectDB from '../../../lib/mongodb';
import Enquiry from '../../../models/Enquiry';

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

    if (!name || !email || !mobile || !loanAmount || !city || !pincode || !salaryMonthly || !serviceSector) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await connectDB();

    await Enquiry.create({
      source: 'loan-inquiry',
      name,
      email,
      mobile,
      loanAmount,
      city,
      pincode,
      salaryMonthly,
      serviceSector,
      companyName: companyName || '',
      address: address || '',
      loanType: loanType || ''
    });

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
