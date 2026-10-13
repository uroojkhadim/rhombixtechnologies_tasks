const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.get('/stats', protect, admin, userController.getDashboardStats);
router.get('/', protect, admin, userController.getUsers);
router.patch('/:id/block', protect, admin, userController.blockUser);
router.delete('/:id', protect, admin, userController.deleteUser);

module.exports = router;
