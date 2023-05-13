const router = require("express").Router();
const {
  isAdmin,
  authVerifyMiddleware,
} = require("../middleware/authMiddleware");
const categoryController = require("../controllers/blog/postCategoryController");

router.post(
  "/category",
  authVerifyMiddleware,
  isAdmin,
  categoryController.createCategory
);
router.get(
  "/category/:pageNo/:perPage/:searchKeyword",
  categoryController.getCategories
);
router.get("/category/:slug", categoryController.getCategoryBySlug);
router.put(
  "/category/:slug",
  authVerifyMiddleware,
  isAdmin,
  categoryController.updateCategoryById
);
router.delete(
  "/category/:slug",
  authVerifyMiddleware,
  isAdmin,
  categoryController.deleteCategoryById
);

module.exports = router;
