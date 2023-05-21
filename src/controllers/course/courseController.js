const FormHelper = require("../../helpers/FormHelper");
const courseService = require("../../services/course/courseService");
const publicCourseService = require("../../services/course/publicCourseService");
const CourseModel = require("../../models/Course");
const mongoose = require("mongoose");
const findOneByProperty = require("../../services/common/findOneByProperty");
const findOneByQuery = require("../../services/common/findOneByQuery");
const dropDownService = require("../../services/common/dropDownService");
const DataModel = require("../../models/CourseCategory");
const TeacherModel = require("../../models/TeacherProfile");
const objectId = mongoose.Types.ObjectId;
const findAllOneJoinService = require("../../services/common/findAllOneJoinService");
const PurchaseModule = require("../../models/Purchase");
const checkAssociateService = require("../../services/common/checkAssociateService");
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
      status,
      courseType,
    } = req.body || {};

    const filename = {
      public_id: req?.file?.cloudinaryId,
      secure_url: req?.file?.cloudinaryUrl,
    };

    if (FormHelper.isEmpty(name)) {
      return res.status(400).json({
        error: "Course name is required",
      });
    }
    if (FormHelper.isEmpty(regularPrice)) {
      return res.status(400).json({
        error: "Regular price is required",
      });
    }

    if (!FormHelper.isIdValid(teacherId)) {
      return res.status(400).json({
        error: "Provide a valid teacher",
      });
    }
    if (!FormHelper.isIdValid(categoryId)) {
      return res.status(400).json({
        error: "Provide a valid category",
      });
    }
    const course = await courseService.createCourse({
      name,
      description,
      regularPrice,
      sellPrice,
      teacherId,
      categoryId,
      benefit,
      status,
      courseType,
      filename,
    });
    res.status(201).json(course);
  } catch (e) {
    next(e);
  }
};

// const getAllCourse = async (req, res, next) => {
//     try {
//         const query = {};
//         const course = await courseService.getAllCourse(query);
//         res.status(200).json(course);
//     } catch (e) {
//         next(e);
//     }
// };
const getAllCourse = async (req, res, next) => {
  try {
    const query = {};

    const course = await courseService.getAllCourse(req);
    res.status(200).json(course);
  } catch (e) {
    next(e);
  }
};

// Student my course
const getMyAllCourse = async (req, res, next) => {
  try {
    const pageNo =
        req.params?.pageNo === ":pageNo" ? 1 : Number(req.params?.pageNo);
    const perPage =
        req.params?.perPage === ":perPage" ? 10 : Number(req.params?.perPage);

    const query = { studentId: new objectId(req.auth?._id) };
    const course = await courseService.getMyAllCourse(pageNo, perPage, query);
    res.status(200).json(course);
  } catch (e) {
    next(e);
  }
};

const getMySingleCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;

    if (!FormHelper.isIdValid(courseId)){
      return res.status(400).json({
        error: 'provide a valid course id'
      })
    }
    const studentId = req.auth?._id;
    const query = { _id: new objectId(courseId) };
    const isCourse = await checkAssociateService({'courseId': new objectId(courseId) , studentId: new objectId(studentId) }, PurchaseModule);

    if (!isCourse){
      return res.status(400).json({
        error: 'course not found'
      })
    }

    const course = await courseService.getSingleCourse(query);
    res.status(200).json(course);
  } catch (e) {
    next(e);
  }
};

// Student my course end

const getAllCoursePagiController = async (req, res, next) => {
  try {
    const query = {};

    const course = await courseService.getAllCoursePagination(req);
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

const getPublishedCourseByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    if (!FormHelper.isIdValid(categoryId)) {
      return res.status(400).json({ error: "Invalid Category Id" });
    }

    const course = await publicCourseService.getPublishedCourseByCategory(req);
    res.status(200).json(course);
  } catch (e) {
    next(e);
  }
};

const getAllCourseByTeacher = async (req, res, next) => {
  try {
    const pageNo =
      req.params?.pageNo === ":pageNo" ? 1 : Number(req.params?.pageNo);
    const perPage =
      req.params?.perPage === ":perPage" ? 10 : Number(req.params?.perPage);
    const keyword =
      req.params?.keyword === ":keyword" ? "0" : req.params?.keyword;
    const teacherId = req?.auth?._id;

    if (!FormHelper.isIdValid(teacherId)) {
      return res.status(400).json({
        error: "provide a valid teacher object id",
      });
    }

    const course = await courseService.getAllCourseByTeacher({
      pageNo,
      perPage,
      keyword,
      teacherId,
    });
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
    const courseId = req.params?.courseId;
    const teacherId = req.auth?._id;
    const query = {
      _id: new objectId(courseId),
      teacherId: new objectId(teacherId),
    };
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
      courseType,
    } = req.body;
    const id = req.params.courseId;

    if (!FormHelper.isIdValid(id)) {
      return res.status(400).json({
        error: "Provide a valid course id",
      });
    }
    const filename = {
      public_id: req?.file?.cloudinaryId,
      secure_url: req?.file?.cloudinaryUrl,
    };
    const course = await findOneByProperty("_id", id, CourseModel);
    if (!course) {
      return res.status(404).json({
        error: "Course not found",
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
    const coursesType = !courseType ? course.courseType : courseType;
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
        courseType: coursesType,
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
const dropDownCourses = async (req, res, next) => {
  try {
    const projection = {
      label: "$name",
      value: "$_id",
      name: 1,
    };
    const result = await dropDownService(CourseModel, projection);
    res.status(200).json(result);
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
  getPublishedCourseByCategory,
  getPublishedSingleCourse,
  updateCourse,
  getAllCoursePagiController,
  dropDownCourses,
  getMyAllCourse,
  getMySingleCourse
};
