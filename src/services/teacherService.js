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

const objectId = mongoose.Types.ObjectId;

exports.createTeacherService = async (teacherData, filename, options, createdBy) => {
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
                createdBy,
                roleId: isRole?._id,
                confirmationToken: token,
                confirmationTokenExpires: date,
                picture: filename,
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
    {pageNo, perPage, keyword}
)=>{

    const role = await RoleModel.findOne({ name:  'teacher'});
    const skipPage = (pageNo - 1) * perPage;
    const searchRegex = {$regex: keyword, $options: 'ix'};

    const query = keyword === '0' ? {roleId: role?._id} : {$or: [
            {firstName: searchRegex},
            {lastName: searchRegex},
            {email: searchRegex},
            {mobile: searchRegex},
            {qualification: searchRegex},
        ],
        roleId: new objectId(role?._id)
    };

    const teachers = await UserModel.aggregate([
        {$match: query},
        {
            $facet:{
                total:[{$count: "count"}],
                rows:[
                    {
                        $lookup: {
                            from: "teacherprofiles",
                            localField: "_id",
                            foreignField: "userId",
                            as: "profile"
                        }
                    },
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
                      $project: {
                          email: 1,
                          mobile: 1,
                          firstName: 1,
                          lastName: 1,
                          createdAt: 1,
                          updatedAt: 1,
                          qualification: {$first: '$profile.qualification'},
                          about: {$first: '$profile.about'},
                          picture: 1,
                          createdBy: {
                              mobile: "$createdBy.mobile",
                              firstName: "$createdBy.firstName",
                              lastName: "$createdBy.lastName"
                          },
                          createdById: "$createdBy._id",
                      }
                    },
                    {$skip: skipPage},
                    {$limit: perPage},
                    {$sort: {createdAt: -1}}
                ]
            }
        },


    ])

    return {total: teachers[0]?.total[0]?.count, rows: teachers[0]?.rows};
}



exports.getTeacherDetailsService = async (teacherId)=>{

    // const role = await RoleModel.findOne({ name:  'teacher'});
    // const skipPage = (pageNo - 1) * perPage;
    // const searchRegex = {$regex: keyword, $options: 'ix'};

    // const query = keyword === '0' ? {roleId: role?._id} : {$or: [
    //         {firstName: searchRegex},
    //         {lastName: searchRegex},
    //         {email: searchRegex},
    //         {mobile: searchRegex},
    //         {qualification: searchRegex},
    //     ],
    //     roleId: new objectId(role?._id)
    // };

    const query = {
        _id: new mongoose.Types.ObjectId(teacherId)
    }

    const teachers = await UserModel.aggregate([
        {$match: query},
        {
            $facet:{
                rows:[
                    {
                        $lookup: {
                            from: "teacherprofiles",
                            localField: "_id",
                            foreignField: "userId",
                            as: "profile"
                        }
                    },
                    {
                      $project: {
                          email: 1,
                          mobile: 1,
                          firstName: 1,
                          lastName: 1,
                          createdAt: 1,
                          updatedAt: 1,
                          qualification: {$first: '$profile.qualification'},
                          about: {$first: '$profile.about'},
                          picture: 1
                      }
                    },
                    // {$skip: skipPage},
                    // {$limit: perPage},
                    {$sort: {createdAt: -1}}
                ]
            }
        },


    ])

    return teachers[0]?.rows[0];
}


