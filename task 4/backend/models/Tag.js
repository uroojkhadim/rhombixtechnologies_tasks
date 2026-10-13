const mongoose = require('mongoose');
const createSlug = require('../utils/slugify');

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
  },
  { timestamps: true }
);

tagSchema.pre('save', function setSlug(next) {
  if (this.isModified('name')) {
    this.slug = createSlug(this.name);
  }
  next();
});

module.exports = mongoose.model('Tag', tagSchema);
