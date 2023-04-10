const imageCompress = require("../helpers/imageCompress");
const teacherService = require("../services/teacherService");

exports.applyTeacher = async (req, res, next) => {
  //   const { firstName, lastName, mobile, email, qualification, about } = req.body;
  const picture = req.file.filename;
  try {
    await imageCompress(picture);
    const teacher = await teacherService.applyTeacherService(req.body, picture);
    res.json(teacher);
  } catch (e) {
    console.log(e);
    next(e);
  }
};
