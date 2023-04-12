const mongoose = require("mongoose");
const rolePermissionService = require("../../services/userManage/rolePermissionService");
const FormHelper = require('../../helpers/FormHelper');
const getRoles = async (req, res, next) => {
    try {
        const roles = await rolePermissionService.getRoleService();
        res.status(201).json({
            roles
        })
    } catch (e) {
        next(e)
    }
}
const createRole = async (req, res, next) => {
    try {
        const {name} = req.body;
        const role = await rolePermissionService.createNewRoleService({roleName: name});
        res.status(201).json({
            role
        })
    } catch (e) {
        next(e)
    }
}

const deleteRole = async (req, res, next) => {
    try {
        const id = req.params.id;
        const role = await rolePermissionService.deleteRoleService(id);

       if (role.deletedCount === 0){
           return res.status(200).json({
               error: 'Role not delete'
           })
       }
        res.status(200).json({
            message: 'Role Delete successfully'
        })

    } catch (e) {
        next(e)
    }
}

const assignPermissions = async (req, res, next) => {
    try {
        const {permissions} = req.body;
        const roleId = req.params.roleId;
        if (!FormHelper.isIdValid(roleId)){
           return res.status(400).json({
               error: 'provide a valid role ID'
           })
        }
        const result = await rolePermissionService.assignPermissionsService({permissions, roleId});

        res.status(200).json(result);
    } catch (e) {
        next(e)
    }
}

const getAllPermissions = async (req, res,next)=>{
    try {
        const permissions = await rolePermissionService.getAllPermissionsService();
        res.status(200).json(permissions);
    }catch (e) {
        next(e)
    }
}
const getPermissionsByRole = async (req, res,next)=>{
    try {
        const roleId = req.params.roleId;

        const role = await rolePermissionService.getPermissionsByRoleService(roleId);
        res.status(200).json(role);
    }catch (e) {
        next(e)
    }
}

module.exports = {
    getRoles,
    createRole,
    assignPermissions,
    deleteRole,
    getAllPermissions,
    getPermissionsByRole
}