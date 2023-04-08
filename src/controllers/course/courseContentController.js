const FormHelper = require('../../helpers/FormHelper');
const CourseContentModel = require('../../models/CourseContent');
const courseContentService = require('../../services/course/courseContentService');
const createContent = async (req, res, next) => {
    try {
        const contentArray = req.body;

        contentArray.map(content => {
            if (!FormHelper.isIdValid(content.moduleId)){
                return res.status(400).json({
                    error: 'Provide a valid module'
                })
            }
            if (FormHelper.isEmpty(content.videoTitle)){
                return res.status(400).json({
                    error: 'Video title is required'
                })
            }
            if (FormHelper.isEmpty(content.videoUrl)){
                return res.status(400).json({
                    error: 'Video URL is required'
                })
            }
        })



        const contents = await courseContentService.createService(contentArray);
        res.status(201).json(contents);


    }catch (e) {
        next(e)
    }
}

const updateContent = async (req, res, next) => {
    try {

    }catch (e) {
        next(e)
    }
}
const deleteContent = async (req, res, next) => {
    try {

    }catch (e) {
        next(e)
    }
}

module.exports = {createContent}