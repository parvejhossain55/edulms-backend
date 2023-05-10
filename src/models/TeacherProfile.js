const { Schema, model } = require("mongoose");

const teacherProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    designation: {
      type: String,
    },
    about: {
      type: String,
    },
    categoryId: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const TeacherProfile = model("TeacherProfile", teacherProfileSchema);

module.exports = TeacherProfile;
