const router = require('express').Router();

const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const permissions = require("../helpers/permissions");
const manageUserController = require("../controllers/userManage/userManageController");
const rolePermissionController = require("../controllers/userManage/rolePermissionController");
const courseController = require("../controllers/course/courseController");
const upload = require("../helpers/fileUpload");
const courseCategoryController = require("../controllers/course/courseCategoryController");
const courseModuleController = require("../controllers/course/courseModuleController");
const courseContentController = require("../controllers/course/courseContentController");

/**
 * Auth Routes
 */

router.get('/auth-check', authMiddleware.authVerifyMiddleware, (req, res)=>{
    res.status(200).json({ok: true});
});
router.get('/superadmin-check', authMiddleware.authVerifyMiddleware, authMiddleware.isSuperAdmin, (req, res)=>{
    res.status(200).json({ok: true});
});

router.get('/permission-check', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions('can_delete_user'), (req, res)=>{
    res.status(200).json({ok: true});
});
router.get('/admin-check', authMiddleware.authVerifyMiddleware, authMiddleware.isAdmin, (req, res)=>{
    res.status(200).json({ok: true});
});

router.post('auth/register', authController.register);
router.post('auth/login', authController.login);
router.get('auth/:email/:otp', authController.verifyOTP);
router.patch('auth/:email/:otp', authController.resetPassword);
router.get('auth/:email', authController.sendOtp);
router.patch('auth/password', authMiddleware.authVerifyMiddleware , authController.passwordChange);
router.post("auth/social-login", authController.socialLogin)


/**
 * User Routes
 */

router.patch('/users', authMiddleware.authVerifyMiddleware, userController.patchUser);
router.get('/users', authMiddleware.authVerifyMiddleware, userController.getUserProfile);
router.post('/users', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.user.can_create_user), manageUserController.createUser);

/**
 * Role Permissions routes
 */
router.get('/roles/', authMiddleware.authVerifyMiddleware,  authMiddleware.checkPermissions(permissions.roles.can_view_role), rolePermissionController.getRoles);
router.post('/roles/', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.roles.can_create_role), rolePermissionController.createRole);
router.delete('/roles/:id', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.roles.can_delete_role), rolePermissionController.deleteRole);
router.post('/roles/permissions',authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions('can_create_permission'), rolePermissionController.createPermission);


/**
 * Course Categories Routes
 */

router.get('/courses/categories', courseCategoryController.getCategories);

router.post('/courses/categories',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.courseCategory.can_create_course_category),
    courseCategoryController.createCategory
);

router.patch('/courses/categories/:id',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.courseCategory.can_edit_course_category),
    courseCategoryController.updateCategory
);
router.delete('/courses/categories/:id',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.courseCategory.can_delete_course_category),
    courseCategoryController.deleteCategory
);

/**
 * Course Modules routes
 */

router.get('/courses/modules', (req, res)=>{
    res.send('course modules')
})
router.post('/courses/modules',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.course.can_create_course),
    courseModuleController.createModule
);

/**
 * Course Contents routes
 */
router.get('/courses/contents', (req, res)=>{
    res.send('course contents')
})
router.post('/courses/contents',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.courseContent.can_create_content),
    courseContentController.createContent
);

/**
 * Course Routesgit
 */
router.get('/courses/:id',  courseController.getSingleCourse)
router.get('/courses',  courseController.getAllCourse)
router.post('/courses',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.course.can_create_course),
    upload.single('thumbnail'),
    courseController.createCourse
);

module.exports = router;