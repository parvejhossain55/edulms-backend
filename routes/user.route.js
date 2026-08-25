const {upload, uploadToCloudinary} = require("../middleware/cloudinaryUpload");
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const {permissions} = require("../dbSeed/projectPermissions");
const manageUserController = require("../controllers/userManage/userManageController");

const router = require('express').Router();

router.patch('/users', upload.single('picture'), uploadToCloudinary, authMiddleware.authVerifyMiddleware, userController.patchUser);
router.get('/users', authMiddleware.authVerifyMiddleware, userController.getUserProfile);

module.exports = router;
