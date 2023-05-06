const authMiddleware = require("../middleware/authMiddleware");
const {permissions} = require("../dbSeed/projectPermissions");
const rolePermissionController = require("../controllers/rolePermissionController");

const router = require('express').Router();

router.get('/roles/permissions/:roleId',authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.roles.can_view_role), rolePermissionController.getPermissionsByRole);
router.get('/roles/dropdown', authMiddleware.authVerifyMiddleware, rolePermissionController.roleDropDown);
router.get('/roles/:keyword/:page/:perPage', authMiddleware.authVerifyMiddleware,  authMiddleware.checkPermissions(permissions.roles.can_view_role), rolePermissionController.getRoles);
router.post('/roles/', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.roles.can_create_role), rolePermissionController.createRole);
router.delete('/roles/:id', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.roles.can_delete_role), rolePermissionController.deleteRole);
router.patch('/roles/permissions/:roleId',authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.roles.can_edit_role), rolePermissionController.assignPermissions);
router.get('/permissions',authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.roles.can_view_role), rolePermissionController.getAllPermissions);

module.exports = router;