const authMiddleware = require("../middleware/authMiddleware");
const rolePermissionController = require("../controllers/userManage/rolePermissionController");
const router = require('express').Router();
const permissions = require('../helpers/permissions');

router.get('/', authMiddleware.authVerifyMiddleware,  authMiddleware.checkPermissions(permissions.roles.can_view_role), rolePermissionController.getRoles);
router.post('/', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.roles.can_create_role), rolePermissionController.createRole);
router.delete('/:id', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions(permissions.roles.can_delete_role), rolePermissionController.deleteRole);
router.post('/permissions',authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions('can_create_permission'), rolePermissionController.createPermission);

module.exports = router;