const FormHelper = require("../../helpers/FormHelper");
const courseService = require("../../services/course/courseService");
const publicCourseService = require("../../services/course/publicCourseService");
const CourseModel = require("../../models/Course");
const mongoose = require("mongoose");
const findOneByProperty = require("../../services/common/findOneByProperty");
const findOneByQuery = require("../../services/common/findOneByQuery");
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
      seats,
      startingDate,
      endingDate,
      status,
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
    if (FormHelper.isEmpty(seats)) {
      return res.status(400).json({
        error: "Seats is required",
      });
    }
    if (FormHelper.isEmpty(startingDate)) {
      return res.status(400).json({
        error: "startingDate is required",
      });
    }
    if (FormHelper.isEmpty(endingDate)) {
      return res.status(400).json({
        error: "endingDate is required",
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
    const course = await courseService.createCourse({
      name,
      description,
      regularPrice,
      sellPrice,
      seats,
      startingDate,
      endingDate,
      teacherId,
      categoryId,
      benefit,
      filename,
      status,
    });
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
    const filter = req.body;
    const query = req.query;
    const course = await publicCourseService.getAllPublishedCourse(
      filter,
      query
    );
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
        error: "provide a valid course id",
      });
    }

    const query = { teacherId: new objectId(teacherId) };
    const course = await courseService.getAllCourse(query);
    res.status(200).json(course);
  } catch (e) {
    next(e);
  }
};

const getSingleCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = { _id: new objectId(id) };
    const course = await courseService.getSingleCourse(query);
    res.status(200).json(course);
  } catch (e) {
    next(e);
  }
};
const getPublishedSingleCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = { _id: new objectId(id), status: "published" };
    const course = await courseService.getSingleCourse(query);
    res.status(200).json({ course });
  } catch (e) {
    next(e);
  }
};
const getSingleCourseByTeacher = async (req, res, next) => {
  try {
    const id = req.params.id;
    const teacherId = req.params.teacherId;
    const query = { _id: new objectId(id), teacherId: new objectId(teacherId) };
    const course = await courseService.getSingleCourse(query);
    res.status(200).json(course);
  } catch (e) {
    next(e);
  }
};

const teacherUpdateCourse = async (req, res, next) => {
  try {
    const { name, description, categoryId, benefit } = req.body;
    const id = req.params.courseId;
    const teacherId = req.auth._id;
    if (!FormHelper.isIdValid(id)) {
      return res.status(400).json({
        error: "provide a valid course id",
      });
    }
    const filename = {
      public_id: req?.file?.cloudinaryId,
      secure_url: req?.file?.cloudinaryUrl,
    };
    const query = { _id: new objectId(id), teacherId: new objectId(teacherId) };
    const course = await findOneByQuery(query, CourseModel);
    if (!course) {
      return res.status(404).json({
        error: "course not found",
      });
    }
    const courseName = name !== "" ? name : course.name;
    const courseDescription =
      description !== "" ? description : course.description;
    const courseCategoryId = categoryId !== "" ? categoryId : course.categoryId;
    const courseBenefit = benefit !== "" ? benefit : course.benefit;
    const courseThumbnail = !req?.file?.cloudinaryUrl
      ? course.thumbnail
      : filename;

    const updateCourse = await courseService.updateCourse(
      {
        name: courseName,
        description: courseDescription,
        categoryId: courseCategoryId,
        benefit: courseBenefit,
        thumbnail: courseThumbnail,
      },
      { _id: new objectId(id), teacherId: new objectId(teacherId) }
    );

    res.status(200).json({
      course: updateCourse,
    });
  } catch (e) {
    next(e);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const {
      name,
      description,
      regularPrice,
      sellPrice,
      teacherId,
      categoryId,
      benefit,
      status,
    } = req.body;
    const id = req.params.courseId;

    if (!FormHelper.isIdValid(id)) {
      return res.status(400).json({
        error: "provide a valid course id",
      });
    }
    const filename = {
      public_id: req?.file?.cloudinaryId,
      secure_url: req?.file?.cloudinaryUrl,
    };
    const course = await findOneByProperty("_id", id, CourseModel);
    if (!course) {
      return res.status(404).json({
        error: "course not found",
      });
    }

    const courseName = !name ? course.name : name;
    const courseDescription = !description ? course.description : description;
    const courseCategoryId = !categoryId ? course.categoryId : categoryId;
    const courseTeacherId = !teacherId ? course.teacherId : teacherId;
    const courseBenefit =
      Array.isArray(benefit) && benefit.length > 0 ? benefit : course.benefit;
    const courseRegularPrice = !regularPrice
      ? course.regularPrice
      : regularPrice;
    const courseSellPrice = !sellPrice ? course.sellPrice : sellPrice;
    const courseStatus = !status ? course.status : status;
    const courseThumbnail = !req?.file?.cloudinaryUrl
      ? course.thumbnail
      : filename;

    const updateCourse = await courseService.updateCourse(
      {
        name: courseName,
        description: courseDescription,
        categoryId: courseCategoryId,
        teacherId: courseTeacherId,
        benefit: courseBenefit,
        thumbnail: courseThumbnail,
        status: courseStatus,
        regularPrice: courseRegularPrice,
        sellPrice: courseSellPrice,
      },
      { _id: new objectId(id) }
    );

    res.status(200).json({
      course: updateCourse,
    });
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
  teacherUpdateCourse,
  deleteCourse,
  getAllCourseByTeacher,
  getSingleCourseByTeacher,
  getAllPublishedCourse,
  getPublishedSingleCourse,
  updateCourse,
};
