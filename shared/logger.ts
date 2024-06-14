import winston from "winston";

const LoggerModule = () => {
  return winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "load-balancer.log" }),
    ],
  });
};

export default LoggerModule;
