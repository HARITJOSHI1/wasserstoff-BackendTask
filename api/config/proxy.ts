import type { NextFunction, Response, Request } from "express";
import proxy from "express-http-proxy";

const validPorts = [4001, 4002, 4003];
const proxyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const host = req.headers.host;
  if (!host) {
    res.status(400).send("Bad Request: Host header is missing");
    return;
  }

  const portMatch = host.match(/:(\d+)$/);
  const portUrl = portMatch && parseInt(portMatch[1], 10);
  const port = parseInt(req.headers["x-port"] as string, 10);

  if (!port && portUrl === +process.env.PORT!) return next();

  if (validPorts.includes(port)) {
    if (process.env.NODE_ENV === "production")
      return proxy(`https://${process.env.VERCEL_URL}`)(req, res, next);
    return proxy(`http://localhost:${port}`)(req, res, next);
  } else {
    return res.status(404).json({ message: "Port not found" });
  }
};

export default proxyMiddleware;
