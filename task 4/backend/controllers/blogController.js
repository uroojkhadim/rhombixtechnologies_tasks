const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Category = require('../models/Category');
const createSlug = require('../utils/slugify');

const populateOptions = [
  { path: 'author', select: 'name profileImage' },
  { path: 'category', select: 'name slug' },
  { path: 'tags', select: 'name slug' },
];

const buildBlogQuery = (query) => {
  const filter = { status: 'published' };
  if (query.admin === 'true') delete filter.status;

  if (query.category) {
    filter['category'] = query.category;
  }
  if (query.categorySlug) {
    filter['category.slug'] = query.categorySlug;
  }
  if (query.tag) {
    filter.tags = query.tag;
  }
  if (query.featured === 'true') {
    filter.isFeatured = true;
  }
  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    return {
      filter: {
        ...filter,
        $or: [{ title: regex }, { excerpt: regex }, { content: regex }],
      },
    };
  }
  return { filter };
};

exports.getBlogs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(20, parseInt(req.query.limit, 10) || 9);
    const skip = (page - 1) * limit;

    let filter = { status: 'published' };
    if (req.query.admin === 'true' && req.user?.role === 'admin') {
      filter = {};
      if (req.query.status) filter.status = req.query.status;
    }

    if (req.query.category) filter.category = req.query.category;
    if (req.query.tag) filter.tags = req.query.tag;

    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      filter.$or = [{ title: regex }, { excerpt: regex }];
    }

    if (req.query.categorySlug) {
      const cat = await Category.findOne({ slug: req.query.categorySlug });
      if (cat) filter.category = cat._id;
    }

    const sort =
      req.query.sort === 'trending'
        ? { views: -1, likes: -1 }
        : { createdAt: -1 };

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .populate(populateOptions)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(filter),
    ]);

    const enriched = blogs.map((b) => ({
      ...b,
      likeCount: b.likes?.length || 0,
    }));

    res.json({
      success: true,
      data: enriched,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getFeatured = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ status: 'published', isFeatured: true })
      .populate(populateOptions)
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    res.json({ success: true, data: blogs });
  } catch (err) {
    next(err);
  }
};

exports.getTrending = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .populate(populateOptions)
      .sort({ views: -1, createdAt: -1 })
      .limit(6)
      .lean();
    res.json({ success: true, data: blogs });
  } catch (err) {
    next(err);
  }
};

exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate(populateOptions)
      .lean();

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (blog.status !== 'published' && req.user?.role !== 'admin') {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
    blog.views += 1;

    const related = await Blog.find({
      _id: { $ne: blog._id },
      status: 'published',
      category: blog.category._id || blog.category,
    })
      .populate(populateOptions)
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    const comments = await Comment.find({
      blogId: blog._id,
      status: req.user?.role === 'admin' ? { $in: ['approved', 'pending'] } : 'approved',
    })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    const liked =
      req.user && blog.likes?.some((id) => id.toString() === req.user._id.toString());

    res.json({
      success: true,
      data: {
        ...blog,
        likeCount: blog.likes?.length || 0,
        isLiked: !!liked,
        related,
        comments,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(populateOptions);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

exports.createBlog = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (req.file) body.featuredImage = `/uploads/${req.file.filename}`;
    body.author = req.user._id;
    if (body.tags && typeof body.tags === 'string') {
      body.tags = JSON.parse(body.tags);
    }

    let slug = createSlug(body.title);
    const existing = await Blog.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;
    body.slug = slug;

    const blog = await Blog.create(body);
    const populated = await Blog.findById(blog._id).populate(populateOptions);
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const updates = { ...req.body };
    if (req.file) updates.featuredImage = `/uploads/${req.file.filename}`;
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = JSON.parse(updates.tags);
    }
    if (updates.title && updates.title !== blog.title) {
      updates.slug = createSlug(updates.title);
    }

    Object.assign(blog, updates);
    await blog.save();
    const populated = await Blog.findById(blog._id).populate(populateOptions);
    res.json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    await Comment.deleteMany({ blogId: blog._id });
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    next(err);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const userId = req.user._id;
    const index = blog.likes.findIndex((id) => id.toString() === userId.toString());
    let isLiked;

    if (index > -1) {
      blog.likes.splice(index, 1);
      isLiked = false;
      await User.findByIdAndUpdate(userId, { $pull: { likedBlogs: blog._id } });
    } else {
      blog.likes.push(userId);
      isLiked = true;
      await User.findByIdAndUpdate(userId, { $addToSet: { likedBlogs: blog._id } });
    }

    await blog.save();

    res.json({
      success: true,
      likeCount: blog.likes.length,
      isLiked,
    });
  } catch (err) {
    next(err);
  }
};
