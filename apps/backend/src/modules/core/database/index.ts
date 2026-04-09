import env from "../utility/env";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
const sql = neon(env.DATABASE_URL!);

export const db: any = drizzle(sql, { schema });
