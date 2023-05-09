const mongoose = require("mongoose");
const FormHelper = require("../../helpers/FormHelper");
const CourseContent = require("../../models/CourseContent");
const updateService = require("../common/updateService");
const error = require("../../helpers/error");
const ObjectId = mongoose.Types.ObjectId;

const createContent = async ({ moduleId, videoTitle, videoUrl }) => {
  try {
    const isContent = await CourseContent.findOne({
      $or: [
        { moduleId: new ObjectId(moduleId), videoTitle },
        { moduleId: new ObjectId(moduleId), videoUrl },
      ],
    });

    if (isContent?.videoTitle === videoTitle)
      throw error("videoTitle already exits", 400);
    if (isContent?.videoUrl === videoUrl)
      throw error("videoUrl already exits", 400);

    const content = new CourseContent({
      moduleId,
      videoTitle,
      videoUrl,
    });

    await content.save();

    console.log("content ", content);

    return content;
  } catch (err) {
    throw error(err.message, err.status);
  }
};

const updateContent = async (contentId, { videoTitle, videoUrl }) => {
  if (!FormHelper.isIdValid(contentId)) throw error("id is not valid", 400);

  const isContent = await CourseContent.findOne({
    videoTitle: videoTitle,
    _id: { $ne: new ObjectId(contentId) },
  });

  //   console.log("isContent ", isContent);

  if (isContent) throw error("Content already exits", 400);

  return updateService(
    { _id: new ObjectId(contentId) },
    { videoTitle, videoUrl },
    CourseContent
  );
};

module.exports = { createContent, updateContent };
