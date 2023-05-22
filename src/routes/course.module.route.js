const authMiddleware = require("../middleware/authMiddleware");
const {permissions} = require("../dbSeed/projectPermissions");
const courseModuleController = require("../controllers/course/courseModuleController");
const router = require('express').Router();

router.get('/courses/modules/:pageNo/:perPage/:searchKeyword', courseModuleController.getModules);
router.get('/courses/modules/:courseId', courseModuleController.getModulesbyID);
router.get('/courses/modulesdropdown/:courseId', courseModuleController.dropDownModules);
router.post('/courses/modules',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.course.can_create_course),
    courseModuleController.createModule
);
router.patch('/courses/modules/:id',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.course.can_edit_course),
    courseModuleController.updateModule
);

router.get('/dropdown-modules/teacher/:courseId',
    authMiddleware.authVerifyMiddleware,
    courseModuleController.dropDownModuleByCourseAndTeacher
    )

module.exports = router;