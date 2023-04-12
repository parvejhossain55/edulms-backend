const FormHelper = require("../../helpers/FormHelper");
const courseService = require("../../services/course/courseService");
const CourseModel = require('../../models/Course');
const mongoose = require('mongoose');
const findOneByProperty = require("../../services/common/findOneByProperty");
const objectId = mongoose.Types.ObjectId;
const createCourse = async (req, res, next) => {
  try {
    const {
      name,
      description,
      regularPrice,
      sellPrice,
      teacherId,
      categoryId,
      benefit,
      thumbnail,
    } = req.body;

    const filename = {
      public_id: req?.file?.cloudinaryId,
      secure_url: req?.file?.cloudinaryUrl,
    };

    if (FormHelper.isEmpty(name)) {
      return res.status(400).json({
        error: "course name is required",
      });
    }
    if (FormHelper.isEmpty(regularPrice)) {
      return res.status(400).json({
        error: "Regular price is required",
      });
    }
    if (!FormHelper.isIdValid(teacherId)) {
      return res.status(400).json({
        error: "provide a valid teacher",
      });
    }
    if (!FormHelper.isIdValid(categoryId)) {
      return res.status(400).json({
        error: "provide a valid category",
      });
    }
    const course = await courseService.createCourse({name, description, regularPrice, sellPrice, teacherId, categoryId, benefit, filename})
    res.status(201).json(course);
  } catch (e) {
    next(e);
  }
};

const getAllCourse = async (req, res, next) => {
  try {
    const query = {};
    const course = await courseService.getAllCourse(query);
    res.status(200).json(course);
  } catch (e) {
    next(e);
  }
};
const getAllPublishedCourse = async (req, res, next) => {
  try {
    const query = {status: 'published'};
    const course = await courseService.getAllCourse(query);
    res.status(200).json(course);
  } catch (e) {
    next(e);
  }
};
const getAllCourseByTeacher = async (req, res, next) => {
  try {
    const teacherId = req.params.teacherId;

    if (!FormHelper.isIdValid(teacherId)) {
      return res.status(400).json({
        error: 'provide a valid course id'
      })
    }

    const query = {teacherId: new objectId(teacherId)};
    const course = await courseService.getAllCourse(query);
    res.status(200).json(course);
  } catch (e) {
    next(e);
  }
};

const getSingleCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = {_id: new objectId(id)}
    const course = await courseService.getSingleCourse(query);
    res.status(200).json(course);
  } catch (e) {
    next(e);
  }
};
const getPublishedSingleCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = {_id: new objectId(id), status: 'published'}
    const course = await courseService.getSingleCourse(query);
    res.status(200).json({course});
  } catch (e) {
    next(e);
  }
};
const getSingleCourseByTeacher = async (req, res, next) => {
  try {
    const id = req.params.id;
    const teacherId = req.params.teacherId;
    const query = {_id: new objectId(id), teacherId: new objectId(teacherId)}
    const course = await courseService.getSingleCourse(query);
    res.status(200).json(course);
  } catch (e) {
    next(e);
  }
};


const updateCourse = async (req, res, next) => {
  try {
    const {
      name,
      description,
      categoryId,
      benefit,
    } = req.body;
    const id = req.params.courseId;
    const teacherId = req.auth._id;
    if (!FormHelper.isIdValid(id)) {
      return res.status(400).json({
        error: 'provide a valid course id'
      })
    }
    const filename = {
      public_id: req?.file?.cloudinaryId,
      secure_url: req?.file?.cloudinaryUrl,
    };
    const query = {_id: new objectId(id), teacherId: new objectId(teacherId)}
    const course = await courseService.getSingleCourse(query);
    if (!course){
      return res.status(404).json({
        error: 'course not found'
      })
    }
    const courseName = name !== "" ? name : course.name;
    const courseDescription = description !== "" ? description : course.description;
    const courseCategoryId = categoryId !== "" ? categoryId : course.categoryId;
    const courseBenefit = benefit !== "" ? benefit : course.benefit;
    const courseThumbnail = !req?.file?.cloudinaryUrl ? course.thumbnail: filename;
    console.log(courseThumbnail)

    const updateCourse = await courseService.updateCourse({
      name: courseName,
      description: courseDescription,
      categoryId: courseCategoryId,
      benefit: courseBenefit,
      thumbnail: courseThumbnail
    }, id, teacherId);

    res.status(200).json({
      course: updateCourse
    })

  } catch (e) {
    next(e);
  }
};
const deleteCourse = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  getAllCourseByTeacher,
  getSingleCourseByTeacher,
  getAllPublishedCourse,
  getPublishedSingleCourse
};
