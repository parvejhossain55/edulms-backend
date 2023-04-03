const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const courseCategoryController = require('../controllers/course/courseCategoryController');

// Course category routes
router.get('/course/categories', courseCategoryController.getCategories);

router.post('/course/categories',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions('can_create_category'),
    courseCategoryController.createCategory
);

router.patch('/course/categories/:id',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions('can_update_category'),
    courseCategoryController.updateCategory
);
router.delete('/course/categories/:id',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions('can_delete_category'),
    courseCategoryController.deleteCategory
);


module.exports = router;
