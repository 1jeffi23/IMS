import dotenv from "dotenv";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

dotenv.config({
  path: "./config/.env",
});

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export const db = drizzle(pool);

// export {pool};