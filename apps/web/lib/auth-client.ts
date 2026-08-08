// "use client"
// import { createAuthClient } from 'better-auth/client';
// import { passkeyClient } from "@better-auth/passkey/client";

// export const client = createAuthClient({
//   plugins: [passkeyClient()],
// });


"use client"
import { createAuthClient } from 'better-auth/client';
import { passkeyClient } from "@better-auth/passkey/client";

export const client = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [passkeyClient()],
});