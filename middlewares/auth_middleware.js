const jwt = require('jsonwebtoken');
require("dotenv").config();

const isAuth = async (req, res, next) => {
    const token = req.body.token || req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");


    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token missing"
      });
    }
  
    let payload;
  
    try {
      payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.userid = payload.userId;
      next(); 
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: error.message || "Internal server error",
        })
    }
};

module.exports = {isAuth}