import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

// performs serverside validations based on zod rules which we set up
const validate = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));
        return res.status(422).json({status: "validationFailure", errors: formattedErrors });
      }
      next(error);
    }
  };
};

export default validate;
