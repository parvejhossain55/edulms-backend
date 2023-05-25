const AssignmentModel = require('../../models/Assignment');
const AssignmentSubmitModel = require('../../models/AssignmentSubmit');
const PurchaseModel = require('../../models/Purchase');
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

const getAllAssignmentService = (
    {teacherId}
)=>{
    return AssignmentModel.aggregate([
        {$match: {teacherId}},
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


const assignmentSubmitService = async (
    {assignmentId, studentId, studentComment, assignmentUrl, file}
)=>{
    const getAssignment = await AssignmentModel.findById(assignmentId);

    const associateQuery = {studentId: new objectId(studentId), courseId: new objectId(getAssignment?.courseId) }
    const isCourse = await checkAssociateService(associateQuery, PurchaseModel);
    if (!isCourse){
        throw error('you have no purchase this course!', 400)
    }

    const getSubmittedAssignment = await AssignmentSubmitModel.findOne({studentId: new objectId(studentId), assignmentId: new objectId(assignmentId)});
    if (getSubmittedAssignment?.limit === 0){
        throw error('you reached submitted limit', 400)
    }
    if (getSubmittedAssignment?.mark > 0){
        throw error("teacher review your assignment. you don't submit", 400)
    }

    return AssignmentSubmitModel.updateOne(
        {studentId: new objectId(studentId), assignmentId: new objectId(assignmentId)},
        {assignmentId, studentId, status: 'PENDING', studentComment, assignmentUrl, limit: getSubmittedAssignment?.limit <= 2 ? getSubmittedAssignment?.limit - 1 : 2, file},
        {upsert: true, runValidators: true}
    );

}


const getSingleAssignmentService = (
    {assignmentId}
)=>{
    return AssignmentModel.findById(assignmentId);
}

const updateAssignmentService = async (
    {assignmentId, assignmentName, assignmentDescription, courseId, courseModuleId, filename, teacherId}
)=>{
    const isAssignment = await AssignmentModel.findOne({_id: {$ne: new objectId(assignmentId)} ,courseId: new objectId(courseId), courseModuleId: new objectId(courseModuleId), teacherId: teacherId});
    if (isAssignment){
        throw error("assignment already exit in this course module", 400)
    }

    const isCourse = await checkAssociateService({teacherId: new objectId(teacherId), _id: new objectId(courseId)}, CourseModel);
    if (!isCourse){
        throw error("course not found. please create a course first", 400)
    }

    return AssignmentModel.updateOne({_id: new objectId(assignmentId)},{
        assignmentName,
        assignmentDescription,
        courseId,
        courseModuleId,
        file: filename,
        teacherId,
    });


}

const teacherReviewService = async (
    {studentId, assignmentId, submittedId, teacherReview, status, mark, teacherId}
)=>{
    const isAssignment = await AssignmentModel.findOne({_id: new objectId(assignmentId), teacherId: new objectId(teacherId)});
    if (!isAssignment) throw error('assignment not found', 400);

    return AssignmentSubmitModel.updateOne({_id: new objectId(submittedId), studentId: new objectId(studentId)}, {
         teacherReview, status, mark
    })
}

const getSubmittedService = async (
    {courseId, moduleId, teacherId, pageNo, perPage, keyword}
)=>{



    const isCourse = await checkAssociateService({teacherId: new objectId(teacherId), _id: new objectId(courseId)}, CourseModel);
    if (!isCourse){
        throw error("course not found. please create a course first", 400)
    }
    const skipPage = (pageNo - 1) * perPage;
    const searchRegex = {$regex: keyword, $options: 'i'};
    /*const commonQuery = {teacherId, courseId: new objectId(courseId), courseModuleId: new objectId(moduleId)}*/
    const commonQuery = {
        'assignment.teacherId': teacherId,
        'assignment.courseId': new objectId(courseId),
        'assignment.courseModuleId': new objectId(moduleId)
    }

    const query = keyword === '0' ? commonQuery : {$or: [
            {'student.firstName': searchRegex},
            {'student.lastName': searchRegex},
            {'student.fullName': searchRegex},
            {'student.email': searchRegex},
            {'student.mobile': searchRegex},
            {'assignment.assignmentName': searchRegex},
        ],
        'assignment.teacherId': teacherId,
        'assignment.courseId': new objectId(courseId),
        'assignment.courseModuleId': new objectId(moduleId)
    };

    return AssignmentSubmitModel.aggregate([
        {$facet: {
                total:[
                    {
                        $lookup: {
                            from: 'assignments',
                            localField: 'assignmentId',
                            foreignField: '_id',
                            as: 'assignment'
                        }
                    },
                    {
                        $unwind: '$assignment'
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'studentId',
                            foreignField: '_id',
                            as: 'student'
                        }
                    },
                    {
                        $unwind: '$student'
                    },
                    {$match: query},
                    {$count: "count"}
                ],
                rows:[
                    {
                        $lookup: {
                            from: 'assignments',
                            localField: 'assignmentId',
                            foreignField: '_id',
                            as: 'assignment'
                        }
                    },
                    {
                        $unwind: '$assignment'
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'studentId',
                            foreignField: '_id',
                            as: 'student'
                        }
                    },
                    {
                        $unwind: '$student'
                    },
                    {
                        $project: {
                            assignmentId: 1,
                            studentId: 1,
                            studentComment: 1,
                            assignmentUrl: 1,
                            limit: 1,
                            file: 1,
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
                            teacherReview: 1,
                            status: 1,
                            mark: 1,
                            assignment: {
                                assignmentName: '$assignment.assignmentName',
                                assignmentDescription: '$assignment.assignmentDescription',
                                courseId: '$assignment.courseId',
                                teacherId: '$assignment.teacherId',
                                courseModuleId: '$assignment.courseModuleId',
                                file: '$assignment.file',
                                _id: '$assignment._id'
                            },
                            student: {
                                firstName: '$student.firstName',
                                lastName: '$student.lastName',
                                fullName: { $concat: ['$student.firstName', ' ', '$student.lastName'] },
                                email: '$student.email',
                                mobile: '$student.mobile',
                            },
                        }
                    },
                    {$match: query},
                    {$skip: skipPage},
                    {$limit: perPage},
                    {$sort: {createdAt: -1}}
                ],

            }},

    ])



}

module.exports = {
    createAssignmentService,
    getAllAssignmentService,
    assignmentSubmitService,
    getSingleAssignmentService,
    updateAssignmentService,
    getSubmittedService,
    teacherReviewService
}