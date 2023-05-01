const courseController = require("../controllers/course/courseController");
const authMiddleware = require("../middleware/authMiddleware");
const {permissions} = require("../dbSeed/projectPermissions");
const {upload, uploadToCloudinary} = require("../middleware/cloudinaryUpload");
const router = require('express').Router();

router.get('/courses/published/:id',  courseController.getPublishedSingleCourse);
router.get('/courses/published',  courseController.getAllPublishedCourse);

router.get('/courses/:id', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.course.can_view_course),  courseController.getSingleCourse);
router.post('/courses',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.course.can_create_course),
    upload.single('thumbnail'), uploadToCloudinary,
    courseController.createCourse
);
router.patch('/courses/:courseId',
    upload.single("thumbnail"),
    uploadToCloudinary,
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.course.can_edit_course),
    courseController.updateCourse);
router.get('/courses',  authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.course.can_view_course),  courseController.getAllCourse)

module.exports = router;