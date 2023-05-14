const router = require("express").Router();
const {
  isAdmin,
  authVerifyMiddleware,
} = require("../middleware/authMiddleware");
const categoryController = require("../controllers/blog/postCategoryController");

// cretae category
router.post(
  "/category",
  authVerifyMiddleware,
  isAdmin,
  categoryController.createCategory
);

// get category with pagination
router.get(
  "/category/:pageNo/:perPage/:searchKeyword",
  categoryController.getCategories
);

// get category with dropdown
router.get("/category/dropdown", categoryController.getCategorieDropdown);

// get category by slug
router.get("/category/:slug", categoryController.getCategoryBySlug);

// update category
router.put(
  "/category/:slug",
  authVerifyMiddleware,
  isAdmin,
  categoryController.updateCategoryById
);

// delete category
router.delete(
  "/category/:slug",
  authVerifyMiddleware,
  isAdmin,
  categoryController.deleteCategoryById
);

module.exports = router;
