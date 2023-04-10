const router = require("express").Router();
const teacherController = require("../controllers/teacherController");
const upload = require("../helpers/fileUpload");

router.post("/teacher", upload.single("picture"), teacherController.applyTeacher);

module.exports = router
