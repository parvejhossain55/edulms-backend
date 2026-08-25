const permissions = {
    user: {
        can_create_user: 'can_create_user',
        can_edit_user: 'can_edit_user',
        can_view_user: 'can_view_user',
        can_delete_user: 'can_delete_user',
    },
    teacher: {
        can_create_teacher: 'can_create_teacher',
        can_edit_teacher: 'can_edit_teacher',
        can_view_teacher: 'can_view_teacher',
        can_delete_teacher: 'can_delete_teacher',
        can_view_applied_teacher: 'can_view_applied_teacher',
    },
    courseCategory: {
        can_create_course_category: 'can_create_course_category',
        can_edit_course_category: 'can_edit_course_category',
        can_delete_course_category: 'can_delete_course_category',
    },
    course: {
        can_create_course: 'can_create_course',
        can_edit_course: 'can_edit_course',
        can_view_course: 'can_view_course',
        can_delete_course: 'can_delete_course',
    },
    courseContent: {
        can_create_content: 'can_create_content',
        can_edit_content: 'can_edit_content',
        can_view_content: 'can_view_content',
        can_delete_content: 'can_delete_content',
    },
    roles: {
        can_create_role: 'can_create_role',
        can_edit_role: 'can_edit_role',
        can_view_role: 'can_view_role',
        can_delete_role: 'can_delete_role',
    },
    assignment: {
        can_create_assignment: 'can_create_assignment',
        can_edit_assignment: 'can_edit_assignment',
        can_view_assignment: 'can_view_assignment',
        can_delete_assignment: 'can_delete_assignment',
    },
}

const permissionsDocuments = Object.keys(permissions).reduce((acc, category) => {
    const categoryPermissions = permissions[category];
    return acc.concat(
        Object.keys(categoryPermissions).map(permission => ({
            name: categoryPermissions[permission]
        }))
    );
}, []);

module.exports = {permissions, permissionsDocuments};



