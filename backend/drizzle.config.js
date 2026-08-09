import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: "./config/.env" });

export default defineConfig({
  schema: "./db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL,
  },
});