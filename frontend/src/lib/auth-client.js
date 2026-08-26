import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: "https://ims-backend-psi.vercel.app",
});