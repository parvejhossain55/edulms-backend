const Role = require("../models/Role");
const error = require("../helpers/error");
const PermissionModel = require("../models/Permission");
const UserModel = require("../models/User");
const checkAssociateService = require('./common/checkAssociateService');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const roleFindByProperty = (key, value)=>{
    if (key === '_id'){
        return Role.findById(value);
    }
    return Role.findOne({[key]: value});
}

const getRoleService = (query = {})=>{
    return Role.aggregate([
        {$match: query}
    ])
}
const getRolesPaginationService = ({page, perPage, keyword})=>{
    const skipRow = (page - 1) * perPage;
    if (keyword  !== '0'){
        return Role.aggregate([
            {$match: {name: {$regex: keyword, $options: 'xi'}}},
            {$facet: {
                    total:[{$count: "count"}],
                    rows: [
                        {$project: {totalPermission: {$size: '$permissions'}, name: 1}},
                        {$skip: skipRow},
                        {$limit: perPage}
                    ]
                }},
        ])
    }else {
        return Role.aggregate([
            {$match: {}},
            {$facet: {
                    total:[{$count: "count"}],
                    rows: [
                        {$project: {totalPermission: {$size: '$permissions'}, name: 1}},
                        {$skip: skipRow},
                        {$limit: perPage}
                    ]
                }},

        ])
    }

}
const createNewRoleService = async ({roleName}, options = null)=>{
    const role = new Role({name: roleName});
    return await role.save(options);
}

const deleteRoleService = async (id)=>{
    const role = await Role.findById(id);
    if (!role)throw error("role not found", 404);
    const isAssociate = await checkAssociateService({roleId: new ObjectId(id)}, UserModel);
    if (isAssociate) throw error("can't delete role. Associate with user", 400);
    return Role.deleteOne({_id: id});

}
const assignPermissionsService = async ({permissions, roleId})=>{

    const role = await Role.findById(roleId);
    if (!role)throw error('Role not found', 400);

    return Role.findByIdAndUpdate(roleId, {permissions},{new: true});


}
const getAllPermissionsService = ()=>{
    return PermissionModel.find({});
}
const getPermissionsByRoleService = (roleId)=>{
    return Role.aggregate([
        {$match: {_id: new ObjectId(roleId)}},
        {$lookup: {from: 'permissions', localField: 'permissions', foreignField: '_id', as: 'permissions'}}
    ]);
}

module.exports = {
    getRoleService,
    assignPermissionsService,
    createNewRoleService,
    roleFindByProperty,
    deleteRoleService,
    getAllPermissionsService,
    getPermissionsByRoleService,
    getRolesPaginationService
}