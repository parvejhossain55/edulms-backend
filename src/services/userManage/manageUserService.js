const UserModel = require('../../models/User');
const userService = require("../userService");
const error = require("../../helpers/error");
const sendEmail = require("../../helpers/sendEmail");
const rolePermissionService = require("../rolePermissionService");
const newUserEmailTemplate = require('../../emailTemplate/forNewUser');
const RoleModel = require('../../models/Role');
const newAccountEmailTemplate = require('../../emailTemplate/newAccountEmail');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const ObjectId = mongoose.Types.ObjectId;
const getAllEmployeeService = async (
    {perPage, keyword, skipRow, auth}
)=>{

    const roles = await RoleModel.find({ name: {$nin: ['user', 'teacher']} });

    const roleIds = roles?.reduce((acc, current)=>{
        return [...acc, current._id]
    }, []);


    let SearchRgx = {"$regex": keyword, "$options": "i"}
    let SearchArray=[{firstName: SearchRgx},{lastName: SearchRgx},{middleName: SearchRgx},{role: SearchRgx},{email: SearchRgx}, {mobile: SearchRgx}]
    let employees;
    if (keyword!=="0"){
        const searchQuery = {$or: SearchArray, roleId: {$in: roleIds}}
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
    return {total: employees[0]?.Total[0]?.count, rows: employees[0]?.Rows};
}

const userCreateService = async (
    {
        email,
        firstName,
        lastName,
        password,
        confirmPassword,
        roleId,
        createdBy
    }
) => {
    const isMatch = await userService.findUserByProperty("email", email);
    if (isMatch) throw error("Email already taken", 400);
    const role = await rolePermissionService.roleFindByProperty("_id", roleId);
    if (!role) throw error("provide a valid role", 400);

    const send = await sendEmail(
        email,
        newUserEmailTemplate,
        `${process.env.APP_NAME} email verification`
    );


    if (send[0].statusCode === 202) {
        return await userService.createNewUser({
            email,
            firstName,
            lastName,
            password,
            confirmPassword,
            roleId
        });
}
}


const employeeCreateService = async (
    {
        email,
        firstName,
        lastName,
        mobile,
        roleId,
        createdBy
    }, authUser
) => {
    const isMatch = await userService.findUserByProperty("email", email);
    if (isMatch) throw error("Email already taken", 400);
    const role = await rolePermissionService.roleFindByProperty("_id", roleId);
    if (!role) throw error("provide a valid role", 400);

    const token = jwt.sign({ email: email, role: role?.name }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.PASSWORD_TOKEN_EXPIRE
    });

    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);
    const expireDate = new Date(expiresAt);

    // Email Send
    const send = await sendEmail(
        email,
        newAccountEmailTemplate({ createdUser: `${authUser?.firstName} ${authUser?.lastName}`, mobile: `${authUser?.mobile}`, token, expireDate }),
        `${process.env.APP_NAME} registration`
    );

    if (send[0].statusCode === 202) {
        const createUser = await userService.createNewUser({
            email,
            firstName,
            lastName,
            roleId,
            createdBy,
            mobile,
            confirmationToken: token,
            confirmationTokenExpires: expireDate
        });

        if (!createdBy){
            await userService.userUpdateService({_id: createUser?._id}, {createdBy: createUser?._id})
        }
        return createUser

    } else {
        throw error("Server error occurred", 5000);
    }



}

module.exports = {getAllEmployeeService, userCreateService, employeeCreateService}