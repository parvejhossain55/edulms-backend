const authMiddleware = require("../middleware/authMiddleware");
const {permissions} = require("../dbSeed/projectPermissions");
const courseModuleController = require("../controllers/course/courseModuleController");
const router = require('express').Router();
router.get('/courses/modules', (req, res)=>{
    res.send('course modules')
})
router.post('/courses/modules',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.course.can_create_course),
    courseModuleController.createModule
);

module.exports = router;