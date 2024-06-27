import type { Request, Response, NextFunction } from "express";
import * as jose from "jose";
import { getIssuer } from "../controllers/userController.js";
import {
  JWSInvalid,
  JWSSignatureVerificationFailed,
  JWTExpired,
} from "jose/errors";

const isJwtPayload = (payload: any): payload is jose.JWTPayload => {
  return typeof payload === "object" && payload["iss"];
};

const decodeToken = async (token: string) => {
  const secret = new TextEncoder().encode(process.env.JWT_SCERET);
  const result = await jose.jwtVerify(token, secret, {
    issuer: getIssuer(process.env.NODE_ENV),
  });
  return result;
};

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = "";
  if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "testing") {
    if (!req.headers.authorization)
      return res.status(403).json({
        status: "Forbidden",
        message: "Authorization token is missing",
      });

    token = req.headers.authorization.split("Bearer ").pop()!;
  } else token = req.cookies.token;

  if (!token) {
    return res.status(403).json({
      status: "Forbidden",
      message: "Authorization token is missing",
    });
  }

  try {
    const { payload } = await decodeToken(token);

    if (isJwtPayload(payload)) {
      req.userId = payload.id as string;
      req.token = token;
      return next();
    }

    return res.status(403).json({
      state: "unauthorized",
      message: "Suspected token temparing",
    });
  } catch (e) {
    if (
      e instanceof JWSSignatureVerificationFailed ||
      e instanceof JWTExpired ||
      e instanceof JWSInvalid
    ) {
      if (
        process.env.NODE_ENV === "production" ||
        process.env.NODE_ENV === "preview"
      )
        return res.status(500).json({
          status: e.code,
          message: e.message,
        });
      else {
        console.info("Error occured ", e.message, "\n Stack: ", e.stack);

        return res.status(500).json({
          status: e.code,
          error: e.message,
        });
      }
    }
  }
};

export default authMiddleware;
