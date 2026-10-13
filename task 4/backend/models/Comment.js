const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ['approved', 'pending'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
