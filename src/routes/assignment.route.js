const authMiddleware = require("../middleware/authMiddleware");
const router = require('express').Router();
const {permissions} = require("../dbSeed/projectPermissions");
const {assignmentUpload, uploadToCloudinary} = require("../middleware/cloudinaryUpload");
const assignmentController = require('../controllers/assignment/assignment.controller');

router.put('/assignments/submit',
    authMiddleware.authVerifyMiddleware,
    assignmentUpload.single("file"),
    uploadToCloudinary,
    assignmentController.assignmentSubmit
);
router.post('/assignments',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.assignment.can_create_assignment),
    assignmentUpload.single("file"),
    uploadToCloudinary,
    assignmentController.postAssignment
    );
router.patch('/assignments/:id',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.assignment.can_edit_assignment),
    assignmentUpload.single("file"),
    uploadToCloudinary,
    assignmentController.patchAssignment
    );


router.get('/assignments/:id',
    authMiddleware.authVerifyMiddleware,
    assignmentController.getSingleAssignment
)
router.get('/assignments/submitted/:courseId/:moduleId/:pageNo/:perPage/:keyword',
    authMiddleware.authVerifyMiddleware,
    assignmentController.getSubmitted
)
router.get('/assignments',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.assignment.can_view_assignment),
    assignmentController.getAllAssignment
)






module.exports = router;