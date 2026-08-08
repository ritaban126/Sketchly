// "use client"
// import { createAuthClient } from 'better-auth/client';
// import { passkeyClient } from "@better-auth/passkey/client";

// export const client = createAuthClient({
//   plugins: [passkeyClient()],
// });


"use client"
import { createAuthClient } from 'better-auth/client';
import { passkeyClient } from "@better-auth/passkey/client";

const baseURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

export const client = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [passkeyClient()],
});