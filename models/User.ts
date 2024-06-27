import mongoose, { Schema, Document } from "mongoose";
import type { z } from "zod";
import type { UserDTO } from "../dtos/user/index.js";

// Create the schema for the User model
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Invalid email address"],
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    city: {
      type: String,
      required: true,
    },
    zipcode: {
      type: Number,
      required: true,
      length: 6,
    },
  },
  {
    timestamps: true,
  }
);

// Create the User model
const User = mongoose.model<z.infer<typeof UserDTO>>("User", UserSchema);

export default User;
