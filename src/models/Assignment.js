const {Schema, model} = require('mongoose');
const validator = require("validator");
const {ObjectId} = Schema.Types;

const assignmentSchema = new Schema({
    assignmentName: {
        type: String,
        trim: true,
        required: [true, 'assignment name is required'],
        minLength: 3,
        maxLength: 1000,
    },
    assignmentDescription: {
        type: String
    },
    status: {
      type: String,
      enum: ['PENDING', 'REJECT', 'APPROVED', 'ACTIVE'],
        default: 'ACTIVE'
    },
    teacherReview: {
      type: String
    },
    mark: {
      type: Number
    },
    courseId: {
        type: ObjectId,
        ref: 'Course'
    },
    teacherId: {
        type: ObjectId,
        ref: 'Teacher'
    },
    courseModuleId: {
        type: ObjectId,
        ref: 'CourseModule'
    },

    studentComment: {
        type: String
    },
    assignmentUrl: {
        type: String,
        validate: [validator.isURL, "Provide a valid URL"],
    },
    limit: {
        type: Number,
        default: 3
    },
    file: {
        public_id: {type: String},
        secure_url: {type: String},
    },

}, {versionKey: false, timestamps: true});

const Assignment = model('Assignment', assignmentSchema);

module.exports = Assignment;