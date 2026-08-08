import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../../db/index.js";
 import * as schema from "./schema.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
     schema
  }),
   


  emailAndPassword: {
    enabled: true,
  },
});