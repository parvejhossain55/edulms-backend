const error = require("../helpers/error");
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

exports.getSessionsByCourse = async (query) => {
  try {
    console.log("query ", query);

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
