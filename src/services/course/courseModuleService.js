const CourseModule = require("../../models/CourseModule");
const error = require("../../helpers/error");
const mongoose = require("mongoose");
const FormHelper = require("../../helpers/FormHelper");
const updateService = require("../common/updateService");
const ObjectId = mongoose.Types.ObjectId;

const createService = async ({ courseId, title, moduleNo }) => {
  const isModule = await CourseModule.findOne({
    $or: [
      { courseId: new ObjetId(courseId), title: title },
      { courseId: new ObjetId(courseId), moduleNo },
    ],
  });
  if (isModule?.title === title) throw error("Module name already exits", 400);
  if (isModule?.moduleNo === moduleNo)
    throw error("Module Number already exits", 400);

  const courseModule = new CourseModule({ courseId, title, moduleNo });
  return courseModule.save();
};

const updateModule = async (moduleId, { title, moduleNo }) => {
  if (!FormHelper.isIdValid(moduleId)) throw error("id is not valid", 400);

  const isModule = await CourseModule.findOne({
    title: title,
    _id: { $ne: new ObjectId(moduleId) },
  });

  if (isModule) throw error("module already exits", 400);

  return updateService(
    { _id: new ObjectId(moduleId) },
    { title, moduleNo },
    CourseModule
  );
};

module.exports = { createService, updateModule };
