// app.js
const express = require('express');
const sql = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

const authRoutes = require('./routes/auth_route');
const userRoutes = require('./routes/user_routes');
const courseRoutes = require('./routes/course_route');
const enrollRoutes = require('./routes/enroll_routes');

const port = process.env.PORT || 3000;

// Mount the auth routes
app.use('/auth', authRoutes);
app.use('/profile',userRoutes);
app.use('/course',courseRoutes);
app.use('/enroll',enrollRoutes);

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
