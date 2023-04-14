const router = require("express").Router();
const teacherController = require("../controllers/teacherController");
const {
  upload,
  uploadToCloudinary,
} = require("../middleware/cloudinaryUpload");

router.post("/", upload, uploadToCloudinary, teacherController.applyTeacher);
router.post("/agree-teacher", upload,teacherController.agreeTeacher);

module.exports = router;
