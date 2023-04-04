const CourseModel = require('../../models/Course');
const error = require("../../helpers/error");

const createCourse = async (
    {name, description, regularPrice, sellPrice, teacherId, categoryId, benefit, thumbnail}
)=>{
    const isMatch = await CourseModel.findOne({name});

    if (isMatch) throw error('Course name already exits', 400);

    const course = new CourseModel({name, description, regularPrice, sellPrice, teacherId, categoryId, benefit, thumbnail});
    return await course.save();
}
const getAllCourse = async ()=>{

}
const getSingleCourse = async (key, value)=>{

}
const updateCourse = async ()=>{

}
const deleteCourse = async ()=>{

}

module.exports = {createCourse, getAllCourse, getSingleCourse, updateCourse, deleteCourse}