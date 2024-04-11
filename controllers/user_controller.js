const sql = require('../config/database');
const {uploadImageToCloudinary} = require("../utils/imageUploder");

const updateProfile = async(req,res)=>{
    try{
        const {name , phone ,gender, dateOfBirth} = req.body
        const userId = req.userid;

        if (req.files && req.files.thumbnailImage) {
            const profilePic = req.files.thumbnailImage;
            const uploadedImage = await uploadImageToCloudinary(profilePic, process.env.CLOUDINARY_FOLDER_NAME);
            const updateQuery = sql`
            UPDATE users
            SET profilePic = ${uploadedImage.secure_url}
            WHERE userid = ${userId}
            `;
            await updateQuery;
        }

        // Construct the SQL UPDATE query with dynamic placeholders
        if (name) {
            const updateQuery = sql`
            UPDATE users
            SET name = ${name}
            WHERE userid = ${userId}
            `;
            await updateQuery;
        }
        if (phone) {
            const updateQuery = sql`
            UPDATE users
            SET phone = ${phone}
            WHERE userid = ${userId}
            `;
            await updateQuery;
        }
        if(gender) {
            const updateQuery = sql`
            UPDATE users
            SET gender = ${gender}
            WHERE userid = ${userId}
            `;
            await updateQuery;
        }
        if (dateOfBirth) {
            const updateQuery = sql`
            UPDATE users
            SET dateOfBirth = ${new Date(dateOfBirth)}
            WHERE userid = ${userId}
            `;
            await updateQuery;
        }

        return res.status(200).json({ 
            success: true,
            message : "Updated Successfully",
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

const showMyProfile = async (req, res) => {
    try {
        const userId = req.userid; 

        // Fetch the user profile from the database
        const user = await sql`
        SELECT userid, name , email , gender , profilePic , phone , dateOfBirth , dateOfJoining
        FROM users
        WHERE userid = ${userId}`;
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Send the user profile as a JSON response
        res.status(200).json({
            success : true,
            data : user[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    updateProfile,
    showMyProfile,
}