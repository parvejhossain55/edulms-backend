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
router.post("/teacher/agree", upload.none(), teacherController.agreeTeacher);
module.exports = router;
