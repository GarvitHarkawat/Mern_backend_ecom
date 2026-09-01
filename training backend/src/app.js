const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./modules/auth/auth.routes");
const userRouter = require("./modules/user/user.routes");
const categoryRouter = require("./modules/category/category.routes");
const BrandRouter = require("./modules/brand/brand.routes");
const apiResponse = require("./utils/apiResponse");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// Health check route
app.get("/api/v1/health", (req, res) =>
  res.status(200).json(
    apiResponse(
      200,
      {
        service: "ecom-backend",
        env: process.env.NODE_ENV || "development",
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
      },
      "API is running"
    )
  )
);

// API Routes
app.use("/api/v1/brand", BrandRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

// 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;