const FormHelper = require("../helpers/FormHelper");
const teacherService = require("../services/teacherService");
const mongoose = require("mongoose");
const findAllOneJoinService = require("../services/common/findAllOneJoinService");
const dropDownService = require("../services/common/dropDownService");
const TeacherModel = require("../models/TeacherProfile");
const UserModel = require("../models/User");
const RoleModel = require("../models/Role");
const {query} = require("express");

exports.createTeacher = async (req, res, next) => {
    const {firstName, lastName, mobile, email, qualification, about} = req.body;
    const filename = {
        public_id: req?.file?.cloudinaryId,
        secure_url: req?.file?.cloudinaryUrl,
    };

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const createdBy = req?.auth?._id;
        const options = {session}
        if (FormHelper.isEmpty(firstName)) {
            return res.status(400).json({
                error: "firstName is required",
            });
        }
        if (FormHelper.isEmpty(lastName)) {
            return res.status(400).json({
                error: "lastName is required",
            });
        }
        if (FormHelper.isEmpty(mobile)) {
            return res.status(400).json({
                error: "Mobile is required",
            });
        }
        if (FormHelper.isEmpty(email)) {
            return res.status(400).json({
                error: "Email is required",
            });
        }
        if (FormHelper.isEmpty(qualification)) {
            return res.status(400).json({
                error: "Qualification is required",
            });
        }
        if (FormHelper.isEmpty(about)) {
            return res.status(400).json({
                error: "About is required",
            });
        }

        // console.log("body ", req.body);

        const teacher = await teacherService.createTeacherService(
            req.body,
            filename,
            options,
            createdBy
        );
        await session.commitTransaction();
        await session.endSession();
        res.status(201).json({
            message: "Mail send successfully"
        });
    } catch (e) {
        console.log("Transaction aborted:", e);
        await session.abortTransaction();
        session.endSession();
        next(e);
    }
};

exports.agreeTeacher = async (req, res, next) => {
    try {
        const agreeteacher = await teacherService.agreeTeacher(req.body);
        res.json(agreeteacher);
    } catch (error) {
        next(error);
    }
};

exports.getAllTeachers = async (req, res, next) => {
    try {
        const pageNo = req.params?.pageNo === ":pageNo" ? 1 : Number(req.params?.pageNo);
        const perPage = req.params?.perPage === ":perPage" ? 10 : Number(req.params?.perPage);
        const searchKeyword = req.params?.keyword === ':keyword' ? '0' : req.params?.keyword;
        const teachers = await teacherService.getAllTeacherService({pageNo, perPage, keyword: searchKeyword});
        res.status(200).json({teachers});
    } catch (e) {
        next(e)
    }
}
exports.getTeacherById = async (req, res, next) => {
    try {
        const {teacherId} = req.params || {};

        const result = await teacherService.getTeacherDetailsService(teacherId);
        res.status(200).json(result);
    } catch (e) {
        next(e)
    }
}


exports.teacherDropDown = async (req, res, next) => {
    try {


        const role = await RoleModel.findOne({name: 'teacher'});


        // const join= {
        //   $lookup: {
        //     from: "users",
        //     localField: "userId",
        //     foreignField: "_id",
        //     as: "teacher",
        //   },
        // }
        const projection = {
            firstName: 1,
            lastName: 1,
            label: {$concat: ["$firstName", ' ', "$lastName"]},
            value: "$_id"
        }

        const query = {
            roleId: new mongoose.Types.ObjectId(role?._id)
        }
        // $project: {
        //   userId: 1,
        //   value: "$userId",
        //   firstName: {$first: "$teacher.firstName"},
        //   lastName: {$first: "$teacher.lastName"},
        //   label:  {$concat: [{$first: "$teacher.firstName"}, ' ', {$first: "$teacher.lastName"}]},
        // }

        const result = await dropDownService(UserModel, projection, query);
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

// exports.applyTeacher = async (req, res, next) => {
//   const { firstName, lastName, mobile, email, qualification, about } = req.body;

//   const filename = {
//     public_id: req?.file?.cloudinaryId,
//     secure_url: req?.file?.cloudinaryUrl,
//   };

//   try {
//     if (FormHelper.isEmpty(firstName)) {
//       return res.status(400).json({
//         error: "firstName is required",
//       });
//     }
//     if (FormHelper.isEmpty(lastName)) {
//       return res.status(400).json({
//         error: "lastName is required",
//       });
//     }
//     if (FormHelper.isEmpty(mobile)) {
//       return res.status(400).json({
//         error: "mobile is required",
//       });
//     }
//     if (FormHelper.isEmpty(email)) {
//       return res.status(400).json({
//         error: "email is required",
//       });
//     }
//     if (FormHelper.isEmpty(qualification)) {
//       return res.status(400).json({
//         error: "qualification is required",
//       });
//     }
//     if (FormHelper.isEmpty(about)) {
//       return res.status(400).json({
//         error: "about is required",
//       });
//     }

//     console.log("body ", req.body);

//     const teacher = await teacherService.applyTeacherService(
//       req.body,
//       filename
//     );
//     res.json(teacher);
//   } catch (e) {
//     console.log(e);
//     next(e);
//   }
// };
