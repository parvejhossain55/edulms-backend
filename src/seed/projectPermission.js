const permissions = require('../helpers/permissions');

const projectPermission = [
    {
        name: permissions.user.can_create_user
    },
    {
        name: permissions.user.can_edit_user
    },
    {
        name: permissions.user.can_view_user
    },
    {
        name: permissions.user.can_delete_user
    }
];

module.exports = projectPermission;