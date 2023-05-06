const mongoose = require("mongoose");
const findUserByProperty = require("../services/common/findOneByProperty");
const rolePermissionService = require("./userManage/rolePermissionService");
const userService = require("./userService");
const TeacherProfile = require("../models/TeacherProfile");
const User = require("../models/User");
const generatePassword = require("../helpers/generatePassword");
const emailTemplate = require("../emailTemplate/forNewTeacher");
const sendEmail = require("../helpers/sendEmail");
const error = require("../helpers/error");

exports.applyTeacherService = async (teacherData, filename) => {
  const {
    firstName,
    lastName,
    email,
    mobile,
    about,
    qualification,
    categoryId,
  } = teacherData;

  let session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await findUserByProperty("email", email, User);

    if (!user) {
      let isRole = await rolePermissionService.roleFindByProperty(
        "name",
        "teacher"
      );

      if (!isRole) {
        isRole = await rolePermissionService.createNewRoleService(
          {
            roleName: "teacher",
          },
          session
        );
      }

      // generate password for user
      const password = generatePassword();

      const user = await userService.createNewUser(
        {
          email,
          mobile,
          firstName,
          lastName,
          password: password,
          confirmPassword: password,
          picture: filename,
          roleId: isRole?._id,
        },
        session
      );

      const teacher = await createTeacherProfile(
        {
          userId: user._id,
          qualification,
          about,
          categoryId,
        },
        session
      );

      await session.commitTransaction();
      await session.endSession();

      // email send korte hobe
      const sendEmail = await sendEmailToTeacher(user._id, {
        email,
        password,
        subject: "Apply teacher at lead educare",
      });

      if (sendEmail) {
        return { message: "Check your email and click agree button" };
      }

      throw error("Cant create teacher profile", 400);
    } else {
      const teacher = await createTeacherProfile(
        {
          userId: user._id,
          qualification,
          about,
          categoryId,
        },
        session
      );

      await session.commitTransaction();
      await session.endSession();

      const sendEmail = await sendEmailToTeacher(user._id, {
        email,
        password,
        subject: "Apply teacher at lead educare",
      });

      if (!sendEmail) {
        await session.abortTransaction();
        session.endSession;
        throw error("Cant create teacher profile", 400);
      }

      return { message: "Email successfully send" };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession;
    throw error("Teacher Application Failed", error.status);
  }
};

const createTeacherProfile = async (teacherData, session = null) => {
  try {
    const teacher = new TeacherProfile(teacherData);
    await teacher.save({ session });
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
