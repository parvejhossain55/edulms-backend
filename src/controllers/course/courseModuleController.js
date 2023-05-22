const FormHelper = require("../../helpers/FormHelper");
const CourseModule = require("../../models/CourseModule");
const CourseModel = require("../../models/Course");
const dropDownService = require("../../services/common/dropDownService");
const findAllService = require("../../services/common/findAllService");
const listService = require("../../services/common/listService");
const courseModuleService = require("../../services/course/courseModuleService");
const mongoose = require("mongoose");
const checkAssociateService = require("../../services/common/checkAssociateService");

const createModule = async (req, res, next) => {
  try {
    const { courseId, title, moduleNo } = req.body;

    if (!FormHelper.isIdValid(courseId)) {
      return res.status(400).json({
        error: "Provide valid course",
      });
    }
    if (FormHelper.isEmpty(title)) {
      return res.status(400).json({
        error: "Module name is required",
      });
    }
    if (FormHelper.isEmpty(moduleNo)) {
      return res.status(400).json({
        error: "Module number is required",
      });
    }

    const module = await courseModuleService.createService({
      courseId,
      title,
      moduleNo,
    });
    res.status(201).json(module);
  } catch (e) {
    next(e);
  }
};

const getModules = async (req, res, next) => {
  try {
    let SearchRgx = { $regex: req.params.searchKeyword, $options: "i" };
    let SearchArray = [{ name: SearchRgx }];
    const modules = await listService(req, CourseModule, SearchArray);
    res.status(200).json(modules);
  } catch (e) {
    next(e);
  }
};

const getModulesbyID = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const module = await findAllService({ courseId }, CourseModule);
    res.status(200).json(module);
  } catch (e) {
    next(e);
  }
};

const dropDownModules = async (req, res, next) => {
  try {
    const projection = {
      label: "$title",
      value: "$_id",
      title: 1,
    };
    const {courseId} = req.params || {};
    const query = {
      courseId: new mongoose.Types.ObjectId(courseId)
    }
    const modules = await dropDownService(CourseModule, projection, query);
    res.status(200).json(modules);
  } catch (e) {
    next(e);
  }
};

const updateModule = async (req, res, next) => {
  try {
    const moduleId = req.params.id;
    const { title, moduleNo } = req.body;
    if (FormHelper.isEmpty(title)) {
      res.status(400).json({
        error: "Modules Title is required",
      });
    }
    if (FormHelper.isEmpty(moduleNo)) {
      res.status(400).json({
        error: "Modules No is required",
      });
    }

    const module = await courseModuleService.updateModule(moduleId, {title, moduleNo});
    res.status(200).json({ module });
  } catch (e) {}
};

const deleteModule = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

const dropDownModuleByCourseAndTeacher = async (req, res, next)=>{
  try {
    const projection = {
      label: "$title",
      value: "$_id",
      title: 1,
    };
    const {courseId} = req.params || {};
    const teacherId = req.auth?._id;

    if (!FormHelper.isIdValid(courseId)){
      return res.status(400).json({
        error: 'please provide a valid course id'
      })
    }
    if (!FormHelper.isIdValid(teacherId)){
      return res.status(400).json({
        error: 'please provide a valid teacher id'
      })
    }

    const associateQuery = {_id: new mongoose.Types.ObjectId(courseId), teacherId: new mongoose.Types.ObjectId(teacherId)}

    const isCourse = await checkAssociateService(associateQuery, CourseModel);
    if (!isCourse){
      return res.status(200).json({
        error: 'course not found'
      })
    }


    const query = {
      courseId: new mongoose.Types.ObjectId(courseId),
    }
    const modules = await dropDownService(CourseModule, projection, query);
    res.status(200).json(modules);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createModule,
  getModules,
  getModulesbyID,
  dropDownModules,
  updateModule,
  dropDownModuleByCourseAndTeacher
};
