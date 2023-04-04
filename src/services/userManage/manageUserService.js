const User = require('../../models/User');
const userService = require("../userService");
const error = require("../../helpers/error");
const sendEmail = require("../../helpers/sendEmail");
const rolePermissionService = require("./rolePermissionService");
const newUserEmailTemplate = require('../../emailTemplate/forNewUser');
const getAllUsersService = () => {
    return User.aggregate([
        {$match: {}},
        {$lookup: {from: 'roles', localField: 'roleId', foreignField: '_id', as: 'role'}},
        {
            $project: {
                email: 1,
                mobile: 1,
                firstName: 1,
                lastName: 1,
                status: 1,
                verified: 1,
                createdAt: 1,
                updatedAt: 1,
                'role.name': 1
            }
        }
    ])
}

const userCreateService = async (
    {
        email,
        firstName,
        lastName,
        password,
        confirmPassword,
        roleId
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

module.exports = {getAllUsersService, userCreateService}