const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const courseModuleController = require('../controllers/course/courseModuleController');
const permissions = require('../helpers/permissions');

router.get('/modules', (req, res)=>{
    res.send('course modules')
})
router.post('/modules',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.course.can_create_course),
    courseModuleController.createModule
    )

module.exports = router;
