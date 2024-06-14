import express from "express";
// import { LoggerModule } from "../shared/logger";
// import proxyMiddleware from "./config/proxy";
import winston from "winston";

export const LOAD_BALANCER_PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "load-balancer.log" }),
  ],
});

app.use("/", (_, res) => {
  console.log("in here", process.env.VERCEL_URL);
  res.status(200).json({ message: `Working ${LOAD_BALANCER_PORT}` });
});

app.all("*", (_, res) => res.status(404).json({ message: "Route not found" }));

app.listen(4000, () => {
  logger.info(`Server running on LOAD_BALANCER_PORT ${LOAD_BALANCER_PORT}`);
});
