import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a tag name'],
      unique: true,
      trim: true,
      maxlength: [30, 'Tag name cannot be more than 30 characters']
    },
    slug: {
      type: String,
      unique: true
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot be more than 200 characters']
    }
  },
  {
    timestamps: true
  }
);

// Create slug from name
tagSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name);
  }
  next();
});

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;
