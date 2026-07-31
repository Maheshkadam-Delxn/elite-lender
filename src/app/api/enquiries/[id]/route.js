import connectDB from '../../../../lib/mongodb';
import Enquiry, { ENQUIRY_STATUSES } from '../../../../models/Enquiry';

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { status, remarks } = body || {};

    if (status && !ENQUIRY_STATUSES.includes(status)) {
      return Response.json({ success: false, error: 'Invalid status value' }, { status: 400 });
    }

    const update = {};
    if (status) update.status = status;
    if (remarks !== undefined) update.remarks = remarks;

    const enquiry = await Enquiry.findByIdAndUpdate(id, update, { new: true });
    if (!enquiry) {
      return Response.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: enquiry });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
