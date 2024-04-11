const sql = require('../config/database');
const {generateEnrollId} = require('../utils/generate_id');

const enrollUser = async(req,res)=>{
    try{
        const {courseId , amountPaid} = req.body;
        const userId = req.userid;

        const course = await sql`SELECT * FROM enroll WHERE courseId = ${courseId}`;
        if (course.count >0) {
            return res.status(404).json({ message: 'Course Already Enrolled' });
        }

        const code = await generateEnrollId();

        // Insert the data into PostgreSQL
        const query = sql`
            INSERT INTO enroll (enrollId , userId, courseId,enrollDate , expiresOn , amountPaid)
            VALUES (${code},${userId}, ${courseId} , CURRENT_DATE,CURRENT_DATE + interval '20' day, ${amountPaid})
        `;
        await query;

        return res.status(200).json({
            success: true,
            message: "User enrolled successfully"
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            error : "Internal Server Error"
        });
    }
}

const myEnrollCourse = async(req,res)=>{
    try{
        const userId = req.userid;

        const query = sql`
            SELECT c.*
            FROM course c
            JOIN enroll e ON c.courseId = e.courseId
            WHERE e.userId =${userId}
        `;
        const result = await query;

        return res.status(200).json({
            success: true,
            data: result,
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            error : "Internal Server Error"
        });
    }
}

module.exports = {
    enrollUser,
    myEnrollCourse
}