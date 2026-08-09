
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: "./config/.env" });

const sql = neon(process.env.DB_URL);

export const db = drizzle(sql);    //created neon nd drizzle connection