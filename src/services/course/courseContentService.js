const CourseContent = require('../../models/CourseContent');
const createService = (contents)=>{
        return CourseContent.insertMany(contents);
}

module.exports = {createService}