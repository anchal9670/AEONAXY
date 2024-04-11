const sql = require('../config/database');
const otpGenerator = require('otp-generator');

const generateUserId = async () => {
    let randomNumber;
    let prefixedRandomNumber;
    let result;
    do {
        randomNumber = otpGenerator.generate(6, {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false,
        });
        prefixedRandomNumber = "AE" + randomNumber;
        result = await sql`SELECT COUNT(*) FROM users WHERE userId = ${prefixedRandomNumber}`;
    } while (parseInt(result[0].count) > 0);
    return prefixedRandomNumber;
};

const generateCourseId = async () => {
    let randomNumber;
    let prefixedRandomNumber;
    let result;
    do {
        randomNumber = otpGenerator.generate(8, {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false,
        });
        prefixedRandomNumber = "CE" + randomNumber;
        result = await sql`SELECT COUNT(*) FROM course WHERE courseId = ${prefixedRandomNumber}`;
    } while (parseInt(result[0].count) > 0);
    return prefixedRandomNumber;
};

const generateModuleId = async () => {
    let randomNumber;
    let prefixedRandomNumber;
    let result;
    do {
        randomNumber = otpGenerator.generate(6, {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false,
        });
        prefixedRandomNumber = "MID" + randomNumber;
        result = await sql`SELECT COUNT(*) FROM module WHERE moduleId = ${prefixedRandomNumber}`;
    } while (parseInt(result[0].count) > 0);
    return prefixedRandomNumber;
};

const generateSubModuleId = async () => {
    let randomNumber;
    let prefixedRandomNumber;
    let result;
    do {
        randomNumber = otpGenerator.generate(6, {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false,
        });
        prefixedRandomNumber = "SMI" + randomNumber;
        result = await sql`SELECT COUNT(*) FROM subModule WHERE subModuleId = ${prefixedRandomNumber}`;
    } while (parseInt(result[0].count) > 0);
    return prefixedRandomNumber;
};

const generateEnrollId = async () => {
    let randomNumber;
    let prefixedRandomNumber;
    let result;
    do {
        randomNumber = otpGenerator.generate(6, {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false,
        });
        prefixedRandomNumber = "EI" + randomNumber;
        result = await sql`SELECT COUNT(*) FROM enroll WHERE enrollId = ${prefixedRandomNumber}`;
    } while (parseInt(result[0].count) > 0);
    return prefixedRandomNumber;
};

module.exports = {
    generateUserId,
    generateCourseId,
    generateModuleId,
    generateSubModuleId,
    generateEnrollId,
};