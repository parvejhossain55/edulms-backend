const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const courseCategoryController = require('../controllers/course/courseCategoryController');
const permissions = require('../helpers/permissions');

// Course category routes
router.get('/categories', courseCategoryController.getCategories);

router.post('/categories',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.courseCategory.can_create_course_category),
    courseCategoryController.createCategory
);

router.patch('/categories/:id',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.courseCategory.can_edit_course_category),
    courseCategoryController.updateCategory
);
router.delete('/categories/:id',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.courseCategory.can_delete_course_category),
    courseCategoryController.deleteCategory
);


module.exports = router;
