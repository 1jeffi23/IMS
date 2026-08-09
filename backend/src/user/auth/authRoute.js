import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";

export const authRoute = toNodeHandler(auth);