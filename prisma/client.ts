import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import { env } from "@/env/env";

const libsql = createClient({
  url: env.server.LOCAL_DB_URL || env.server.TURSO_DATABASE_URL,
  authToken: env.server.TURSO_AUTH_TOKEN,
});
const adapter = new PrismaLibSQL(libsql);

export const prisma: PrismaClient = new PrismaClient({ adapter });
