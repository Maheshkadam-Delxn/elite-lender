import connectDB from '../../../lib/mongodb';
import Enquiry from '../../../models/Enquiry';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const status = searchParams.get('status');
    const loanType = searchParams.get('loanType');
    const search = searchParams.get('search');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const query = {};
    if (source) query.source = source;
    if (status) query.status = status;
    if (loanType) query.loanType = loanType;

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { mobile: regex },
        { personalEmail: regex },
        { contactNumber: regex }
      ];
    }

    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });
    return Response.json({ success: true, data: enquiries });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
