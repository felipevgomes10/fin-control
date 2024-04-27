import { z } from "zod";

const envSchema = z.object({
  server: z.object({
    AUTH_SECRET: z.string(),
    AUTH_GITHUB_ID: z.string(),
    AUTH_GITHUB_SECRET: z.string(),
  }),
});

export const env = envSchema.parse({
  server: process.env,
});
