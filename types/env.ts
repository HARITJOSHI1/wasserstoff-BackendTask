import z, { type TypeOf } from "zod";

// env schema
const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "preview", "production", "testing"]),
  JWT_SCERET: z.string(),
  MONGO_URI: z.string(),
  JWT_ISSURER_DEV: z.string(),
  JWT_ISSURER_PREVIEW: z.string(),
  JWT_TOKEN_EXP: z.number()
});

// augmenting ProcessEnv interface to also bound to types present in 'envSchema'
declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypeOf<typeof envSchema> {}
  }
}

try {
  envSchema.parse(process.env);
} catch (err) {
  if (err instanceof z.ZodError) {
    const { fieldErrors } = err.flatten();
    const errorMessage = Object.entries(fieldErrors)
      .map(([field, errors]) =>
        errors ? `${field}: ${errors.join(", ")}` : field
      )
      .join("\n  ");

    if (
      process.env.NODE_ENV === "production" ||
      process.env.NODE_ENV === "preview"
    )
      process.exit(1);
    else throw new Error(`Missing environment variables:\n  ${errorMessage}`);
  }
}
