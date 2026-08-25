const courseCategoryController = require("../controllers/course/courseCategoryController");
const authMiddleware = require("../middleware/authMiddleware");
const { permissions } = require("../dbSeed/projectPermissions");
const router = require("express").Router();

router.get(
  "/courses/categories/:pageNo/:perPage/:searchKeyword",
  courseCategoryController.getCategories
);
router.get(
  "/courses/all-categories/:pageNo/:perPage",
  courseCategoryController.getAllCategories
); // for frontend
router.get("/courses/categories/:id", courseCategoryController.getCategorybyID);
router.get("/courses/categories", courseCategoryController.dropDownCategories);

router.post(
  "/courses/categories",
  authMiddleware.authVerifyMiddleware,
  authMiddleware.checkPermissions(
    permissions.courseCategory.can_create_course_category
  ),
  courseCategoryController.createCategory
);

router.patch(
  "/courses/categories/:id",
  authMiddleware.authVerifyMiddleware,
  authMiddleware.checkPermissions(
    permissions.courseCategory.can_edit_course_category
  ),
  courseCategoryController.updateCategory
);
router.delete(
  "/courses/categories/:id",
  authMiddleware.authVerifyMiddleware,
  authMiddleware.checkPermissions(
    permissions.courseCategory.can_delete_course_category
  ),
  courseCategoryController.deleteCategory
);

module.exports = router;
