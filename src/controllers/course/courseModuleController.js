const FormHelper = require('../../helpers/FormHelper');
const courseModuleService = require('../../services/course/courseModuleService');
const createModule = async (req, res, next)=>{
    try {
       const { courseId,  title, moduleNo } = req.body;

       if (!FormHelper.isIdValid(courseId)){
           return res.status(400).json({
               error: 'Provide valid course'
           });
       }
       if (FormHelper.isEmpty(title)){
           return res.status(400).json({
               error: 'Module name is required'
           });
       }
       if (FormHelper.isEmpty(moduleNo)){
           return res.status(400).json({
               error: 'Module number is required'
           });
       }

        const module = await courseModuleService.createService({ courseId,  title, moduleNo });
       res.status(201).json(module);
       
    }catch (e) {
        next(e)
    }
}
const getModules = async (req, res, next)=>{
    try {

    }catch (e) {
        next(e)
    }
}
const updateModule = async (req, res, next)=>{
    try {
        const id = req.params.id;
    }catch (e) {
        next(e)
    }
}

const deleteModule = async (req, res, next)=>{
    try {

    }catch (e) {
        next(e)
    }
}

module.exports = {createModule}