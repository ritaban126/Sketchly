import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@repo/db";
import * as schema from "@repo/db";


export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL
    schema
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
});

export type Session = typeof auth.$Infer.Session;