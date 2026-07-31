import connectDB from '../../../../lib/mongodb';
import Enquiry from '../../../../models/Enquiry';

export async function GET() {
  try {
    await connectDB();
    const loanTypes = await Enquiry.distinct('loanType', { loanType: { $ne: '' } });
    return Response.json({ success: true, data: loanTypes.sort() });
  } catch (error) {
    console.error('Error fetching enquiry loan types:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
