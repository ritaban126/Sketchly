import { useStore } from "@nanostores/react";
import { client } from "../lib/auth-client";

export function useAuth() {
  const session = useStore(client.useSession);

  return {
    user: session?.data?.user ?? null,
    isAuthenticated: !!session?.data?.user,
    isLoading: session?.isPending,
    signIn: client.signIn,
    signUp: client.signUp,
    signOut: client.signOut,
  };
}
