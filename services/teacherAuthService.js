const TeacheModelApply = require('../models/TeacherApply');
const User = require('../models/User');
const sendOTP = require("../helpers/sendOTP");
const error = require("../helpers/error");

exports.applyTeacherService = async ({
                                         email,
                                         firstName,
                                         lastName,
                                         mobile,
                                         about,
                                         qualification,
                                         role = "teacher",
                                     }) => {

    const exitingApply = await TeacheModelApply.findOne({email: email})
    const exitingUser = await User.findOne({email: email})

    if (exitingApply || exitingUser) {
        throw error("Email address already exists", 400);
    }


    const result = await TeacheModelApply.create({
        firstName,
        lastName,
        email,
        mobile,
        role,
        about,
        qualification
    })
    if (result) {
        const send = await sendOTP(
            email,
            "Your teacher application received. We will let you soon. Thanks",
            `${process.env.APP_NAME} received teacher application.`
        );

        return result;
    } else {
        throw error("Server error occurred", 500);
    }


};