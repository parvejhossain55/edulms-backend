const FormHelper = require("../../helpers/FormHelper");
const error = require("../../helpers/error");
const CourseModel = require("../../models/Course");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getAllPublishedCourse = async (filter, query) => {
  try {
    const { category, courseType } = filter;
    const { pageNo = 1, perPage = 10 } = query;

    // console.log("filter ", filter);
    // console.log("query ", query);

    let matchQuery = { status: "published" };

    // Filter by category
    if (category && category.length > 0) {
      matchQuery.categoryId = { $in: category };
    }

    if (courseType) {
      matchQuery.courseType = courseType;
    }

    console.log("matchQuery ", matchQuery);

    const course = await CourseModel.find(matchQuery)
      .populate({
        path: "teacherId",
        select: "firstName lastName picture",
      })
      .populate({
        path: "categoryId",
        select: "name",
      })
      .select({
        _id: 1,
        name: 1,
        description: 1,
        sellPrice: 1,
        regularPrice: 1,
        thumbnail: 1,
        benefit: 1,
        sold: 1,
        seats: 1,
        startingDate: 1,
        "teacher.firstName": 1,
        "teacher.lastName": 1,
        "teacher.picture": 1,
        "category._id": 1,
        "category.name": 1,
      })
      .skip((parseInt(pageNo) - 1) * parseInt(perPage))
      .limit(parseInt(perPage)).sort('-createdAt');

    const count = await CourseModel.countDocuments(matchQuery);
    const totalPages = Math.ceil(count / perPage);
    const currentPage = parseInt(pageNo);

    return {
      course,
      totalPages,
      currentPage,
      totalCourse: count,
    };
  } catch (err) {
    throw error(err.message, err.status);
  }
};

const getPublishedCourseByCategory = async (req) => {
  try {
    const { categoryId } = req.params;
    const { pageNo, perPage } = req.query;

    let matchQuery = {
      status: "published",
      categoryId: new ObjectId(categoryId),
    };

    const course = await CourseModel.find(matchQuery)
      .populate({
        path: "teacherId",
        select: "firstName lastName picture",
      })
      .populate({
        path: "categoryId",
        select: "name",
      })
      .select({
        _id: 1,
        name: 1,
        description: 1,
        sellPrice: 1,
        regularPrice: 1,
        thumbnail: 1,
        benefit: 1,
        sold: 1,
        seats: 1,
        startingDate: 1,
        "teacher.firstName": 1,
        "teacher.lastName": 1,
        "teacher.picture": 1,
        "category._id": 1,
        "category.name": 1,
      })
      .skip((parseInt(pageNo) - 1) * parseInt(perPage))
      .limit(parseInt(perPage)).sort('-createdAt');

    const count = await CourseModel.countDocuments(matchQuery);
    const totalPages = Math.ceil(count / perPage);
    const currentPage = parseInt(pageNo);

    return {
      course,
      totalPages,
      currentPage,
      totalCourse: count,
    };
  } catch (err) {
    throw error(err.message, err.status);
  }
};

module.exports = { getAllPublishedCourse, getPublishedCourseByCategory };
