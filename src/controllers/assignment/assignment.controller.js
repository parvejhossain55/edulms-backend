const FormHelper = require('../../helpers/FormHelper');
const assignmentServices = require('../../services/assignment/assignment.services');
const postAssignment = async (req, res, next)=>{
    try {
        const {
            assignmentName,
            assignmentDescription,
            courseId,
            courseModuleId,
        } = req.body;

        const filename = {
            public_id: req?.file?.cloudinaryId,
            secure_url: req?.file?.cloudinaryUrl,
        };

        const teacherId = req.auth?._id;

        if (FormHelper.isEmpty(assignmentName)){
            return res.status(400).json({
                error: 'assignment name is required'
            })
        }
        if (!FormHelper.isIdValid(courseId)){
            return res.status(400).json({
                error: 'please provide a valid course id'
            })
        }
        if (!FormHelper.isIdValid(courseModuleId)){
            return res.status(400).json({
                error: 'please provide a valid course module id'
            })
        }

        const assignment = await assignmentServices.createAssignmentService({
            assignmentName,
            assignmentDescription,
            courseId,
            courseModuleId,
            filename,
            teacherId
        })

        res.status(201).json({assignment})

    }catch (e) {
        next(e)
    }
}

const getAllAssignment = async (req, res, next)=>{
    try {
        const assignments = await assignmentServices.getAllAssignmentService();
        res.status(200).json(assignments)
    }catch (e) {
        next(e)
    }
}

const getSingleAssignment = async (req, res, next)=>{
    try {

    }catch (e) {
        next(e)
    }
}
const patchAssignment = async (req, res, next)=>{
    try {

    }catch (e) {
        next(e)
    }
}
const deleteAssignment = async (req, res, next)=>{
    try {

    }catch (e) {
        next(e)
    }
}

module.exports = {postAssignment, getAllAssignment, getSingleAssignment, patchAssignment, deleteAssignment}