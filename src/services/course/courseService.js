const CourseModel = require("../../models/Course");
const error = require("../../helpers/error");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const createCourse = async ({
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
}) => {
  const isMatch = await CourseModel.findOne({ name });

  if (isMatch) throw error("Course name already exits", 400);

  const course = new CourseModel({
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
    thumbnail: filename,
    status,
  });
  return await course.save();
};

const getAllCourse = async (query) => {
  return CourseModel.find(query)
    .populate("teacherId", "firstName lastName picture")
    .populate("categoryId", "name");
};

const getSingleCourse = async (query) => {
  const course = await CourseModel.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "coursecategories",
        foreignField: "_id",
        localField: "categoryId",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "teacherId",
        as: "teacher",
      },
    },
    { $unwind: "$teacher" },
    {
      $lookup: {
        from: "teacherprofiles",
        foreignField: "teacher.userId",
        localField: "userId",
        as: "teacherProfile",
      },
    },
    {
      $lookup: {
        from: "coursemodules",
        foreignField: "courseId",
        localField: "_id",
        as: "modules",
      },
    },
    {
      $lookup: {
        from: "coursecontents",
        foreignField: "moduleId",
        localField: "modules._id",
        as: "contents",
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        regularPrice: 1,
        sellPrice: 1,
        benefit: 1,
        thumbnail: 1,
        createdAt: 1,
        updatedAt: 1,
        slug: 1,
        modules: {
          $map: {
            input: "$modules",
            as: "module",
            in: {
              _id: "$$module._id",
              name: "$$module.title",
              moduleNo: "$$module.moduleNo",
              contents: {
                $filter: {
                  input: "$contents",
                  as: "content",
                  cond: { $eq: ["$$content.moduleId", "$$module._id"] },
                },
              },
            },
          },
        },
        teacher: {
          firstName: "$teacher.firstName",
          lastName: "$teacher.lastName",
          email: "$teacher.email",
          designation: { $first: "$teacherProfile.designation" },
          about: { $first: "$teacherProfile.about" },
          avatar: { $first: "$teacherProfile.avatar" },
        },
        category: { $first: "$category.name" },
      },
    },
  ]);
  return course[0];
};
const updateCourse = async (updateObj, query) => {
  return CourseModel.updateOne(query, { $set: updateObj });
};
const deleteCourse = async () => {};

module.exports = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};
