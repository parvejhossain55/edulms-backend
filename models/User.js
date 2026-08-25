const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
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
    password: {
      type: String,
      // required: [true, "Password is required"],
      // validate: {
      //   validator: (value) =>
      //     validator.isStrongPassword(value, {
      //       minLength: 8,
      //       minUppercase: 1,
      //       minNumbers: 1,
      //       minSymbols: 1,
      //       minLowercase: 1,
      //     }),
      //   message: "Please provide a strong password",
      // },
        default: ''
    },
    picture: {
      public_id: { type: String },
      secure_url: { type: String },
    },
    confirmPassword: {
      type: String,
      // required: [true, "Confirm Password is required"],
      // validate: {
      //   validator: function (value) {
      //     return value === this.password;
      //   },
      //   message: "Password does not match",
      // },
        default: ''
    },

    roleId: { type: Schema.Types.ObjectId, ref: "Role" },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },

    verified: {
      type: Boolean,
      default: false,
    },
    confirmationToken: {
      type: String,
    },
    confirmationTokenExpires: {
      type: Date,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.password === "") {
    return next();
  }

  const password = this.password;
  this.password = bcrypt.hashSync(password);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePassword = function (password, hash) {
  return bcrypt.compareSync(password, hash);
};

userSchema.methods.hashPassword = function (password) {
  return bcrypt.hashSync(password);
};

const User = model("User", userSchema);

module.exports = User;
