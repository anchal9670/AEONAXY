// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { createCourse, showCourse, addModule, addSubModule, showCourseByCourseId } = require('../controllers/course_controller');
const { isAuth } = require('../middlewares/auth_middleware');

// POST /signup - Route for user signup
router.post('/create',isAuth, createCourse);
router.post('/add/module',isAuth , addModule);
router.post('/add/subModule',isAuth , addSubModule);
router.get('/show/all',isAuth, showCourse);
router.get('/show',isAuth,showCourseByCourseId);

module.exports = router;
