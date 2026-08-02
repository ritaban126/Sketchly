import {neon, neonConfig} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-http";
import {relations} from "./relations";

neonConfig.fetchConnectionCache = true;

type DbClient = ReturnType<typeof drizzle>;

const createDbClient = (): DbClient => {
  if (!process.env.DATABASE_URL) {
    return new Proxy({} as DbClient, {
      get(_target, prop) {
        if (prop === "then") {
          return undefined;
        }

        return () => {
          throw new Error(
            "DATABASE_URL is not configured. Set it in your environment before using database-backed auth routes."
          );
        };
      },
    });
  }

  const sql = neon(process.env.DATABASE_URL);
  return drizzle({
    client: sql,
    relations,
  }) as DbClient;
};

export const db = createDbClient();

export * from "./schema"