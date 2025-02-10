import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    ANALYZE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    SPOTIFY_CLIENT_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID: z.string(),
    NEXT_PUBLIC_SPOTIFY_REDIRECT_URI: z.string().url(),
  },
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    NEXT_PUBLIC_SPOTIFY_REDIRECT_URI: process.env.NEXT_PUBLIC_API_URL,
  },
});
