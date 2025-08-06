import mongoose from 'mongoose';

const LoanTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  typesOfLoan: {
    type: [String],
    default: []
  },
  features: {
    type: [{
      icon: {
        type: String,
        default: 'FaCheckCircle'
      },
      text: {
        type: String,
        required: true
      },
      color: {
        type: String,
        default: 'text-green-500'
      }
    }],
    default: []
  },
  icon: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    default: 'text-blue-600'
  },
  bgColor: {
    type: String,
    default: 'bg-blue-50'
  },
  link: {
    type: String,
    default: '',
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  eligibility: {
    type: [String],
    default: []
  },
  documents: {
    type: [String],
    default: []
  },
  loanAmount: {
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    }
  },
  interestRate: {
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    }
  },
  tenure: {
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  strict: false // Allow fields not in schema
});

LoanTypeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.LoanType || mongoose.model('LoanType', LoanTypeSchema); 