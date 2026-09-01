const jwt = require("jsonwebtoken");
const apiError = require("../utils/apiError");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.accessTokens;

    if (!token) {
      throw apiError(401, "Unauthorized! Token not found");
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;