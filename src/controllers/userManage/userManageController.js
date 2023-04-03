const manageUserService = require('../../services/admin/userManage/manageUserService');
const FormHelper = require("../../helpers/FormHelper");
const userManageService = require("../../services/admin/userManage/manageUserService");
const getAllUsers = async (req, res, next)=>{
    try {
        const users = await manageUserService.getAllUsersService();
        res.status(200).json(users)
    }catch (e) {
        next(e);
    }
}

const createUser = async (req, res, next)=>{
    try {
        const { email, mobile, firstName, lastName, password, confirmPassword, roleId } = req.body;
        if (FormHelper.isEmpty(email)) {
            return res.status(400).json({
                error: "Email is required",
            });
        }
        if (!FormHelper.isEmail(email)) {
            return res.status(400).json({
                error: "Provide a valid email address",
            });
        }
        if (FormHelper.isEmpty(firstName)) {
            return res.status(400).json({
                error: "First Name is required",
            });
        }
        if (FormHelper.isEmpty(lastName)) {
            return res.status(400).json({
                error: "Last Name is required",
            });
        }

        if (FormHelper.isEmpty(password)) {
            return res.status(400).json({
                error: "Password is required",
            });
        }
        if (!FormHelper.isPasswordValid(password)) {
            return res.status(400).json({
                error:
                    "Password must contain at least 8 characters long, one uppercase letter, one lowercase letter, one digit and one special character",
            });
        }
        if (FormHelper.isEmpty(confirmPassword)) {
            return res.status(400).json({
                error: "Confirm password is required",
            });
        }
        if (!FormHelper.comparePassword(password, confirmPassword)) {
            return res.status(400).json({
                error: "Password doesn't match",
            });
        }

        if (!FormHelper.isIdValid(roleId)){
            return res.status(400).json({
                error: "provide a valid role",
            });
        }

        await userManageService.userCreateService({
            email,
            mobile,
            firstName,
            lastName,
            password,
            confirmPassword,
            roleId
        });

        res.status(201).json({
            message: "Account create success and send email to "+ email,
        });
    } catch (e) {
        next(e);
    }
}

module.exports = {getAllUsers, createUser}