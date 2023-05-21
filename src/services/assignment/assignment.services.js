const AssignmentModel = require('../../models/Assignment');
const CourseModel = require('../../models/Course');
const error = require("../../helpers/error");
const checkAssociateService = require("../common/checkAssociateService");
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;

const createAssignmentService = async (
    {assignmentName, assignmentDescription, courseId, courseModuleId, filename, teacherId}
)=>{

    const isAssignment = await AssignmentModel.findOne({courseId: new objectId(courseId), courseModuleId: new objectId(courseModuleId), teacherId: new objectId(teacherId)});
    if (isAssignment){
        error("assignment already exit in this course module", 400)
    }
    console.log(isAssignment)

    const isCourse = await checkAssociateService({teacherId: new objectId(teacherId), _id: new objectId(courseId)}, CourseModel);
    if (!isCourse){
        error("course not found. please create a course first", 400)
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


module.exports = {
    createAssignmentService
}