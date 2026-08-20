import { authClient } from "@/lib/auth-client";
import React, { createContext } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user || null;
  const role = user?.role || null;

  const logout = async () => {
    await authClient.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        session,
        logout,
        isLoading: isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;