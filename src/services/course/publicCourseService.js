const error = require("../../helpers/error");
const CourseModel = require("../../models/Course");
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const getAllPublishedCourse = async (filter, query) => {
  try {
    const { category, courseType } = filter;
    const { pageNo = 1, perPage = 10 } = query;

    let matchQuery = { status: "published" };

    // Filter by category
    // if (category && category.length > 0) {
    //   matchQuery.categoryId = { $in: category };
    // }
    // let categoryQuery;
    // if (category && category.length > 0) {
    //   categoryQuery = { $match: { categoryId: { $in: category } } };
    // }

    if (courseType) {
      matchQuery.courseType = courseType;
    }

    const course = await CourseModel.aggregate([
      { $match: matchQuery },
      // categoryQuery,
      {
        $lookup: {
          from: "users",
          localField: "teacherId",
          foreignField: "_id",
          as: "teacher",
        },
      },
      {
        $lookup: {
          from: "coursecategories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $project: {
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
        },
      },
      { $skip: (parseInt(pageNo) - 1) * parseInt(perPage) },
      { $limit: parseInt(perPage) },
    ]);

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

module.exports = { getAllPublishedCourse };
