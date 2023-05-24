const findOneByProperty = require("../common/findOneByProperty");
const CourseCategoryModel = require("../../models/CourseCategory");
const error = require("../../helpers/error");
const createService = require("../common/createService");
const mongoose = require("mongoose");
const updateService = require("../common/updateService");
const ObjectId = mongoose.Types.ObjectId;
const FormHelper = require("../../helpers/FormHelper");
const checkAssociateService = require("../common/checkAssociateService");
const CourseModel = require("../../models/Course");
const deleteService = require("../common/deleteServide");
const slugify = require("slugify");

const createCategory = async ({ name }) => {
  const isCategory = await findOneByProperty("name", name, CourseCategoryModel);
  if (isCategory) throw error("category already exits", 400);
  return createService({ name }, CourseCategoryModel);
};

// const getCategories = (pageNo, perPage, searchKeyword)=>{
//     return CourseCategoryModel.find({});
// }

const getAllCategories = async ({ pageNo = 1, perPage = 10 }) => {
  const skip = (pageNo - 1) * perPage;

  try {
    const categories = await CourseCategoryModel.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "categoryId",
          as: "courses",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          courseCount: { $size: "$courses" },
        },
      },
      { $skip: skip },
      { $limit: parseInt(perPage) },
    ]);
    return categories;
  } catch (err) {
    error(err.message, err.status);
  }
};

const updateCategory = async (catId, name) => {
  if (!FormHelper.isIdValid(catId)) throw error("id is not valid", 400);
  const isCategory = await CourseCategoryModel.findOne({
    name: name.toLowerCase(),
    _id: { $ne: new ObjectId(catId) },
  });
  if (isCategory) throw error("category already exits", 400);
  const slug = slugify(name);
  return updateService(
    { _id: new ObjectId(catId) },
    { name, slug },
    CourseCategoryModel
  );
};

const deleteCategory = async (catId) => {
  if (!FormHelper.isIdValid(catId)) throw error("id is not valid", 400);

  const isAssociate = await checkAssociateService(
    { categoryId: new ObjectId(catId) },
    CourseModel
  );
  if (isAssociate)
    throw error("You can't delete. Category associate with course");

  return deleteService({ _id: new ObjectId(catId) }, CourseCategoryModel);
};

module.exports = {
  createCategory,
  // getCategories,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
