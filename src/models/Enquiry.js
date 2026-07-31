import mongoose from 'mongoose';

export const ENQUIRY_STATUSES = [
  'No Call/Contact Made',
  'Call Connected',
  'Interested',
  'Not Interested',
  'Meeting Scheduled',
  'Not Reachable',
  'Converted',
  'Rejected'
];

export const ENQUIRY_SOURCES = ['loan-inquiry', 'quick-loan', 'contact'];

const EnquirySchema = new mongoose.Schema({
  source: {
    type: String,
    enum: ENQUIRY_SOURCES,
    required: true
  },
  status: {
    type: String,
    enum: ENQUIRY_STATUSES,
    default: 'No Call/Contact Made'
  },
  remarks: {
    type: String,
    default: ''
  },

  // Shared contact fields
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  mobile: { type: String, default: '' },
  loanType: { type: String, default: '' },

  // loan-inquiry fields
  loanAmount: { type: String, default: '' },
  city: { type: String, default: '' },
  pincode: { type: String, default: '' },
  salaryMonthly: { type: String, default: '' },
  serviceSector: { type: String, default: '' },
  companyName: { type: String, default: '' },
  address: { type: String, default: '' },

  // quick-loan fields
  fatherName: { type: String, default: '' },
  motherName: { type: String, default: '' },
  maritalStatus: { type: String, default: '' },
  spouseName: { type: String, default: '' },
  altContactNumber: { type: String, default: '' },
  highestEducation: { type: String, default: '' },
  institutionName: { type: String, default: '' },
  personalEmail: { type: String, default: '' },
  officialEmail: { type: String, default: '' },
  currentAddress: { type: String, default: '' },
  permanentAddress: { type: String, default: '' },
  officeAddress: { type: String, default: '' },
  dateOfJoining: { type: String, default: '' },
  designation: { type: String, default: '' },
  totalWorkExp: { type: String, default: '' },
  ref1Name: { type: String, default: '' },
  ref1Contact: { type: String, default: '' },
  ref1Address: { type: String, default: '' },
  ref2Name: { type: String, default: '' },
  ref2Contact: { type: String, default: '' },
  ref2Address: { type: String, default: '' },
  loanTenure: { type: String, default: '' },
  loanPurpose: { type: String, default: '' },
  aadharLink: { type: String, default: '' },
  panLink: { type: String, default: '' },
  salarySlipsLink: { type: String, default: '' },
  bankStatementLink: { type: String, default: '' },

  // contact form fields
  phone: { type: String, default: '' },
  company: { type: String, default: '' },
  subject: { type: String, default: '' },
  message: { type: String, default: '' }
}, {
  timestamps: true
});

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
