const FormHelper = require("../helpers/FormHelper");
const sessionService = require("../services/liveSessionService");

// Controller function to create a session
exports.createSession = async (req, res, next) => {
  try {
    const { title, description, startingAt, course, module, meetingUrl } =
      req.body;

    if (FormHelper.isEmpty(title)) {
      return res.status(400).json({ error: "Session title is required" });
    }
    if (FormHelper.isEmpty(description)) {
      return res.status(400).json({ error: "Session description is required" });
    }
    if (FormHelper.isEmpty(startingAt)) {
      return res
        .status(400)
        .json({ error: "Session starting date is required" });
    }
    if (FormHelper.isEmpty(meetingUrl)) {
      return res
        .status(400)
        .json({ error: "Session meeting url  is required" });
    }
    if (!FormHelper.isIdValid(course)) {
      return res.status(400).json({ error: "Provide valid course id" });
    }
    if (!FormHelper.isIdValid(module)) {
      return res.status(400).json({ error: "Provide valid module id" });
    }

    req.body.thumbnail = {
      public_id: req.file.cloudinaryId,
      secure_url: req.file.cloudinaryUrl,
    };

    const session = await sessionService.createSession(req.body);

    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
};

exports.updateSession = async (req, res, next) => {
  try {
    if (!FormHelper.isIdValid(req.params.id)) {
      return res.status(400).json({ error: "Provide valid session id" });
    }

    const session = await sessionService.updateSessionById(req);

    res.status(200).json(session);
  } catch (err) {
    next(err);
  }
};

exports.getSessionsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (FormHelper.isEmpty(id)) {
      return res.status(400).json({ error: "Session Id is required" });
    }
    if (!FormHelper.isIdValid(id)) {
      return res.status(400).json({ error: "Provide Valid Session Id" });
    }

    const sessions = await sessionService.getSessionsById(id);

    res.status(200).json(sessions);
  } catch (err) {
    next(err);
  }
};

exports.getSessionsByCourse = async (req, res, next) => {
  try {
    const { courseId, moduleId } = req.query;

    if (FormHelper.isEmpty(courseId)) {
      return res.status(400).json({ error: "Course Id is required" });
    }
    if (!FormHelper.isIdValid(courseId)) {
      return res.status(400).json({ error: "Provide Valid Course id" });
    }
    if (moduleId) {
      if (!FormHelper.isIdValid(moduleId)) {
        return res.status(400).json({ error: "Provide Valid Module id" });
      }
    }

    const query = { course: courseId };
    if (moduleId) {
      query.module = moduleId;
    }

    const sessions = await sessionService.getSessionsByCourse(query);

    res.status(200).json(sessions);
  } catch (err) {
    next(err);
  }
};

exports.getUpcomingFirstSession = async (req, res, next) => {
  try {
    const { courseId } = req.query;

    if (FormHelper.isEmpty(courseId)) {
      return res.status(400).json({ error: "Course Id is required" });
    }
    if (!FormHelper.isIdValid(courseId)) {
      return res.status(400).json({ error: "Provide Valid Course id" });
    }

    const sessions = await sessionService.getUpcomingFirstSession(req.query);
    res.status(200).json(sessions);
  } catch (err) {
    next(err);
  }
};

exports.deleteSessionById = async (req, res, next) => {
  try {
    if (FormHelper.isEmpty(req.params.id)) {
      return res.status(400).json({ error: "Session Id is required" });
    }
    if (!FormHelper.isIdValid(req.params.id)) {
      return res.status(400).json({ error: "Provide Valid Session id" });
    }

    const sessions = await sessionService.deleteSessionById(req.params.id);
    res.status(200).json(sessions);
  } catch (err) {
    next(err);
  }
};
