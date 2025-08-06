import connectDB from '../../../../lib/mongodb';
import Stat from '../../../../models/Stat';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();
    
    const updatedStat = await Stat.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );
    
    if (!updatedStat) {
      return Response.json({ success: false, error: 'Statistic not found' }, { status: 404 });
    }
    
    return Response.json({ success: true, data: updatedStat });
  } catch (error) {
    console.error('Error updating stat:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    const deletedStat = await Stat.findByIdAndDelete(id);
    
    if (!deletedStat) {
      return Response.json({ success: false, error: 'Statistic not found' }, { status: 404 });
    }
    
    return Response.json({ success: true, data: deletedStat });
  } catch (error) {
    console.error('Error deleting stat:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
} 