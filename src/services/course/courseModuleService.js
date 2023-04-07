const CourseModule = require('../../models/CourseModule');
const error = require('../../helpers/error');
const mongoose = require('mongoose');
const ObjetId = mongoose.Types.ObjectId;
const createService = async (
    { courseId,  title, moduleNo }
)=>{

    const isModule = await CourseModule.findOne({$or: [{courseId: new ObjetId(courseId), title: title}, {courseId: new ObjetId(courseId), moduleNo}]});
    if (isModule?.title === title) throw error('Module name already exits', 400);
    if (isModule?.moduleNo === moduleNo) throw error('Module Number already exits', 400);

    const courseModule = new CourseModule( { courseId,  title, moduleNo });
    return courseModule.save();
}

module.exports = {createService}