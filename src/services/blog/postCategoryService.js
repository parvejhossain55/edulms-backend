const error = require("../../helpers/error");
const Category = require("../../models/PostCategory");

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

async function updateCategoryById(slug, updateData) {
  try {
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
  return Category.deleteOne({ _id: id });
}

module.exports = {
  createCategory,
  getCategoryBySlug,
  updateCategoryById,
  deleteCategoryById,
};
