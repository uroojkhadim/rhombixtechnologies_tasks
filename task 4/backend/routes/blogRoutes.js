const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization?.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, blogController.getBlogs);
router.get('/featured', blogController.getFeatured);
router.get('/trending', blogController.getTrending);
router.get('/slug/:slug', optionalAuth, blogController.getBlogBySlug);
router.get('/:id', protect, admin, blogController.getBlogById);

router.post('/', protect, admin, upload.single('featuredImage'), blogController.createBlog);
router.put('/:id', protect, admin, upload.single('featuredImage'), blogController.updateBlog);
router.delete('/:id', protect, admin, blogController.deleteBlog);
router.post('/:id/like', protect, blogController.toggleLike);

module.exports = router;
