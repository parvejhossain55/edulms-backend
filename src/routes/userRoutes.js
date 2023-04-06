const express = require('express');
const router = express.Router();
const permissions = require('../helpers/permissions');

const userController = require('../controllers/userController');
const authMiddleware = require("../middleware/authMiddleware");
const manageUserController = require("../controllers/userManage/userManageController");

router.patch('/', authMiddleware.authVerifyMiddleware, userController.patchUser);
router.get('/', authMiddleware.authVerifyMiddleware, userController.getUserProfile);
router.post('/', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.user.can_create_user), manageUserController.createUser);


module.exports = router;