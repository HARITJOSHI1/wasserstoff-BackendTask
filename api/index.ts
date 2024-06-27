import express from "express";
import dotenv from "dotenv";
import connectDB from "../db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import UserRouter from "../routes/userRoutes.js";

const APP_PORT = process.env.PORT || 4000;

// bootsrtaping express app
const app = express();

// config path for .env vars and establishing db connection
dotenv.config();
connectDB();

// middlewares to handle bodyparsing to json along with multipart data and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// mounted user router
app.use("/api/worko", UserRouter);

// handle not found when none of the path mathces
app.all("*", (_, res) =>
  res.status(404).json({ status: "Failure", error: "Route not found" })
);

// listen to port
app.listen(4000, () => {
  console.info(`Server running on PORT ${APP_PORT}`);
});
