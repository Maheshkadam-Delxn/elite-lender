import connectDB from '../../../../lib/mongodb';
import LoanType from '../../../../models/LoanType';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id || id === 'undefined') {
      return Response.json({ success: false, error: 'Invalid ID provided' }, { status: 400 });
    }

    const loanType = await LoanType.findByIdAndDelete(id);
    
    if (!loanType) {
      return Response.json({ success: false, error: 'Loan type not found' }, { status: 404 });
    }

    return Response.json({ success: true, message: 'Loan type deleted successfully' });
  } catch (error) {
    console.error('Error deleting loan type:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id || id === 'undefined') {
      return Response.json({ success: false, error: 'Invalid ID provided' }, { status: 400 });
    }
    const body = await request.json();

    // Create update data with all fields including link
    const updateData = {
      title: body.title,
      subtitle: body.subtitle || '',
      description: body.description,
      typesOfLoan: body.typesOfLoan || [],
      features: body.features || [],
      icon: body.icon,
      iconColor: body.iconColor,
      bgColor: body.bgColor,
      order: body.order,
      isActive: body.isActive,
      link: body.link || '',
      loanAmount: body.loanAmount || { min: '', max: '' },
      interestRate: body.interestRate || { min: '', max: '' },
      tenure: body.tenure || { min: '', max: '' },
      eligibility: body.eligibility || [],
      documents: body.documents || []
    };

    const loanType = await LoanType.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!loanType) {
      return Response.json({ success: false, error: 'Loan type not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: loanType });
  } catch (error) {
    console.error('Error updating loan type:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
} 