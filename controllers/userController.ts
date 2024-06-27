import type { Response } from "express";
import type {
  RequestUserDTOType,
  ResponseUserDTOType,
} from "../dtos/user/index.js";
import User from "../models/User.js";
import * as jose from "jose";

export const getIssuer = (env: typeof process.env.NODE_ENV) => {
  switch (env) {
    case "dev":
      return process.env.JWT_ISSURER_DEV;
    case "testing":
      return process.env.JWT_ISSURER_DEV;
    case "production":
      return process.env.JWT_ISSURER_PREVIEW;
    case "preview":
      return process.env.JWT_ISSURER_PREVIEW;
  }
};

const generateToken = async (userId: string, res: Response) => {
  const secret = new TextEncoder().encode(process.env.JWT_SCERET);
  const alg = "HS256";
  const env = process.env.NODE_ENV;

  const jwt = await new jose.SignJWT({ id: userId })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(getIssuer(env))
    .setExpirationTime(process.env.JWT_TOKEN_EXP)
    .sign(secret);

  if (env === "dev" || env === "testing")
    res.setHeader("Authorization", `Bearer ${jwt}`);
  else res.cookie("token", jwt);
  return jwt;
};

export const userCreation = async (
  req: RequestUserDTOType,
  res: ResponseUserDTOType
) => {
  try {
    const token =
      req.headers.authorization?.split("Bearer ").pop() || req.cookies.token;

    // if user has a token don't sign in again
    if (token)
      return res.status(400).json({
        status: "bad request",
        message: "User already exisits",
      });

    // create new user
    const user = new User({ ...req.body });
    await user.save();

    // token generation
    const newToken = await generateToken(user.id, res);
    console.log("New token generated", newToken);

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: { id: user.id, token: newToken },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "failed", error: (err as any).message });
  }
};
