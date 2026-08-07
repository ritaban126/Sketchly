// import { betterAuth } from "better-auth";
// import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import { db } from "@repo/db";
// import * as schema from "@repo/db";


// export const auth = betterAuth({
//   database: drizzleAdapter(db, {
//     provider: "pg", // PostgreSQL
//     schema
//   }),
//   emailAndPassword: {
//     enabled: true,
//     requireEmailVerification: false
//   },
//   secret: process.env.BETTER_AUTH_SECRET!,
//   baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
//     trustedOrigins: [
//     process.env.CLIENT_URL || "http://localhost:3000",
//   ],
// });

// export type Session = typeof auth.$Infer.Session;


import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@repo/db";
import * as schema from "@repo/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
  trustedOrigins: [
    process.env.CLIENT_URL || "http://localhost:3000",
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
});

export type Session = typeof auth.$Infer.Session;