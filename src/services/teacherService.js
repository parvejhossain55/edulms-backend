const mongoose = require("mongoose");
const findUserByProperty = require("../services/common/findOneByProperty");
const rolePermissionService = require("./userManage/rolePermissionService");
const userService = require("./userService");
const TeacherProfile = require("../models/TeacherProfile");

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
    const user = await findUserByProperty("email", email);

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

      const user = await userService.createNewUser(
        {
          email,
          mobile,
          firstName,
          lastName,
          password: "",
          confirmPassword: "",
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

      return { user, teacher };

      //   email send korte hobe
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

      return { teacher };
    }
  } catch (error) {
    await session.abortTransaction();
    await session.endSession;
    return error;
  }
};

const createTeacherProfile = async (teacherData, session = null) => {
  const teacher = new TeacherProfile(teacherData);
  await teacher.save({ session });
};
