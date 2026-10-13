const mongoose = require('mongoose');
const createSlug = require('../utils/slugify');
const calculateReadingTime = require('../utils/readingTime');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: '' },
    featuredImage: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    readingTime: { type: Number, default: 1 },
  },
  { timestamps: true }
);

blogSchema.pre('save', function prepareBlog(next) {
  if (this.isModified('title')) {
    this.slug = createSlug(this.title);
  }
  if (this.isModified('content')) {
    this.readingTime = calculateReadingTime(this.content);
    if (!this.excerpt) {
      const plain = this.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      this.excerpt = plain.slice(0, 160) + (plain.length > 160 ? '...' : '');
    }
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
