const jwt = require('jsonwebtoken');
require('dotenv').config();
const generateAccessToken = function(userId ,email){
    return jwt.sign(
        {
            userId : userId,
            email : email,
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn : process.env.JWT_ACCESS_SECRET_EXPIRE,
        }
    )
}

const generateRefreshToken = function(userId , email){
    return jwt.sign(
        {
            userId : userId,
            email : email,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn : process.env.JWT_REFRESH_SECRET_EXPIRE,
        }
    )
}

module.exports = {generateAccessToken , generateRefreshToken};