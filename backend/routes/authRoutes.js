const express = require('express');
const router = express.Router();
const { signup, verifySignup, login, verifyLogin, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/verify-signup', verifySignup);
router.post('/login', login);
router.post('/verify-login', verifyLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
