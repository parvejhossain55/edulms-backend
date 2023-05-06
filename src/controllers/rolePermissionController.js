const rolePermissionService = require("../services/rolePermissionService");
const FormHelper = require('../helpers/FormHelper');
const dropDownService = require("../services/common/dropDownService");
const RoleModel = require('../models/Role');
const {roleFindByProperty} = require("../services/rolePermissionService");
const checkAssociateService = require("../services/common/checkAssociateService");
const UserModel = require('../models/User');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
const getRoles = async (req, res, next) => {
    try {
        const {page, perPage, keyword} = req.params;
        const roles = await rolePermissionService.getRolesPaginationService({page: Number(page), perPage: Number(perPage), keyword});
        console.log(roles);
        res.status(201).json({
            roles: roles[0]?.rows,
            total: roles[0]?.total[0]?.count
        })
    } catch (e) {
        next(e)
    }
}
const createRole = async (req, res, next) => {
    try {
        const { name } = req.body;
        const isFind = await roleFindByProperty('name', name);
        if (isFind){
            return res.status(400).json({
                'error': "Role already created"
            })
        }
        await rolePermissionService.createNewRoleService({ roleName: name });
        res.status(201).json({
            success: true
        })
    } catch (e) {
        next(e)
    }
}

const deleteRole = async (req, res, next) => {
    try {
        const id = req.params.id;
        await rolePermissionService.deleteRoleService(id);

        res.status(200).json({
            message: 'Role Delete successfully'
        })

    } catch (e) {
        next(e)
    }
}

const assignPermissions = async (req, res, next) => {
    try {
        const { permissions } = req.body;
        const roleId = req.params.roleId;
        if (!FormHelper.isIdValid(roleId)) {
            return res.status(400).json({
                error: 'provide a valid role ID'
            })
        }
        const result = await rolePermissionService.assignPermissionsService({ permissions, roleId });

        res.status(200).json(result);
    } catch (e) {
        next(e)
    }
}

const getAllPermissions = async (req, res, next) => {
    try {
        const permissions = await rolePermissionService.getAllPermissionsService();
        res.status(200).json(permissions);
    } catch (e) {
        next(e)
    }
}
const getPermissionsByRole = async (req, res, next) => {
    try {
        const roleId = req.params.roleId;

        const role = await rolePermissionService.getPermissionsByRoleService(roleId);
        res.status(200).json(role);
    } catch (e) {
        next(e)
    }
}

const roleDropDown = async (req, res, next)=>{
    try {
        const roles = await dropDownService(RoleModel, {_id: 1, name: 1});
        res.status(200).json({roles});
    }catch (e) {
        next(e);
    }
}

module.exports = {
    getRoles,
    createRole,
    assignPermissions,
    deleteRole,
    getAllPermissions,
    getPermissionsByRole,
    roleDropDown
}