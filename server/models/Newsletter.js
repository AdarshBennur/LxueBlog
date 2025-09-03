import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    name: {
      type: String,
      trim: true
    },
    isSubscribed: {
      type: Boolean,
      default: true
    },
    subscribedAt: {
      type: Date,
      default: Date.now
    },
    unsubscribedAt: {
      type: Date
    },
    preferences: {
      type: [String],
      enum: ['weekly', 'monthly', 'promotions', 'new-posts'],
      default: ['weekly']
    }
  },
  {
    timestamps: true
  }
);

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;
