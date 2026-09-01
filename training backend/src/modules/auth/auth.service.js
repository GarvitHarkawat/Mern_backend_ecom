const authModel = require("../../models/auth.model");
const apiError = require("../../utils/apiError");
const { hashPassword, verifyPassword } = require("../../utils/password");
const { signAccessToken, signRefreshToken } = require("../../utils/token");
const RefreshModel = require("../../models/refreshToken.model");

//register svc
const registerService = async (data) => {
  const { name, email, password, role } = data;

  const isExist = await authModel.findOne({ email });

  if (isExist) {
    throw apiError(409, "User already exists!!");
  }

  const hash = await hashPassword(password);

  const userData = {
    name,
    email,
    password: hash,
    role,
  };

  const user = await authModel.create(userData);

  return {
    user,
  };
};

const createRefreshService = async ({ userId, token }) => {
  await RefreshModel.deleteMany({
    user: userId,
  });
  const refreshData = await RefreshModel.create({
    user: userId,
    token: token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
};

const getUserById = async (userID) => {
  const user = await authModel.findById(userID);

  if (!user) {
    return null;
  }

  return user;
};

//login svc
const loginService = async (data) => {
  const { email, password } = data;

  const isUser = await authModel.findOne({ email }).select("+password");

  if (!isUser) {
    throw apiError(404, "User does not exist!!");
  }

  const isPasswordCorrect = await verifyPassword(password, isUser.password);

  if (!isPasswordCorrect) {
    throw apiError(401, "Incorrect Credentials!");
  }

  return {
    user: isUser,
  };
};

//logout svc
const logoutService = async (refreshToken) => {
  await RefreshModel.deleteOne({
    token: refreshToken,
  });
};

//chanmgePassword svc
const changePasswordService = async (data) => {
  const { userID, newPassword, oldPassword } = data;

  //get user password with hash password
  const user = await authModel.findById(userID).select("+password");
  console.log("USER ID:", userID);
  console.log("USER FOUND:", !!user);
  console.log("HASHED PASSWORD:", user?.password);
  if (!user) {
    throw apiError(404, "user not found");
  }
  console.log("OLD PASSWORD RECEIVED:", oldPassword);
  //verify old password
  const decode = await verifyPassword(oldPassword, user.password);
  console.log("PASSWORD MATCH:", decode);

  if (!decode) {
    throw apiError(400, "Invalid Password!");
  }

  //hashed new password
  const hashNewPassword = await hashPassword(newPassword);

  user.password = hashNewPassword;
  await user.save();
};

const authService = {
  registerService,
  loginService,
  logoutService,
  changePasswordService,
  createRefreshService,
  getUserById,
};
module.exports = authService;
