const router = require("express").Router();
const teacherController = require("../controllers/teacherController");
const {
  upload,
  uploadToCloudinary,
} = require("../middleware/cloudinaryUpload");
const authMiddleware = require("../middleware/authMiddleware");
const {permissions} = require("../dbSeed/projectPermissions");

router.post("/teachers",
    authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.teacher.can_create_teacher),
    upload.single("picture"), uploadToCloudinary, teacherController.createTeacher);
// router.get("/teachersall/:pageNo/:perPage/:keyword", teacherController.getAllTeachers);
// router.get("/teachers/:pageNo/:perPage/:keyword",
//     authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.teacher.can_view_teacher),
//     teacherController.getAllTeachers);
router.get("/teachers/:teacherId", teacherController.getTeacherById);
router.get("/teachers/:pageNo/:perPage/:keyword", teacherController.getAllTeachers);

router.get("/teachers",
    authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.teacher.can_view_teacher),
    teacherController.teacherDropDown);

router.post("/teacher/agree", upload.none(), teacherController.agreeTeacher);
module.exports = router;
