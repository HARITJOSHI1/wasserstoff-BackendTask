import { z } from "zod";
import type { Request, Response } from "express";

export const ErrorDTO = z.object({
  error: z.string(),
});

export const UserDTO = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string(),
  age: z.number(),
  city: z.string(),
  zipcode: z.union([z.string(), z.number()]).refine(
    (val) => {
      const zip = typeof val === "number" ? val.toString() : val;
      return zip.length === 6 && /^\d+$/.test(zip);
    },
    {
      message: "Zip code must be exactly 6 digits and numeric",
    }
  ),
});

export const ResponseUserDTO = z.object({
  status: z.string({ message: "Status must be included in the response" }),
  message: z.string().optional(),
  data: z
    .object({
      id: z
        .string()
        .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
          message: "Invalid MongoDB ObjectId",
        })
        .optional(),
      user: UserDTO.extend({ __id: z.string().optional() }).optional(),
      token: z.string().optional(),
    })
    .optional(),

  error: ErrorDTO.optional(),
});

export type RequestUserDTOType = Request<{}, {}, z.infer<typeof UserDTO>>;
export type ResponseUserDTOType = Response<z.infer<typeof ResponseUserDTO>>;
