const userService = require("./userService");
const UserModel = require("../models/User");
const error = require("../helpers/error");
const otpService = require("./otpService");
const sendOTP = require("../helpers/sendOTP");
const authHelper = require("../helpers/authHelper");
const rolePermissionService = require("./rolePermissionService");
const jwt = require("jsonwebtoken");
const findOneByQuery = require("./common/findOneByQuery");
const sendEmail = require("../helpers/sendEmail");
const newAccountEmailTemplate = require("../emailTemplate/newAccountEmail");
const {ObjectId} = require("mongodb");

const registerService = async ({
  email,
  firstName,
  lastName,
  password,
  confirmPassword,
  role = "user",
}) => {

  const isMatch = await userService.findUserByEmail({email});
  if (isMatch) throw error("Email already taken", 400);

  const isOtp = await otpService.findOptByProperty({ email: email });
  const otp = Math.floor(100000 + Math.random() * 900000);

  if (isOtp) {
    await otpService.updateOtp({ email, otp, status: 0 });
  } else {
    await otpService.createOtp({ email, otp });
  }
  // Email Send
  const send = await sendOTP(
    email,
    "Your Verification Code is= " + otp,
    `${process.env.APP_NAME} email verification`
  );

  if (send[0].statusCode === 202) {
    let isRole = await rolePermissionService.roleFindByProperty("name", "user");
    if (!isRole) {
      isRole = await rolePermissionService.createNewRoleService({
        roleName: role,
      });
    }
    return await userService.createNewUser({
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      roleId: isRole?._id,
    });
  } else {
    throw error("Server error occurred", 5000);
  }
};


const loginService = async ({ email, password }) => {
  const user = await userService.findUserByProperty("email", email);
  if (!user) throw error("Email or password do not match", 400);

  const isMatch = authHelper.comparePassword({ password, hash: user.password });
  if (!isMatch) throw error("Email or password do not match", 400);

  if (!user?.verified)
    throw error("Your account is not verify. please verify your account", 400);
  if (user?.status !== "active")
    throw error(
      "Your account is not active. please contact Administrator",
      400
    );

  return authHelper.createToken(user);
};

const socialLoginService = async (userData) => {
  const { email, firstName, lastName, mobile, picture } = userData;
  const user = await userService.findUserByProperty("email", email);
  if (!user) {
    let isRole = await rolePermissionService.roleFindByProperty("name", "user");

    if (!isRole) {
      isRole = await rolePermissionService.createNewRoleService({
        roleName: "user",
      });
    }

    await userService.createNewUser({
      email,
      mobile,
      firstName,
      lastName,
      password: "",
      confirmPassword: "",
      picture,
      verified: true,
      roleId: isRole?._id,
    });

    const user = await userService.findUserByProperty("email", email);

    return authHelper.createToken(user);
  }
  return authHelper.createToken(user);
};

const sendOtpService = async (email) => {
  const isUser = await userService.findUserByProperty("email", email);

  if (!isUser) throw error("Account not found", 400);
  const isOtp = await otpService.findOptByProperty({ email });
  const otp = Math.floor(100000 + Math.random() * 900000);

  if (isOtp) {
    await otpService.updateOtp({ email, otp, status: 0 });
  } else {
    await otpService.createOtp({ email, otp });
  }
  // Email Send
  const send = await sendOTP(
    email,
    "Your Verification Code is= " + otp,
    `${process.env.APP_NAME} email verification`
  );

  if (send[0].statusCode !== 202) {
    throw error("Server error occurred", 5000);
  }
  return otp?.otp;
};

const verifyOtpService = async (email, otp, options) => {
  const isOtp = await otpService.findOptByProperty(
    { email, otp, status: 0 },
    null,
    options
  );

  if (!isOtp) throw error("Invalid OTP", 400);

  isOtp.status = 1;
  if (!isOtp) throw error("Invalid OTP", 400);

  isOtp.status = 1;

  await isOtp.save(options);

  return userService.userUpdateService({ email }, { verified: true }, options);
};
const passwordChangeService = async ({
  email,
  oldPassword,
  password,
  confirmPassword,
}) => {
  const user = await userService.findUserByProperty("email", email);

  const userHashPassword = user ? user.password : "";

  const isMatch = authHelper.comparePassword({
    password: oldPassword,
    hash: userHashPassword,
  });

  if (!isMatch) throw error("Old password doesn't match", 400);

  const hash = authHelper.hashPassword(password);

  return userService.passwordUpdateService({ email, hash });
};

const resetPasswordService = async ({ email, otp, password, options }) => {
  const isOtp = await otpService.findOptByProperty({ email, otp, status: 1 });

  if (!isOtp) throw error("Invalid request", 400);

  const isUser = await userService.findUserByProperty("email", email);

  if (!isUser) throw error("Invalid request", 400);

  const hash = authHelper.hashPassword(password);

  await userService.passwordUpdateService({ email, hash, options });

  return otpService.updateOtp({ email, otp, status: 1, options });
};

const setPasswordService = async (
    { token, password }
) => {
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await findOneByQuery({ email: decoded?.email, confirmationToken: token }, UserModel);
  if (!user) throw error('Invalid token', 401);
  if (decoded.exp < Date.now() / 1000) throw error("token has expired", 401);
  const hashPassword = authHelper.hashPassword(password);
  user.confirmationToken = "";
  user.verified = true;
  user.save();
  return userService.passwordUpdateService({ email: decoded.email, hash: hashPassword });
}

module.exports = {
  registerService,
  loginService,
  socialLoginService,
  sendOtpService,
  verifyOtpService,
  passwordChangeService,
  resetPasswordService,
  setPasswordService,
};
