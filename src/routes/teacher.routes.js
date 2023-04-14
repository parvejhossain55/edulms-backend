const router = require("express").Router();
const teacherController = require("../controllers/teacherController");
const {
  upload,
  uploadToCloudinary,
} = require("../middleware/cloudinaryUpload");

router.post("/teachers", upload.single("picture"), uploadToCloudinary, teacherController.applyTeacher);
router.post("/agree-teacher", upload.single("picture"), teacherController.agreeTeacher);
module.exports = router;
