import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    slug: {
      type: String,
      unique: true
    },
    excerpt: {
      type: String,
      required: [true, 'Please add an excerpt'],
      maxlength: [500, 'Excerpt cannot be more than 500 characters']
    },
    content: {
      type: String,
      required: [true, 'Please add content']
    },
    featuredImage: {
      type: String,
      default: 'default-post.jpg'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    isFeature: {
      type: Boolean,
      default: false
    },
    readTime: {
      type: Number,
      default: 0
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: String
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create slug from title
postSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title);
  }
  
  // Calculate read time (approx 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  
  next();
});

// Virtual for comments
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  justOne: false
});

const Post = mongoose.model('Post', postSchema);

export default Post;
