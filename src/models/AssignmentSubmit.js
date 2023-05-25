const {Schema, model} = require('mongoose');
const validator = require("validator");
const {ObjectId} = Schema.Types;

const assignmentSubmitSchema = new Schema({
    assignmentId: {
        type: ObjectId,
        ref: 'Assignment',
        required: true
    },
    studentId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    studentComment: {
        type: String,
        maxLength: [5000, "Comment is too large"],
    },
    assignmentUrl: {
        type: String,
        maxLength: [2000, "url is too large"],
    },
    limit: {
        type: Number,
        default: 3
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
        type: Number,
        default: 0
    },
    file: {
        public_id: {type: String},
        secure_url: {type: String},
    },

}, {versionKey: false, timestamps: true});

const AssignmentSubmit = model('AssignmentSubmit', assignmentSubmitSchema);

module.exports = AssignmentSubmit;