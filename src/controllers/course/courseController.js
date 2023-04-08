const FormHelper = require("../../helpers/FormHelper");
const courseService = require('../../services/course/courseService');
const imageCompress = require("../../helpers/imageCompress");
const createCourse = async (req, res, next)=>{
    try {

            await imageCompress(req.file.filename);
            const {name, description, regularPrice, sellPrice, teacherId, categoryId, benefit, thumbnail} = req.body;

            if (FormHelper.isEmpty(name)) {
                return res.status(400).json({
                    error: "course name is required",
                });
            }
            if (FormHelper.isEmpty(regularPrice)) {
                return res.status(400).json({
                    error: "Regular price is required",
                });
            }
            if (FormHelper.isEmpty(regularPrice)) {
                return res.status(400).json({
                    error: "Regular price is required",
                });
            }

            if (!FormHelper.isIdValid(teacherId)) {
                return res.status(400).json({
                    error: "teacher is required",
                });
            }
            if (!FormHelper.isIdValid(categoryId)) {
                return res.status(400).json({
                    error: "teacher is required",
                });
            }
            if (FormHelper.isEmpty(thumbnail)) {
                return res.status(400).json({
                    error: "course thumbnail is required",
                });
            }
            // let courseBenefit;
            // if (typeof benefit === 'string'){
            //   courseBenefit = benefit.slice(1, -1).split(', ');
            // }else {
            //     courseBenefit = benefit
            // }


            const course = await courseService.createCourse({name, description, regularPrice, sellPrice, teacherId, categoryId, benefit, thumbnail: req.file.filename});

            res.status(201).json({
                course
            })

    }catch (e) {
        next(e)
    }

}
const getAllCourse = async (req, res, next)=>{
    try {
        const course = await courseService.getAllCourse();
        res.status(200).json(course)
    }catch (e) {
        next(e)
    }

}
const getSingleCourse = async (req, res, next)=>{

    try {

    }catch (e) {
        next(e)
    }

}
const updateCourse = async (req, res, next)=>{

    try {

    }catch (e) {
        next(e)
    }

}
const deleteCourse = async (req, res, next)=>{

    try {

    }catch (e) {
        next(e)
    }

}

module.exports = {createCourse, getAllCourse, getSingleCourse, updateCourse, deleteCourse}