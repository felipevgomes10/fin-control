import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient, type Client } from "@libsql/client";
import { env } from "@/env/env";

let libsql: Client | null = null;
let adapter: PrismaLibSQL | null = null;

if (env.server.USE_LOCAL_DB === "true") {
  libsql = createClient({
    url: env.server.TURSO_DATABASE_URL,
    authToken: env.server.TURSO_AUTH_TOKEN,
  });
  adapter = new PrismaLibSQL(libsql);
}

export const prisma = adapter
  ? new PrismaClient({ adapter })
  : new PrismaClient();
