const FormHelper = require('../../helpers/FormHelper');
const assignmentServices = require('../../services/assignment/assignment.services');
const AssignmentModel = require('../../models/Assignment');
const AssignmentSubmitModel = require('../../models/AssignmentSubmit');
const findOneByQuery = require("../../services/common/findOneByQuery");
const {ObjectId} = require("mongoose").Types;

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
        const teacherId = new ObjectId(req.auth?._id);
        const assignments = await assignmentServices.getAllAssignmentService({teacherId});
        res.status(200).json(assignments)
    }catch (e) {
        next(e)
    }
}

const getSingleAssignment = async (req, res, next)=>{
    try {
        const assignmentId = req.params.id;
        const assignment = await assignmentServices.getSingleAssignmentService({assignmentId});
        res.status(200).json(assignment);
    }catch (e) {
        next(e)
    }
}

const patchAssignment = async (req, res, next)=>{
    try {
        const assignmentId = req.params.id;
        const teacherId = req.auth?._id;
        const {
            assignmentName,
            assignmentDescription,
            courseId,
            courseModuleId
        } = req.body;

        const filename = {
            public_id: req?.file?.cloudinaryId,
            secure_url: req?.file?.cloudinaryUrl,
        };

        const query = {_id: new ObjectId(assignmentId), teacherId: new ObjectId(teacherId)};
        const assignment = await findOneByQuery(query, AssignmentModel);

        if (!assignment){
            return res.status(400).json({
                error: 'assignment not found'
            })
        }

        const name = !assignmentName ? assignment?.assignmentName : assignmentName;
        const description = !assignmentDescription ? assignment?.assignmentDescription : assignmentDescription;
        const course = !courseId ? assignment?.courseId : courseId;
        const moduleId = !courseModuleId ? assignment?.courseModuleId : courseModuleId;
        const file = !req?.file?.cloudinaryUrl ? assignment?.file : filename

        const updateResult = await assignmentServices.updateAssignmentService(
            {
                assignmentId,
                assignmentName: name,
                assignmentDescription: description,
                courseId: course,
                courseModuleId: moduleId,
                filename: file,
                teacherId,
            }
        )

        res.status(200).json(updateResult)

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

const getSubmitted = async (req, res, next)=>{
    try {
        const {courseId, moduleId} = req.params;
        const teacherId = req.auth?._id;

        const pageNo = req.params?.pageNo === ":pageNo" ? 1 : Number(req.params?.pageNo);
        const perPage = req.params?.perPage === ":perPage" ? 10 : Number(req.params?.perPage);
        const searchKeyword = req.params?.keyword === ':keyword' ? '0' : req.params?.keyword;

        if (!FormHelper.isIdValid(courseId)){
            return res.status(400).json({
                error: 'please provide a valid course'
            })
        }
        if (!FormHelper.isIdValid(moduleId)){
            return res.status(400).json({
                error: 'please provide a valid module'
            })
        }

        const submittedAssignment = await assignmentServices.getSubmittedService({courseId, moduleId, teacherId, pageNo, perPage, keyword: searchKeyword})

        res.status(200).json(submittedAssignment)

    }catch (e) {
        next(e)
    }
}
const getStudentSubmittedAssignment = async (req, res, next)=>{
    try {
        const {courseId} = req.params;
        const studentId = req.auth?._id;

        const pageNo = req.params?.pageNo === ":pageNo" ? 1 : Number(req.params?.pageNo);
        const perPage = req.params?.perPage === ":perPage" ? 10 : Number(req.params?.perPage);
        const searchKeyword = req.params?.keyword === ':keyword' ? '0' : req.params?.keyword;

        if (!FormHelper.isIdValid(courseId)){
            return res.status(400).json({
                error: 'please provide a valid course'
            })
        }

        const submittedAssignment = await assignmentServices.getStudentSubmittedAssignmentService({courseId, studentId, pageNo, perPage, keyword: searchKeyword})

        res.status(200).json(submittedAssignment)

    }catch (e) {
        next(e)
    }
}

const teacherReview = async (req, res, next)=>{
    try {
        const {studentId, assignmentId, submittedId} = req.params;
        const teacherId = req.auth?._id;

        const submitted = AssignmentSubmitModel.findById(submittedId);

        const teacherReview = !req.body?.teacherReview ? submitted?.teacherReview : req.body?.teacherReview;
        const status = !req.body?.status ? submitted?.status : req.body?.status;
        const mark = !req.body?.mark ? submitted?.mark : req.body?.mark;


        const updateResult = await assignmentServices.teacherReviewService({
            studentId, assignmentId, submittedId, teacherReview, status: status?.toUpperCase(), mark, teacherId,
        });
        res.status(200).json(updateResult)
    }catch (e) {
        next(e)
    }
}

// student assignment
const assignmentSubmit = async (req, res, next)=>{
    try {
        const {
            assignmentId,
            studentComment,
            assignmentUrl,
        } = req.body;

        const file = {
            public_id: req?.file?.cloudinaryId,
            secure_url: req?.file?.cloudinaryUrl,
        };

        const studentId = req.auth?._id;

        if (!FormHelper.isIdValid(assignmentId)){
            return res.status(400).json({
                error: 'please provide a valid assignment id'
            })
        }
        if (assignmentUrl && !FormHelper.isUrl(assignmentUrl)){
            return res.status(400).json({
                error: 'please provide a valid url'
            })
        }
        if (FormHelper.isEmpty(assignmentUrl) && FormHelper.isEmpty(file?.secure_url)){
            return res.status(400).json({
                error: 'please submit assignment file or url'
            })
        }

        const assignment = await assignmentServices.assignmentSubmitService( {
            assignmentId, studentId, studentComment, assignmentUrl, file
        })

        res.status(201).json({assignment})
    }catch (e) {
        next(e)
    }
}


const getSubmittedAssignmentByAssignmentID = async (req, res, next)=>{
    try {
        const assignmentId = req.params.assignmentId;

        const submittedAssignment = await findOneByQuery({assignmentId}, AssignmentSubmitModel);
        res.status(200).json(submittedAssignment)

    }catch (e) {
        next(e)
    }
}





module.exports = {
    postAssignment,
    getAllAssignment,
    getSingleAssignment,
    patchAssignment,
    deleteAssignment,
    assignmentSubmit,
    getSubmitted,
    teacherReview,
    getSubmittedAssignmentByAssignmentID,
    getStudentSubmittedAssignment
}