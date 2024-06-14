import express, { type Response } from "express";
import LoggerModule from "../shared/logger.js";
import dotenv from "dotenv";

dotenv.config({path: '/'});
const logger = LoggerModule();

const app = express();
app.use(express.json());

app.get("/demo", (req, res) => {
  console.log("in here");
  res.status(200).json({ message: "Working 4003" });
});

// app.all("*", (_, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.SERVER_PORT_3;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
