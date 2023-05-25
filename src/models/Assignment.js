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
    file: {
        public_id: {type: String},
        secure_url: {type: String},
    },

}, {versionKey: false, timestamps: true});

const Assignment = model('Assignment', assignmentSchema);

module.exports = Assignment;