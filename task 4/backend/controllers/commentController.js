const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

exports.getComments = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.blogId) filter.blogId = req.query.blogId;
    if (req.query.status) filter.status = req.query.status;

    const comments = await Comment.find(filter)
      .populate('user', 'name email profileImage')
      .populate('blogId', 'title slug')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.body.blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const status = req.user.role === 'admin' ? 'approved' : 'pending';
    const comment = await Comment.create({
      user: req.user._id,
      blogId: req.body.blogId,
      content: req.body.content,
      status,
    });

    const populated = await Comment.findById(comment._id).populate(
      'user',
      'name profileImage'
    );

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

exports.updateCommentStatus = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('user', 'name profileImage');

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    res.json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const isOwner = comment.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};
