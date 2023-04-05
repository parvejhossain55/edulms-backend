const authMiddleware = require("../middleware/authMiddleware");
const rolePermissionController = require("../controllers/userManage/rolePermissionController");
const router = require('express').Router();

router.get('/', authMiddleware.authVerifyMiddleware,  authMiddleware.checkPermissions('can_view_roles'), rolePermissionController.getRoles);
router.post('/', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions('can_create_role'), rolePermissionController.createRole);
router.delete('/:id', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions('can_delete_role'), rolePermissionController.deleteRole);
router.post('/permissions',authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions('can_create_permission'), rolePermissionController.createPermission);

module.exports = router;