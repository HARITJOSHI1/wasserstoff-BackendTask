import express from "express";
import LoggerModule from "../shared/logger.js";
// import proxyMiddleware from "./config/proxy";
// import winston from "winston";

const LOAD_BALANCER_PORT = process.env.PORT || 4000;
const app = express();
const logger = LoggerModule();

app.use(express.json());

app.use("/", (_, res) => {
  logger.info(`hit the root route ${process.env}`);
  return res.status(200).json({ message: `Working ${LOAD_BALANCER_PORT}` });
});

app.all("*", (_, res) => res.status(404).json({ message: "Route not found" }));

app.listen(4000, () => {
  logger.info(`Server running on LOAD_BALANCER_PORT ${LOAD_BALANCER_PORT}`);
});