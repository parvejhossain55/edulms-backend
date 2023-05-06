const manageUserService = require('../../services/userManage/manageUserService');
const FormHelper = require("../../helpers/FormHelper");
const userManageService = require("../../services/userManage/manageUserService");
const getAllEmployees = async (req, res, next)=>{
    try {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        const keyword = req.params.keyword;
        const skipRow = (pageNo - 1) * perPage;

        const employees = await manageUserService.getAllEmployeeService({ perPage, keyword, skipRow, auth: req.auth });
        res.status(200).json(
            { employees }
        )


    } catch (e) {
        next(e)
    }
}

const createEmployee = async (req, res, next)=>{
    try {
        const { email, firstName, lastName,mobile, roleId } = req.body;
        const authId = req?.auth?._id;
        const authUser = req?.auth;

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

        if (!FormHelper.isIdValid(roleId)){
            return res.status(400).json({
                error: "provide a valid role",
            });
        }

        await userManageService.employeeCreateService({
            email,
            firstName,
            lastName,
            mobile,
            roleId,
            createdBy: authId
        }, authUser);

        res.status(201).json({
            message: "Account create success and send email to "+ email,
        });
    } catch (e) {
        next(e);
    }
}

module.exports = {getAllEmployees, createEmployee}