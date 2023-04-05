const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require("../middleware/authMiddleware");
const manageUserController = require("../controllers/userManage/userManageController");

router.patch('/', authMiddleware.authVerifyMiddleware, userController.patchUser);
router.get('/', authMiddleware.authVerifyMiddleware, userController.getUserProfile);
router.post('/', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions('can_create_users'), manageUserController.createUser);


module.exports = router;