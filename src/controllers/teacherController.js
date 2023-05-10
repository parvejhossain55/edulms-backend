const FormHelper = require("../helpers/FormHelper");
const teacherService = require("../services/teacherService");
const mongoose = require("mongoose");

exports.createTeacher = async (req, res, next) => {
  const { firstName, lastName, mobile, email, qualification, about } = req.body;
  const filename = {
    public_id: req?.file?.cloudinaryId,
    secure_url: req?.file?.cloudinaryUrl,
  };

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
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
        error: "mobile is required",
      });
    }
    if (FormHelper.isEmpty(email)) {
      return res.status(400).json({
        error: "email is required",
      });
    }
    if (FormHelper.isEmpty(qualification)) {
      return res.status(400).json({
        error: "qualification is required",
      });
    }
    if (FormHelper.isEmpty(about)) {
      return res.status(400).json({
        error: "about is required",
      });
    }

    // console.log("body ", req.body);

    const teacher = await teacherService.createTeacherService(
      req.body,
      filename,
      options
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
