const authMiddleware = require("../middleware/authMiddleware");
const rolePermissionController = require("../controllers/userManage/rolePermissionController");
const router = require('express').Router();

router.get('/roles/', authMiddleware.authVerifyMiddleware,  authMiddleware.checkPermissions('can_view_roles'), rolePermissionController.getRoles);
router.post('/roles/', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions('can_create_role'), rolePermissionController.createRole);
router.delete('/roles/:id', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions('can_delete_role'), rolePermissionController.deleteRole);
router.post('/roles/permissions',authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions('can_create_permission'), rolePermissionController.createPermission);

module.exports = router;