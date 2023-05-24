const validator = require("validator");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
class FormHelper {
  isEmpty = (value) => {
    return (
      value === "" ||
      value === undefined ||
      value === null ||
      (value instanceof Array && value.length < 1) ||
      (value instanceof Object && Object.keys(value).length < 1)
    );
  };
  isEmail = (email) => {
    return validator.isEmail(email);
  };
  isMobile = (mobile) => {
    return validator.isMobilePhone(mobile);
  };

  isPasswordValid = (password) => {
    return validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minLowercase: 1,
    });
  };

  comparePassword = (password, confirmPassword) => {
    return password === confirmPassword;
  };

  isIdValid = (id) => {
    return ObjectId.isValid(id);
  };
  isUrl = (url) => {
    return validator.isURL(url);
  };
}

module.exports = new FormHelper();
