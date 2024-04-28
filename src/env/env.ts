import { z } from "zod";

const envSchema = z.object({
  server: z.object({
    AUTH_SECRET: z.string(),
    AUTH_GITHUB_ID: z.string(),
    AUTH_GITHUB_SECRET: z.string(),
    TURSO_DATABASE_URL: z.string(),
    TURSO_AUTH_TOKEN: z.string(),
    LOCAL_DB_URL: z.string(),
  }),
});

export const env = envSchema.parse({
  server: process.env,
});
