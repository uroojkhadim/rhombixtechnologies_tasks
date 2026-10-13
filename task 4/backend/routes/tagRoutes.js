const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { protect, admin } = require('../middleware/auth');

router.get('/', tagController.getTags);
router.post('/', protect, admin, tagController.createTag);
router.put('/:id', protect, admin, tagController.updateTag);
router.delete('/:id', protect, admin, tagController.deleteTag);

module.exports = router;
