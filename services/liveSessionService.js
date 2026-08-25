const error = require("../helpers/error");
const { deleteFile } = require("../middleware/cloudinaryUpload");
const Session = require("../models/Session");

exports.createSession = async (sessionData) => {
  try {
    const session = new Session(sessionData);
    await session.save();
    return { message: "Session Successfully Created" };
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.getSessionsById = async (sessionId) => {
  try {
    const sessions = await Session.findById(sessionId)
      .populate("course", "name sellCount")
      .populate("module", "title");
    return sessions;
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.updateSessionById = async (req) => {
  const { title, description, startingAt, endingAt, meetingUrl } = req.body;
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      throw error("Session Not Found", 400);
    }

    if (!req.file) {
      session.title = title;
      session.description = description;
      session.startingAt = startingAt;
      session.endingAt = endingAt;
      session.meetingUrl = meetingUrl;

      return await session.save();
    }

    // delete previous uploaded file
    await deleteFile(session.thumbnail.public_id);

    session.title = title || session.title;
    session.description = description || session.description;
    session.startingAt = startingAt || session.startingAt;
    session.endingAt = endingAt || session.endingAt;
    session.meetingUrl = meetingUrl || session.meetingUrl;
    session.thumbnail = {
      public_id: req.file?.cloudinaryId,
      secure_url: req.file?.cloudinaryUrl,
    };

    return await session.save();
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.getSessionsByCourse = async (query) => {
  try {
    const sessions = await Session.find(query)
      .populate("course", "name sellCount")
      .populate("module", "title");
    return sessions;
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.getUpcomingFirstSession = async ({ courseId }) => {
  try {
    const query = { course: courseId, startingAt: { $gte: new Date() } };

    const session = await Session.findOne(query)
      .populate("course", "name sellCount")
      .populate("module", "title")
      .sort({ startingAt: 1 })
      .limit(1)
      .exec();

    if (!session) {
      throw error("There are no Upcoming Session");
    }

    return session;
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.deleteSessionById = async (sessionId) => {
  try {
    const session = await Session.findByIdAndDelete(sessionId);

    if (!session) {
      throw error("There Not Found");
    }

    return { message: "Session Successfulyy Deleted" };
  } catch (err) {
    throw error(err.message, err.status);
  }
};
