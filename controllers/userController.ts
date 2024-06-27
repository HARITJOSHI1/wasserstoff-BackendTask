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
      return process.env.JWT_ISSURER_PRODUCTION;
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

    const env = process.env.NODE_ENV;

    // if user has a token don't sign in again
    if ((env === "preview" || env === "production") && token)
      return res.status(400).json({
        status: "bad request",
        message: "User already exisits",
      });
    else {
      const user = await User.findOne({ email: req.body.email });
      if (user)
        return res.status(400).json({
          status: "bad request",
          message: "User already exisits",
        });
    }

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

export const getUser = async (
  req: RequestUserDTOType,
  res: ResponseUserDTOType
) => {
  try {
    const user = await User.findById(req.userId, { _id: 0, __v: 0 }).lean();

    if (!user)
      return res.status(404).json({
        status: "failed",
        message: "No user found",
      });

    res.setHeader("Cahce-Control", "max-age=120, stale-while-revalidate=59");

    return res.status(200).json({
      status: "success",
      message: "User information fetched",
      data: { users: [user] },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "failed", error: (err as any).message });
  }
};

export const getAllUser = async (
  req: RequestUserDTOType,
  res: ResponseUserDTOType
) => {
  try {
    const users = await User.find({}).lean();

    if (!users.length)
      return res.status(404).json({
        status: "failed",
        message: "No users found",
      });

    res.setHeader("Cahce-Control", "max-age=120, stale-while-revalidate=59");

    return res.status(200).json({
      status: "success",
      message: "User information fetched",
      data: { users: users },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "failed", error: (err as any).message });
  }
};

export const deleteUser = async (
  req: RequestUserDTOType,
  res: ResponseUserDTOType
) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);

    return res.status(200).json({
      status: "success",
      message: "User information deleted",
      data: { id: user?.id },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "failed", error: (err as any).message });
  }
};

export const updateUser = async (
  req: RequestUserDTOType,
  res: ResponseUserDTOType
) => {
  try {
    if (!Object.keys(req.body).length)
      return res.status(200).json({
        status: "success",
        message: "No user data provided nothing updated!",
        data: { users: [] },
      });

    const user = await User.findByIdAndUpdate(req.userId, req.body, {
      projection: {
        _id: 0,
        __v: 0,
      },
      new: true,
    }).lean();

    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: { users: [user!] },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "failed", error: (err as any).message });
  }
};
