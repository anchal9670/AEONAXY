const sql = require('../config/database');
const {uploadImageToCloudinary} = require("../utils/imageUploder");
const {generateCourseId, generateModuleId, generateSubModuleId} = require('../utils/generate_id');

const createCourse = async(req,res)=>{
    try{
        const {courseName ,description,category,price,instructorName,duration,prerequisite} = req.body;
        const thumbnail =req.files.thumbnailImage;
        const uploadedImage = await uploadImageToCloudinary(thumbnail, process.env.CLOUDINARY_FOLDER_NAME);
        const code = await generateCourseId();
        console.log(code);
        const query = sql`
        INSERT INTO course (courseId, courseName , description , category,thumbnail, price, instructorName, duration, prerequisite)
        VALUES (${code}, ${courseName}, ${description}, ${category},${uploadedImage.secure_url} ,  ${price}, ${instructorName}, ${duration}, ${prerequisite})
        `;

        await query;
        // Respond with success message
        res.status(201).json({
            success : true,
            message : "Course Created Successfully"
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            error : "Internal Server Error"
        });
    }
}

const addModule = async(req,res)=>{
    try{
        const {courseId,moduleNumber, moduleName} = req.body;
        const course = await sql`SELECT * FROM course WHERE courseId = ${courseId}`;
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const code = await generateModuleId();

        const query = sql`
        INSERT INTO module (moduleId , courseId, moduleNumber , moduleName )
        VALUES (${code}, ${courseId}, ${moduleNumber}, ${moduleName})
        `;

        await query;

        res.status(201).json({
            success : true,
            message : "Module Created Successfully"
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            error : "Internal Server Error"
        });
    }
}

const addSubModule = async(req,res)=>{
    try{
        const { moduleId, subModuleNumber, subModuleName ,description , videoUrl} = req.body;
        const thumbnail =req.files.thumbnailImage;
        const uploadedImage = await uploadImageToCloudinary(thumbnail, process.env.CLOUDINARY_FOLDER_NAME);
        const code =await generateSubModuleId();

        const query = sql`
        INSERT INTO subModule (subModuleId , moduleId, subModuleNumber , subModuleName , thumbnail , description , videoUrl )
        VALUES (${code}, ${moduleId}, ${subModuleNumber}, ${subModuleName} , ${uploadedImage.secure_url}, ${description} , ${videoUrl})
        `;

        await query;

        res.status(201).json({
            success : true,
            message : "SubModule Created Successfully"
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            error : "Internal Server Error"
        });
    }
}

const showCourse = async(req,res)=>{
    try{
        const course = await sql`SELECT * FROM course`;
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
    
        // Send the user profile as a JSON response
        res.status(200).json({
            success : true,
            data : course,
        });
    }catch(error){
        return res.status(500).json({
            success : false,
            error : "Internal Server Error"
        });
    }
}

const showCourseByCourseId = async (req, res) => {
    try {
      const { courseId } = req.query;
  
      // Query to fetch course details with modules and submodules
      const query = sql`
        SELECT 
          c.courseId,
          c.courseName,
          c.description AS courseDescription,
          c.category,
          c.thumbnail AS courseThumbnail,
          c.price,
          c.instructorName,
          c.duration,
          c.prerequisite,
          m.moduleId,
          m.moduleNumber,
          m.moduleName,
          sm.subModuleId,
          sm.subModuleNumber,
          sm.subModuleName,
          sm.thumbnail AS subModuleThumbnail,
          sm.videoUrl,
          sm.description AS subModuleDescription
        FROM 
          course c
        LEFT JOIN 
          module m ON c.courseId = m.courseId
        LEFT JOIN 
          subModule sm ON m.moduleId = sm.moduleId
        WHERE 
          c.courseId = ${courseId};
      `;
        
        const result = await query;

        // Send the JSON response
        res.status(200).json(result);
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error"
      });
    }
}
  

module.exports= {
    createCourse,
    addModule,
    addSubModule,
    showCourse,
    showCourseByCourseId
}