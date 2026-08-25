const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const {permissions} = require('../dbSeed/projectPermissions');
const employeeController = require('../controllers/userManage/userManageController');
const manageUserController = require("../controllers/userManage/userManageController");

router.post('/employees', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.user.can_create_user), manageUserController.createEmployee);

router.get('/employees/:pageNo/:perPage/:keyword',
    authMiddleware.authVerifyMiddleware,
    authMiddleware.checkPermissions(permissions.user.can_view_user), employeeController.getAllEmployees )

module.exports = router;