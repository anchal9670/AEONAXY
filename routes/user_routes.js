// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { updateProfile, showMyProfile } = require('../controllers/user_controller');
const { isAuth } = require('../middlewares/auth_middleware');

// POST /signup - Route for user signup
router.post('/update',isAuth, updateProfile);
router.get('/my',isAuth,showMyProfile);

module.exports = router;
