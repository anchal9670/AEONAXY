// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { enrollUser, myEnrollCourse } = require('../controllers/enroll_controller');
const { isAuth } = require('../middlewares/auth_middleware');

// POST /signup - Route for user signup
router.post('/course',isAuth, enrollUser);
router.get('/course/my',isAuth, myEnrollCourse);

module.exports = router;
