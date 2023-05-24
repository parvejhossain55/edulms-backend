const mongoose = require("mongoose");

// Define the Session schema
const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Plesee provide a Session Title"],
    },
    description: {
      type: String,
      //   required: [true, "Please provide description"],
    },
    startingAt: {
      type: Date,
      required: [true, "Please provide staring time"],
    },
    endingAt: {
      type: Date,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course Id is Required"],
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseModule",
      required: [true, "Module Id is Required"],
    },
    meetingUrl: {
      type: String,
      required: [true, "Please Provide Meeting Url"],
    },
  },
  { versionKey: false, timestamps: true }
);

// Create the Session model
const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
