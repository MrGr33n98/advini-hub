// contexts/AuthContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { useAuth as useCustomAuth } from "@/hooks/useAuth";

interface AuthContextType {
  user: any;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  logout: () => void;
  register: (userData: { email: string; password: string; first_name?: string; last_name?: string }) => Promise<any>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useCustomAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}