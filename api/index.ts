import express from "express";
import LoggerModule from "../shared/logger.js";
import proxyMiddleware from "./config/proxy.js";

const LOAD_BALANCER_PORT = process.env.PORT || 4000;
const app = express();
const logger = LoggerModule();

app.use(express.json());

// app.use("/demo", (_, res) =>
//   res.status(200).json({ message: `Working ${LOAD_BALANCER_PORT}` })
// );

app.use("/demo", (req, _, next) => {
  req.headers["x-port"] = "4001";
  return next();
}, proxyMiddleware);

app.all("*", (_, res) => res.status(404).json({ message: "Route not found" }));

app.listen(4000, () => {
  logger.info(`Server running on LOAD_BALANCER_PORT ${LOAD_BALANCER_PORT}`);
});
