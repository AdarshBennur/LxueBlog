import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please add a comment'],
      maxlength: [1000, 'Comment cannot be more than 1000 characters'],
      trim: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Allow null for guest comments
    },
    // Guest comment fields
    guestName: {
      type: String,
      required: function() {
        return !this.user; // Required only if user is not provided
      },
      trim: true,
      maxlength: [50, 'Guest name cannot be more than 50 characters']
    },
    guestEmail: {
      type: String,
      required: function() {
        return !this.user; // Required only if user is not provided
      },
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    isGuest: {
      type: Boolean,
      default: function() {
        return !this.user;
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for replies (nested comments)
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent',
  justOne: false
});

// Virtual for display name
commentSchema.virtual('displayName').get(function() {
  if (this.isGuest) {
    return this.guestName || 'Guest';
  }
  return this.user?.name || 'Anonymous';
});

// Virtual for display avatar
commentSchema.virtual('displayAvatar').get(function() {
  if (this.isGuest) {
    // Generate a default avatar for guests based on their name
    const name = this.guestName || 'Guest';
    const initial = name.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=40`;
  }
  return this.user?.avatar || 'default-avatar.jpg';
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
