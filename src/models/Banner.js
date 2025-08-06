import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true,
    trim: true
  },
  bgColor: {
    type: String,
    default: 'bg-blue-600',
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: 'Banner Image'
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  features: [{
    icon: {
      type: String,
      required: true
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
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

BannerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema); 