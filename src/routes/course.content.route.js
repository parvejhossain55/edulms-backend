const authMiddleware = require("../middleware/authMiddleware");
const {permissions} = require("../dbSeed/projectPermissions");
const courseContentController = require("../controllers/course/courseContentController");
const router = require('express').Router();
router.get('/courses/contents', (req, res)=>{
    res.send('course contents')
})
router.post('/courses/contents',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.courseContent.can_create_content),
    courseContentController.createContent
);

module.exports = router;