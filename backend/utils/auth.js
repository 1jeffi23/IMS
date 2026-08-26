import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";

import { db } from "../db/index.js";
import * as schema from "../src/models/authModel.js";

import { createAuditLog } from "../utils/auditLogger.js";
import { sendEmail } from "./email.js";

import dotenv from "dotenv";
import { eq } from "drizzle-orm";

dotenv.config();


const testUser = await db
  .select({
    email: schema.user.email,
    providerId: schema.account.providerId,
    hasPassword: schema.account.password,
  })
  .from(schema.user)
  .leftJoin(
    schema.account,
    eq(schema.user.id, schema.account.userId)
  )
  .where(eq(schema.user.email, "aribalodhi6@gmail.com"));

console.log("PRODUCTION AUTH DB CHECK:", {
  found: testUser.length,
  email: testUser[0]?.email,
  providerId: testUser[0]?.providerId,
  hasPassword: !!testUser[0]?.hasPassword,
});


export const auth = betterAuth({

  baseURL: process.env.BETTER_AUTH_URL,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),


  // =====================================================
  // USER
  // =====================================================

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "cashier",
      },
    },
  },


  // =====================================================
  // SESSION
  // =====================================================

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    disableSessionRefresh: true,
  },


  trustedOrigins: [
    "https://ims-five-rho.vercel.app",
  ],


  // =====================================================
  // AUTH AUDIT LOGS
  // =====================================================

  hooks: {

    after: createAuthMiddleware(async (ctx) => {

      // =================================================
      // LOGIN
      // =================================================

      if (
        ctx.path === "/sign-in/email" ||
        ctx.path.startsWith("/sign-in/")
      ) {

        const newSession =
          ctx.context.newSession;

        if (newSession?.user) {

          await createAuditLog({

            userId:
              newSession.user.id,

            action:
              "LOGIN",

            module:
              "AUTH",

            entityId:
              newSession.user.id,

            description:
              `User ${newSession.user.name || newSession.user.email} logged in`,

          });

        }

      }


      // =================================================
      // LOGOUT
      // =================================================

      if (
        ctx.path === "/sign-out"
      ) {

        /*
         * Get the current session before logout
         * if Better Auth still exposes it in context.
         */

        const session =
          ctx.context.session;

        if (session?.user) {

          await createAuditLog({

            userId:
              session.user.id,

            action:
              "LOGOUT",

            module:
              "AUTH",

            entityId:
              session.user.id,

            description:
              `User ${session.user.name || session.user.email} logged out`,

          });

        }

      }

    }),

  },


  // =====================================================
  // SOCIAL PROVIDERS
  // =====================================================

  socialProviders: {

    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // },

    github: {
      clientId:
        process.env.GITHUB_CLIENT_ID,

      clientSecret:
        process.env.GITHUB_CLIENT_SECRET,
    },

  },


  // =====================================================
  // EMAIL + PASSWORD
  // =====================================================

  emailAndPassword: {

    enabled: true,

    requireEmailVerification: true,


    onExistingUserSignUp: async (
      { user },
      request
    ) => {

      await sendEmail({

        to: user.email,

        subject:
          "Sign-up attempt with your email",

        text:
          "Someone tried to create an account using your email address. If this was you, try signing in instead. If not, you can safely ignore this email.",

      });

    },


    sendResetPassword: async (
      { user, url, token },
      request
    ) => {

      await sendEmail({

        to: user.email,

        subject:
          "Reset your password",

        text:
          `Click the link to reset your password: ${url}`,

      });

    },


    onPasswordReset: async (
      { user },
      request
    ) => {

      await sendEmail({

        to: user.email,

        subject:
          "Password Reset",

        text:
          `Password for ${user.email} has been reset.`,

      });

    },

  },


  // =====================================================
  // EMAIL VERIFICATION
  // =====================================================

  emailVerification: {

    sendOnSignUp: true,


    sendVerificationEmail: async ({
      user,
      url,
    }) => {

      await sendEmail({

        to: user.email,

        subject:
          "Verify your email address",

        text:
          `Click the link to verify your email: ${url}`,

      });

    },


    sendOnSignIn: true,

  },

});