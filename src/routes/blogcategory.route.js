const router = require("express").Router();
const {
  isAdmin,
  authVerifyMiddleware,
} = require("../middleware/authMiddleware");
const categoryController = require("../controllers/blog/postCategoryController");

// cretae category
router.post(
  "/blog/category",
  authVerifyMiddleware,
  isAdmin,
  categoryController.createCategory
);

// get category with pagination
router.get(
  "/blog/category/:pageNo/:perPage/:searchKeyword",
  categoryController.getCategories
);

// get category with dropdown
router.get("/blog/category/dropdown", categoryController.getCategorieDropdown);

// get category by slug
router.get("/blog/category/:slug", categoryController.getCategoryBySlug);

// update category
router.put(
  "/blog/category/:slug",
  authVerifyMiddleware,
  isAdmin,
  categoryController.updateCategoryBySlug
);

// delete category
router.delete(
  "/blog/category/:id",
  authVerifyMiddleware,
  isAdmin,
  categoryController.deleteCategoryById
);

module.exports = router;
