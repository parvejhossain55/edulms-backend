const FormHelper = require("../../helpers/FormHelper");
const CourseContent = require("../../models/CourseContent");
const dropDownService = require("../../services/common/dropDownService");
const findAllService = require("../../services/common/findAllService");
const listService = require("../../services/common/listService");
const courseContentService = require("../../services/course/courseContentService");

const createContent = async (req, res, next) => {
  try {
    const {contents} = req.body;

    contents?.map(content => {
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
    });

    const modifiedData = contents?.map(content => {
      return {
        ...content,
        videoTitle: content?.videoTitle?.toLowerCase(),
        videoUrl: content?.videoUrl?.toLowerCase()
      };
    });

    await courseContentService.createContent(modifiedData);
    res.status(201).json({
      message: 'Course contents create successfully'
    });
  } catch (e) {
    next(e);
  }
};

const getContent = async (req, res, next) => {
  try {
    let SearchRgx = { $regex: req.params.searchKeyword, $options: "i" };
    let SearchArray = [{ name: SearchRgx }];
    const contents = await listService(req, CourseContent, SearchArray);
    res.status(200).json(contents);
  } catch (e) {
    next(e);
  }
};

const getContentsbyID = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const content = await findAllService({ moduleId }, CourseContent);

    res.status(200).json(content);
  } catch (e) {
    next(e);
  }
};

const dropDownModules = async (req, res, next) => {
  try {
    const projection = {
      label: "$videoTitle",
      value: "$_id",
    };
    const content = await dropDownService(CourseContent, projection);
    res.status(200).json(content);
  } catch (e) {
    next(e);
  }
};

const updateContent = async (req, res, next) => {
  try {
    const contentId = req.params.id;
    const { videoTitle, videoUrl } = req.body;

    if (FormHelper.isEmpty(videoTitle)) {
      res.status(400).json({
        error: "videoTitle is required",
      });
    }
    if (FormHelper.isEmpty(videoUrl)) {
      res.status(400).json({
        error: "videoUrl is required",
      });
    }

    const content = await courseContentService.updateContent(contentId, {
      videoTitle,
      videoUrl,
    });
    res.status(200).json({ content });
  } catch (e) {}
};

const deleteContent = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createContent,
  getContent,
  getContentsbyID,
  dropDownModules,
  updateContent,
};
