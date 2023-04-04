const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const courseController = require('../controllers/course/courseController');
const upload = require('../helpers/fileUpload');
router.get('/course', (req, res)=>{
    res.send('course')
})
router.post('/course',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions('can_create_course'),
    upload.single('thumbnail'),
    courseController.createCourse
    )

module.exports = router;
