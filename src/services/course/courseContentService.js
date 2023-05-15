const mongoose = require("mongoose");
const FormHelper = require("../../helpers/FormHelper");
const CourseContent = require("../../models/CourseContent");
const CourseModule = require("../../models/CourseModule");
const updateService = require("../common/updateService");
const error = require("../../helpers/error");
const findOneByQuery = require("../common/findOneByQuery");
const ObjectId = mongoose.Types.ObjectId;

const checkSerialNoUnique = (contents, key) => {
  const setArray = new Set();

  for (const content of contents) {
    if (setArray.has(content[key])) {
      return false; // Duplicate serialNo found
    }
    setArray.add(content[key]);
  }

  // return true; // All serialNo values are unique
  return setArray;
};

const createContent = async (contents) => {

  const errors = (await Promise.all(contents.map(async content => {
    const modules = await CourseModule.find({courseId: content?.courseId}, {_id: 1});

    const moduleErrors = await Promise.all(modules.map(async module => {
      const isTitle = await CourseContent.findOne({moduleId: module?._id, videoTitle: content?.videoTitle?.toLowerCase()?.trim()});
      const isUrl = await CourseContent.findOne({moduleId: module?._id, videoUrl: content?.videoUrl?.toLowerCase()?.trim()});
      const isSerial = await CourseContent.findOne({moduleId: content?.moduleId, serialNo: content?.serialNo});

      if (isTitle) {
        return `${content?.videoTitle} - already exists in this course`;
      }else if (isUrl){
        return `${content?.videoUrl} - already exists in this course`;
      }else if (isSerial){
        return `${content?.serialNo} - Serial No already exists in this module`;
      }

    }));

    return moduleErrors.filter(Boolean); // Filter out undefined values
  }))).flat();

  const isVideoTitleNoUnique = checkSerialNoUnique(contents, 'videoTitle');
  const isVideoUrlNoUnique = checkSerialNoUnique(contents, 'videoUrl');
  const isSerialNoNoUnique = checkSerialNoUnique(contents, 'serialNo');

  if (!isVideoTitleNoUnique){
    throw error('You provide same video title, please provide different video title', 400)
  }
  if (!isVideoUrlNoUnique){
    throw error('You provide same video url, please provide different video url', 400)
  }
  if (!isSerialNoNoUnique){
    throw error('You provide same serial no, please provide different serial no', 400)
  }

  errors.forEach(err => {
    throw error(err, 400)
  })

  contents?.map(async content => {
   await CourseContent.create({
      moduleId: content?.moduleId,
      videoTitle: content?.videoTitle,
      videoUrl: content?.videoUrl,
      serialNo: content?.serialNo
    })
  })
  return true

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
