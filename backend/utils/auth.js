import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import * as schema from "../src/models/authModel.js";
import { sendEmail } from "./email.js";
import dotenv from 'dotenv';

dotenv.config({ path: "./config/.env" });

export const auth = betterAuth({

  baseURL: process.env.BETTER_AUTH_URL, 

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

   user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "staff",
      },
    },
  },

  trustedOrigins: ["http://localhost:5173"],

  socialProviders: {
  
  // google: {
  //   clientId: process.env.GOOGLE_CLIENT_ID,
  //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // },

  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
},

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    onExistingUserSignUp: async ({ user }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Sign-up attempt with your email",
        text: "Someone tried to create an account using your email address. If this was you, try signing in instead. If not, you can safely ignore this email.",
      });
    },

    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },

    onPasswordReset: async ({ user }, request) => {
       await sendEmail({
        to: user.email,
        subject: "Password Reset",
        text: `Password for ${user.email} has been reset.`,
      });
      
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    
    sendVerificationEmail: async ({ user, url }) => {  
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },

     sendOnSignIn: true,
  },
  
});

