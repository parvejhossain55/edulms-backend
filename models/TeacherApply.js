const {Schema, model} = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const TeacherSchema = new Schema(
    {
        email: {
            type: String,
            validate: [validator.isEmail, "Provide a valid Email"],
            trim: true,
            lowercase: true,
            required: [true, "Email address is required"],
            unique: true,
        },
        mobile: {
            type: String,
            trim: true,
            validate: [validator.isMobilePhone, "Provide a valid mobile number"],
        },
        firstName: {
            type: String,
            required: [true, "First name is required"],
            minLength: [3, "First name must be 3 character"],
            maxLength: [100, "First name is too large"],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            minLength: [3, "Last name must be 3 character"],
            maxLength: [100, "Last name is too large"],
            trim: true,
        },
        qualification: {
            type: String,
            required: [true, "Qualification is required"],
            minLength: [3, "Qualification must be 3 character"],
            maxLength: [400, "Qualification is too large"],
            trim: true,
        },
        about: {
            type: String,
            required: [true, "About is required"],
            minLength: [3, "About must be 3 character"],
            maxLength: [1500, "About is too large"],
            trim: true,
        },
        status: {
            type: String,
            enum: ["active", "pending", "rejected"],
            default: "pending",
        },
    },
    {versionKey: false, timestamps: true}
);


const TeacherApply = model("Teacherapply", TeacherSchema);

module.exports = TeacherApply;