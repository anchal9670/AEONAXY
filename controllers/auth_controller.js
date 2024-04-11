const sql = require('../config/database');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const {generateUserId} = require('../utils/generate_id');
const {generateAccessToken , generateRefreshToken} = require('../utils/generateToken');
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/sendEmail');
require('dotenv').config();

const signupUser = async (req, res) => {
    try {
        const { name, email, password, phone, dateOfBirth } = req.body;
        //generate userID
        const code = await generateUserId();
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const dateOfJoining = new Date().toISOString().split('T')[0];
        const user = sql`SELECT email FROM users WHERE email=${email} LIMIT 1`;
        const userResult = await user;
        console.log(userResult);
        if((await user).count >0){
            await sendVerificationEmail(email,'Registration',`<p>Your account already exists. Please verify your email: ${email}.</p>`);
            return res.status(401).json({message:"User Already Exist"});
        }
        // Logic to save the new user to the database using template literals
        const query = sql`
        INSERT INTO users (userId, name, email, password, phone, dateOfBirth, dateOfJoining)
        VALUES (${code}, ${name}, ${email}, ${hashedPassword}, ${phone}, ${dateOfBirth}, ${dateOfJoining})
        `;

        await query;

        await sendVerificationEmail(email,'Registration','<p>Your account registered successfully.');
        // Respond with success message
        return res.status(201).json({ message: 'User signed up successfully'});
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"});
    }
};

const login = async(req,res)=>{
    try{
        const { email, password } = req.body;

        // Retrieve user data from the database based on the provided email
        const query = sql`
            SELECT * FROM users WHERE email = ${email}
        `;
        const [user] = await query;

        // Check if a user with the provided email exists
        if (!user) {
            return res.status(401).json({message:"User Not Found"});
        }
        console.log(user);

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({message:"Password Not Match"});
        }

        // If passwords match, login successful, return user data without password

        const accessToken = generateAccessToken(user.userid , user.email);
        const refreshToken = generateRefreshToken(user.userid , user.email);

        const updateToken = sql`
        UPDATE users 
        SET refresh_token = ${refreshToken}, refresh_token_expiry = CURRENT_TIMESTAMP + INTERVAL '1 year'
        WHERE userid = ${user.userid}
        `;
        await updateToken;

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            secure: true,
        });
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
            secure: true,
        });
        
        delete user.password; 
        res.status(200).json({ 
            success: true,
            userId: user.userid,
            email : user.email,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    }catch(error){
        return res.status(401).json({message:"Internal Sever Error"});
    }
}

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.header("refreshToken") || req.header("Authorization")?.replace("Bearer ", "");
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (!payload) {
          return res.status(401).send({
            message: "Unauthenticated Payload",
          });
        }
        // Fetch user based on refresh token from the database
        const user = await sql`
            SELECT *
            FROM users
            WHERE refresh_token = ${refreshToken}
                AND refresh_token_expiry > NOW();`;

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
        }

        // Generate a new access token
        const accessToken = jwt.sign(
            { 
                userId : user.userid,
                email : user.email,
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_SECRET_EXPIRE }
        );

        // Set the new access token in response
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            secure: true,
        });

        return res.status(200).json({ success: true, accessToken, refreshToken });
    } catch (error) {
        console.error("Error refreshing access token:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const logout = async(req,res)=>{
    try{
        const userid = req.userid;
        if (!userid) {
            return res.status(400).json({
                success: false,
                message: "User ID is missing in the request",
            });
        }

        const updateToken = sql`
        UPDATE users 
        SET refresh_token = NULL, refresh_token_expiry = NULL
        WHERE userid = ${userid}
        `;
        await updateToken;
    
        res.cookie("refreshToken", "", { maxAge: 0 });
        res.cookie("accessToken", "", { maxAge: 0 });
        return res.status(200).json({
          success: true,
          message: "success",
        });
    }catch(error){
        console.error("Error refreshing access token:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


module.exports = {
    signupUser,
    login,
    refreshAccessToken,
    logout
};
