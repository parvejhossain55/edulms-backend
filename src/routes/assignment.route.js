const authMiddleware = require("../middleware/authMiddleware");
const router = require('express').Router();
const {permissions} = require("../dbSeed/projectPermissions");
const {assignmentUpload, uploadAssignmentToCloudinary, } = require("../middleware/cloudinaryUpload");
const assignmentController = require('../controllers/assignment/assignment.controller');

router.put('/assignments/submit',
    authMiddleware.authVerifyMiddleware,
    assignmentUpload.single("file"),
    uploadAssignmentToCloudinary,
    assignmentController.assignmentSubmit
);
router.post('/assignments',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.assignment.can_create_assignment),
    assignmentUpload.single("file"),
    uploadAssignmentToCloudinary,
    assignmentController.postAssignment
    );
router.patch('/assignments/:id',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.assignment.can_edit_assignment),
    assignmentUpload.single("file"),
    uploadAssignmentToCloudinary,
    assignmentController.patchAssignment
    );
router.patch('/assignments/review/:studentId/:assignmentId/:submittedId',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.assignment.can_edit_assignment),
    assignmentController.teacherReview
    );


router.get('/assignments/:id',
    authMiddleware.authVerifyMiddleware,
    assignmentController.getSingleAssignment
)
router.get('/assignments/submitted/:courseId/:moduleId/:pageNo/:perPage/:keyword',
    authMiddleware.authVerifyMiddleware,
    assignmentController.getSubmitted
)
router.get('/submitted/:assignmentId',
    authMiddleware.authVerifyMiddleware,
    assignmentController.getSubmittedAssignmentByAssignmentID
)
router.get('/student/submitted/:courseId/:pageNo/:perPage/:keyword',
    authMiddleware.authVerifyMiddleware,
    assignmentController.getStudentSubmittedAssignment
)
router.get('/assignments',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.assignment.can_view_assignment),
    assignmentController.getAllAssignment
)







module.exports = router;