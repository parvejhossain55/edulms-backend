const AssignmentModel = require('../../models/Assignment');
const CourseModel = require('../../models/Course');
const error = require("../../helpers/error");
const checkAssociateService = require("../common/checkAssociateService");
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;

const createAssignmentService = async (
    {assignmentName, assignmentDescription, courseId, courseModuleId, filename, teacherId}
)=>{

    const isAssignment = await AssignmentModel.findOne({courseId: new objectId(courseId), courseModuleId: new objectId(courseModuleId), teacherId: teacherId});
    if (isAssignment){
       throw error("assignment already exit in this course module", 400)
    }

    const isCourse = await checkAssociateService({teacherId: new objectId(teacherId), _id: new objectId(courseId)}, CourseModel);
    if (!isCourse){
        throw error("course not found. please create a course first", 400)
    }

    const assignment = new AssignmentModel({
        assignmentName,
        assignmentDescription,
        courseId,
        courseModuleId,
        file: filename,
        teacherId
    });

    return assignment.save()
}

const getAllAssignmentService = ()=>{
    return AssignmentModel.aggregate([
        {$match: {}},
        {$lookup: {from: 'courses', localField: 'courseId', foreignField: '_id', as: 'course'}},
        {$lookup: {from: 'coursemodules', localField: 'courseModuleId', foreignField: '_id', as: 'courseModule'}},
        {$project: {
                assignmentName:1,
                assignmentDescription:1,
                status:1,
                createdAt: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }

                },
                updatedAt: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$updatedAt"
                    }
                },
                courseName: {$first: '$course.name'},
                courseModule: {$first: '$courseModule.title'},
            }}
    ])
}


module.exports = {
    createAssignmentService,
    getAllAssignmentService
}