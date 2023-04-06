const {Schema, model} = require('mongoose');
const {ObjectId} = Schema.Types;

const courseModuleSchema = new Schema({
    courseId: {
        type: ObjectId,
        ref: 'Course',
        required: [true, 'course required']
    },
    assignmentId: {
      type: ObjectId,
      ref: 'Assignment'
    },
    quizId: {
      type: ObjectId,
      ref: 'Quiz'
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'module name required']
    },
    moduleNo: {
        type: Number,
        required: [true, 'module number required']
    }
}, {versionKey: false, timestamps: true});

const CourseModule = model('CourseModule', courseModuleSchema);

module.exports = CourseModule;