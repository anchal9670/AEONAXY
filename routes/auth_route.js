// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signupUser, login, refreshAccessToken, logout } = require('../controllers/auth_controller');
const { isAuth } = require('../middlewares/auth_middleware');

// POST /signup - Route for user signup
router.post('/signup', signupUser);
router.post('/login',login);
router.get('/token', refreshAccessToken);
router.post('/logout',isAuth , logout);

module.exports = router;
