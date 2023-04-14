const courseController = require("../controllers/course/courseController");
const {upload, uploadToCloudinary} = require("../middleware/cloudinaryUpload");
const authMiddleware = require("../middleware/authMiddleware");
const {permissions} = require("../dbSeed/projectPermissions");
const router = require('express').Router();

router.get('/courses/teacher/:id/:teacherId',  courseController.getSingleCourseByTeacher);
router.get('/courses/teacher/:teacherId',  courseController.getAllCourseByTeacher);
router.patch('/courses/teacher/:courseId',
    upload.single("thumbnail"),
    uploadToCloudinary,
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.course.can_edit_course),
    courseController.teacherUpdateCourse);

module.exports = router;