const TeacherApplyModel = require('../models/TeacherApply')
const FormHelper = require("../helpers/FormHelper");
const {applyTeacherService} = require("../services/teacherAuthService");
const {getAllApplyTeacherService} = require("../services/teacherApplyService");
const updateService = require('../services/common/updateService')
const findOneByQuery = require('../services/common/findOneByQuery')
const mongoose = require("mongoose");
const {createTeacherService} = require("../services/teacherService");
const UserModel = require("../models/User");


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
exports.applyTeacherStatusUpdate = async (req, res, next) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {status} = req.body || {};
        const {teacherId} = req.params || {};
        const options = {session}
        if (FormHelper.isEmpty(status)) {
            return res.status(400).json({
                error: "Status is required",
            });
        }

        const query = {
            _id: new mongoose.Types.ObjectId(teacherId)
        }

        const result = await updateService(query, {status}, TeacherApplyModel, options);

        const getTeacherData = await findOneByQuery(query, TeacherApplyModel);
        const checkExist = await findOneByQuery({email: getTeacherData?.email}, UserModel);

        if (!checkExist) {
            const filename = {
                public_id: 'default',
                secure_url: 'https://i.ibb.co/pLPLX44/avataaars.png'
            };

            const createNewTeacher = await createTeacherService(getTeacherData, filename, options);

            await session.commitTransaction();
            await session.endSession();
            return res.status(200).json(createNewTeacher)
        }

        await session.commitTransaction();
        await session.endSession();
        return res.status(400).json({
            error: "Email already exists",
        });

    } catch (error) {
        console.log(error)
        await session.abortTransaction();
        await session.endSession();
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

