const {Schema, model} = require('mongoose');

const courseContentSchema = new Schema({
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: 'CourseModule'
    },
    videoTitle: {
        type: String,
        trim: true,
        unique: true,
    },
    videoUrl: {
        type: String,
        trim: true,
        unique: true
    },
    serialNo: {
        type: Number,
        unique: true
    }
}, {versionKey: false, timestamps: true});

const CourseContent = model('CourseContent', courseContentSchema);

module.exports = CourseContent;