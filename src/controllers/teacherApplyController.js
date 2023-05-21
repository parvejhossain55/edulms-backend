const TeacherApplyModel = require('../models/TeacherApply')
const FormHelper = require("../helpers/FormHelper");
const {applyTeacherService} = require("../services/teacherAuthService");
const {getAllApplyTeacherService} = require("../services/teacherApplyService");

exports.applyTeacher = async (req, res, next) => {
    try {

        const {email, firstName, lastName, mobile} = req.body;



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
        if (!FormHelper.isMobile(mobile)) {
            return res.status(400).json({
                error: "Provide a valid mobile number",
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

        const result = await applyTeacherService({email, firstName, lastName, mobile});

        return res.status(201).json(result)

    } catch (error) {
        next(error);
    }
}


exports.getAllAppliedTeachers = async (req, res, next) => {
    try {
        const pageNo = req.params?.pageNo === ":pageNo" ? 1 : Number(req.params?.pageNo);
        const perPage = req.params?.perPage === ":perPage" ? 10 : Number(req.params?.perPage);
        const searchKeyword = req.params?.keyword === ':keyword' ? '0' : req.params?.keyword;
        const teachers = await getAllApplyTeacherService({pageNo, perPage, keyword: searchKeyword});
        res.status(200).json({teachers});
    } catch (e) {
        next(e)
    }
}

