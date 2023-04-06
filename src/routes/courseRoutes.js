const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const courseController = require('../controllers/course/courseController');
const upload = require('../helpers/fileUpload');
const permissions = require('../helpers/permissions');

router.get('/', (req, res)=>{
    res.send('course')
})
router.post('/',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.course.can_create_course),
    upload.single('thumbnail'),
    courseController.createCourse
    )

module.exports = router;
