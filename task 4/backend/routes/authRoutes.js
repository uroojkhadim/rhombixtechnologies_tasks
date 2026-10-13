const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { registerRules, loginRules } = require('../middleware/validators');

router.post('/register', registerRules, authController.register);
router.post('/login', loginRules, authController.login);
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, upload.single('profileImage'), authController.updateProfile);

module.exports = router;
