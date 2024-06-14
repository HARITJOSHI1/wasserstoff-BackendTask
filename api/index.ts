import express, { type Response } from "express";
import winston from "winston";

const app = express();
app.use(express.json());

// Winston logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "load-balancer.log" }),
  ],
});

app.get("/", (req, res) => {
  console.log("in here");
  res.status(200).json({ message: "Working" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
