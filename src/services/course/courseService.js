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

const getAllCourse = async (Request, SearchArray) => {
  try {
    let pageNo = Number(Request.params.pageNo) || 1;
    let perPage = Number(Request.params.perPage) || 10;
    let searchValue = Request.params.searchKeyword;

    let data;

    let matchQuery = { status: "published" };
    if (searchValue !== "0") {
      let SearchArray = [
        { name: { $regex: searchValue, $options: "i" } },
        { description: { $regex: searchValue, $options: "i" } },
      ];
      matchQuery.$or = SearchArray;
    }

    const count = await CourseModel.countDocuments(matchQuery);
    const totalPages = Math.ceil(count / perPage);

    data = await CourseModel.aggregate([
      { $match: matchQuery },
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
      { $skip: (pageNo - 1) * perPage },
      { $limit: perPage },
    ]);

    const currentPage = parseInt(pageNo);

    return {
      courses: data,
      totalPages,
      currentPage,
      totalCourse: count,
    };
  } catch (err) {
    throw error(err.message, err.status);
  }
};

const getAllCourseByTeacher = async (
    {pageNo, perPage, keyword, teacherId}
)=>{

  const skipPage = (pageNo - 1) * perPage;
  const query = { teacherId: new ObjectId(teacherId) };

  const teacherCourses = await CourseModel.aggregate([
    {$match: query},
    {
      $facet:{
        total:[{$count: "count"}],
        rows:[
          {$skip: skipPage},
          {$limit: perPage},
          {$sort: {createdAt: -1}}
        ]
      }
    },


  ])

  return {total: teacherCourses[0]?.total[0]?.count, rows: teacherCourses[0]?.rows};
}

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
        startingDate: 1,
        endingDate: 1,
        seats: 1,
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
  getAllCourseByTeacher
};
