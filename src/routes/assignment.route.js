const authMiddleware = require("../middleware/authMiddleware");
const router = require('express').Router();
const {permissions} = require("../dbSeed/projectPermissions");
const {assignmentUpload, uploadToCloudinary} = require("../middleware/cloudinaryUpload");
const assignmentController = require('../controllers/assignment/assignment.controller');

router.post('/assignments',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.assignment.can_create_assignment),
    assignmentUpload.single("file"),
    uploadToCloudinary,
    assignmentController.postAssignment
    );

router.get('/assignments',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.assignment.can_view_assignment),
    assignmentController.getAllAssignment
)



module.exports = router;