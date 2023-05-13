const FormHelper = require("../../helpers/FormHelper");
const PostCategory = require("../../models/PostCategory");
const categoryService = require("../../services/blog/postCategoryService");
const listService = require("../../services/common/listService");

async function createCategory(req, res, next) {
  try {
    const { name, slug } = req.body;
    if (FormHelper.isEmpty(name)) {
      return res.status(400).json({ error: "Category Name is required" });
    }
    if (FormHelper.isEmpty(slug)) {
      return res.status(400).json({ error: "Category Slug is required" });
    }
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

async function getCategories(req, res, next) {
  try {
    let SearchRgx = { $regex: req.params.searchKeyword, $options: "i" };
    let SearchArray = [{ name: SearchRgx }];
    const categories = await listService(req, PostCategory, SearchArray);
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
}

async function getCategoryBySlug(req, res, next) {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (err) {
    next(err);
  }
}

async function updateCategoryById(req, res, next) {
  try {
    const { name, slug } = req.body;
    if (FormHelper.isEmpty(name)) {
      return res.status(400).json({ error: "Category Name is required" });
    }
    if (FormHelper.isEmpty(slug)) {
      return res.status(400).json({ error: "Category Slug is required" });
    }

    const category = await categoryService.updateCategoryById(req.params.slug, {
      name,
      slug,
    });

    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (err) {
    next(err);
  }
}

async function deleteCategoryById(req, res, next) {
  try {
    const result = await categoryService.deleteCategoryById(req.params.id);
    if (result.deletedCount > 0) {
      res.json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategoryById,
  deleteCategoryById,
};
