const { Schema, model } = require("mongoose");

const teacherProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    qualification: {
      type: String,
    },
    about: {
      type: String,
    },
      picture: {
          public_id: { type: String },
          secure_url: { type: String },
      },
  },
  { versionKey: false, timestamps: true }
);

const TeacherProfile = model("TeacherProfile", teacherProfileSchema);

module.exports = TeacherProfile;
