const mongoose = require("mongoose");
const findUserByProperty = require("../services/common/findOneByProperty");
const rolePermissionService = require("./rolePermissionService");
const userService = require("./userService");
const TeacherProfile = require("../models/TeacherProfile");
const User = require("../models/User");
const generatePassword = require("../helpers/generatePassword");
const emailTemplate = require("../emailTemplate/forNewTeacher");
const sendEmail = require("../helpers/sendEmail");
const error = require("../helpers/error");
const newAccountEmailTemplate = require('../emailTemplate/newAccountEmail');
const jwt = require("jsonwebtoken");
const RoleModel = require("../models/Role");
const UserModel = require("../models/User");

exports.createTeacherService = async (teacherData, filename, options, authUser) => {
  const {
    firstName,
    lastName,
    email,
    mobile,
    about,
    qualification,
  } = teacherData;

    const isUserExit = await findUserByProperty("email", email, User);
    const isUser = await findUserByProperty("mobile", mobile, User);
    if (isUserExit) throw error("Email already taken", 400);
    if (isUser) throw error("Mobile number already taken", 400);

    let isRole = await rolePermissionService.roleFindByProperty(
        "name",
        "teacher"
    );

    if (!isRole) {
        isRole = await rolePermissionService.createNewRoleService(
            {
                roleName: "teacher",
            },
            options
        );
    }

    const token = jwt.sign({ email: email, role: isRole?._id }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.PASSWORD_TOKEN_EXPIRE
    });

    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);
    const date = new Date(expiresAt);



    const send = await sendEmail(
        email,
        emailTemplate({token, expireDate: date}),
        `${process.env.APP_NAME} student register`
    );

    if (send[0].statusCode === 202) {
        const user = await userService.createNewUser(
            {
                email,
                mobile,
                firstName,
                lastName,
                picture: filename,
                roleId: isRole?._id,
                confirmationToken: token,
                confirmationTokenExpires: date
            },
            options
        );

        await createTeacherProfile(
            {
                userId: user._id,
                qualification,
                about,
            },
            options
        );
        return true
    } else {
        throw error("something went wrong!", 400);
    }


};

const createTeacherProfile = async (teacherData, options = null) => {
  try {
    const teacher = new TeacherProfile(teacherData);
    await teacher.save(options);
    return teacher;
  } catch (error) {
    throw error("Failed To Create Teacher Profile", error.status);
  }
};

const sendEmailToTeacher = async (userId, { email, password, subject }) => {
  try {
    const body = emailTemplate(userId, email, password);
    const mailSend = await sendEmail(email, body, subject);
    return mailSend;
  } catch (error) {
    throw error("Failed to Send Email in Teaher", error.status);
  }
};

exports.agreeTeacher = async ({ userId }) => {
  try {
    const user = await findUserByProperty("_id", userId, User);

    if (!user) {
      throw error("Invalid User Id", 404);
    }

    user.verified = true;

    await user.save();
    return { message: "Teacher Successfully Verified" };
  } catch (error) {
    throw error("Invalid User Id", error.status);
  }
};

exports.getAllTeacherService = async (
    {perPage, keyword, skipRow, auth}
)=>{

    const role = await RoleModel.findOne({ name:  'teacher'});
    let SearchRgx = {"$regex": keyword, "$options": "i"}
    const skipPage = (pageNo - 1) * perPage;
    const searchRegex = {$regex: keyword, $options: 'ix'};

    const query = keyword === '0' ? {} : {$or: [
            {firstName: searchRegex},
            {lastName: searchRegex},
            {email: searchRegex},
            {mobile: searchRegex},
            {qualification: searchRegex},
        ],
    };
 /*   let employees;
    if (keyword!=="0"){
        const searchQuery = {$or: SearchArray, roleId: role._id}
        employees = await UserModel.aggregate([
            {$match: searchQuery},
            {
                $facet:{
                    Total:[{$count: "count"}],
                    Rows:[
                        {
                            $lookup: {
                                from: "users",
                                localField: "createdBy",
                                foreignField: "_id",
                                as: "createdBy"
                            }
                        },
                        {
                            $unwind: "$createdBy"
                        },
                        {
                            $lookup: {
                                from: "roles",
                                localField: "roleId",
                                foreignField: "_id",
                                as: "roles"
                            }
                        },
                        {
                            $project: {
                                email: 1,
                                mobile: 1,
                                firstName: 1,
                                middleName: 1,
                                lastName: 1,
                                roleId: 1,
                                createdBy: {
                                    mobile: "$createdBy.mobile",
                                    firstName: "$createdBy.firstName",
                                    middleName: "$createdBy.middleName",
                                    lastName: "$createdBy.lastName"
                                },
                                createdById: "$createdBy._id",
                                status: 1,
                                createdAt: 1,
                                updatedAt: 1,
                                role: '$roles.name',
                            }
                        },
                        {$skip: skipRow}, {$limit: perPage}
                    ],
                }
            },

        ])

    }else {
        employees =  await UserModel.aggregate([
            {$match: {roleId: {$in: roleIds}}},
            {
                $facet:{
                    Total:[{$count: "count"}],
                    Rows:[
                        {
                            $lookup: {
                                from: "users",
                                localField: "createdBy",
                                foreignField: "_id",
                                as: "createdBy"
                            }
                        },
                        {
                            $unwind: "$createdBy"
                        },
                        {
                            $lookup: {
                                from: "roles",
                                localField: "roleId",
                                foreignField: "_id",
                                as: "roles"
                            }
                        },
                        {
                            $project: {
                                email: 1,
                                mobile: 1,
                                firstName: 1,
                                middleName: 1,
                                lastName: 1,
                                roleId: 1,
                                createdBy: {
                                    mobile: "$createdBy.mobile",
                                    firstName: "$createdBy.firstName",
                                    middleName: "$createdBy.middleName",
                                    lastName: "$createdBy.lastName"
                                },
                                createdById: "$createdBy._id",
                                status: 1,
                                createdAt: 1,
                                updatedAt: 1,
                                role: '$roles.name',
                            }
                        },
                        {$skip: skipRow}, {$limit: perPage}
                    ],
                }
            },
        ])
    }
    return {total: employees[0]?.Total[0]?.count, rows: employees[0]?.Rows};*/

    await UserModel.aggregate([
        {$match: query},
        {
            $facet:{
                total:[{$count: "count"}],
                rows:[
                    {
                        $lookup: {
                            from: "teacherprofiles",
                            localField: "userId",
                            foreignField: "_id",
                            as: "profile"
                        }
                    },
                    {$skip: skipPage},
                    {$limit: perPage},
                    {$sort: {createdAt: -1}}
                ]
            }
        }
    ])
}