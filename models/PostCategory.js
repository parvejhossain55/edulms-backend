const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: [true, "Slug is must be unique"],
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
