const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalBlogs, totalUsers, totalComments, pendingComments] = await Promise.all([
      Blog.countDocuments(),
      User.countDocuments(),
      Comment.countDocuments(),
      Comment.countDocuments({ status: 'pending' }),
    ]);

    res.json({
      success: true,
      data: {
        totalBlogs,
        totalUsers,
        totalComments,
        pendingComments,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.blockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot block admin' });
    }
    user.isBlocked = req.body.isBlocked ?? true;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin' });
    }
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
