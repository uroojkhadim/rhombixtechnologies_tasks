const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect, admin } = require('../middleware/auth');
const { commentRules } = require('../middleware/validators');

router.get('/', protect, admin, commentController.getComments);
router.post('/', protect, commentRules, commentController.createComment);
router.patch('/:id/status', protect, admin, commentController.updateCommentStatus);
router.delete('/:id', protect, commentController.deleteComment);

module.exports = router;
