const router = require("express").Router();
const teacherController = require("../controllers/teacherController");
const {
  upload,
  uploadToCloudinary,
} = require("../middleware/cloudinaryUpload");

router.post("/teachers", upload.single("picture"), uploadToCloudinary, teacherController.applyTeacher);
router.post("/teacher/agree", upload.none(), teacherController.agreeTeacher);
module.exports = router;
