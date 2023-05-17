const error = require("../../helpers/error");
const Category = require("../../models/PostCategory");
const findOneByQuery = require("../common/findOneByQuery");

async function createCategory(categoryData) {
  try {
    const category = new Category(categoryData);
    return category.save();
  } catch (err) {
    throw error(err.message, err.status);
  }
}

async function getCategoryBySlug(slug) {
  try {
    return await Category.findOne({ slug });
  } catch (err) {
    throw error(err.message, err.status);
  }
}

async function updateCategoryBySlug(slug, updateData) {
  try {
    const checkCategory = await findOneByQuery(
      { slug: updateData.slug },
      Category
    );
    if (checkCategory) throw error("Name already exists, Must be Unique", 400);

    return await Category.findOneAndUpdate(
      { slug },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  } catch (err) {
    throw error(err.message, err.status);
  }
}

async function deleteCategoryById(id) {
  const category = await Category.deleteOne({ _id: id });
  return category;
}

module.exports = {
  createCategory,
  getCategoryBySlug,
  updateCategoryBySlug,
  deleteCategoryById,
};
