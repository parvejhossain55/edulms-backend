const {Schema, model} = require('mongoose');
const validator = require("validator");
const {ObjectId} = Schema.Types;

const assignmentSubmitSchema = new Schema({
    assignmentId: {
        type: ObjectId,
        ref: 'Assignment',
        required: true
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

const AssignmentSubmit = model('AssignmentSubmit', assignmentSubmitSchema);

module.exports = AssignmentSubmit;