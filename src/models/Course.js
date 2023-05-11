const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const { ObjectId } = Schema.Types;
const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      minLength: [3, "Course name must be 3 character"],
      maxLength: [300, "Course name is too large"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
    regularPrice: {
      type: Number,
      required: [true, "price is required"],
    },
    sellPrice: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    seats: { type: Number, required: [true, "Seats is required"] },
    teacherId: {
      type: ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
    startingDate: {
      type: Date,
      require: [true, "Starting date is required"],
    },
    endingDate: {
      type: Date,
      require: [true, "Ending date is required"],
    },
    categoryId: {
      type: ObjectId,
      ref: "CourseCategory",
      required: [true, "category is required"],
    },
    benefit: [String],
    thumbnail: {
      public_id: { type: String },
      secure_url: { type: String },
    },
    courseType: {
      type: String,
      required: [true, "require, course is free or paid"],
      enum: ["free", "paid"],
    },
    status: {
      type: String,
      enum: ["draft", "pending", "published"],
      default: "draft",
    },
  },
  { versionKey: false, timestamps: true }
);

courseSchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

const course = model("Course", courseSchema);

module.exports = course;
