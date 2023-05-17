const slugify = require("slugify");
const FormHelper = require("../../helpers/FormHelper");
const PostCategory = require("../../models/PostCategory");
const categoryService = require("../../services/blog/postCategoryService");
const dropDownService = require("../../services/common/dropDownService");
const listService = require("../../services/common/listService");

async function createCategory(req, res, next) {
  try {
    const { name } = req.body;
    if (FormHelper.isEmpty(name)) {
      return res.status(400).json({ error: "Category Name is required" });
    }
    req.body.slug = slugify(name, { lower: true });
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

async function getCategorieDropdown(req, res, next) {
  try {
    const projection = {
      label: "$name",
      value: "$_id",
      name: 1,
    };
    const categories = await dropDownService(PostCategory, projection);
    res.status(200).json(categories);
  } catch (e) {
    next(e);
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

async function updateCategoryBySlug(req, res, next) {
  try {
    const { name } = req.body;
    if (FormHelper.isEmpty(name)) {
      return res.status(400).json({ error: "Category Name is required" });
    }
    req.body.slug = slugify(name, { lower: true });
    const category = await categoryService.updateCategoryBySlug(
      req.params.slug,
      req.body
    );

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
  getCategorieDropdown,
  getCategoryBySlug,
  updateCategoryBySlug,
  deleteCategoryById,
};
