import { toNodeHandler } from "better-auth/node";
import { auth } from "../../utils/auth.js";


export const authRoute = toNodeHandler(auth);


