const authMiddleware = require("../middleware/authMiddleware");
const router = require('express').Router();
const {permissions} = require("../dbSeed/projectPermissions");
const teacherApplyController = require("../controllers/teacherApplyController");


router.post("/teachersapply", teacherApplyController.applyTeacher);

router.get("/teachersapply/:pageNo/:perPage/:keyword",
    authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.teacher.can_view_teacher),
    teacherApplyController.getAllAppliedTeachers);
router.patch("/teachersapply/:teacherId",

    authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.teacher.can_edit_teacher),
    teacherApplyController.applyTeacherStatusUpdate);










module.exports = router;