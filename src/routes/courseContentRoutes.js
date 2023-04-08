const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const courseContentController = require('../controllers/course/courseContentController');
const permissions = require('../helpers/permissions');

router.get('/contents', (req, res)=>{
    res.send('course contents')
})
router.post('/contents',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.courseContent.can_create_content),
    courseContentController.createContent
)

module.exports = router;
