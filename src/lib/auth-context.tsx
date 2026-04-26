import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "just-smile-session-token";
const PASSWORD_STORAGE_KEY = "user_password";
const DEFAULT_PASSWORD = "admin123";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state on mount - check SessionStorage only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionToken = sessionStorage.getItem(SESSION_KEY);
      setIsAuthenticated(sessionToken === "authenticated");
    }
    setIsInitialized(true);
  }, []);

  const login = (email: string, password: string) => {
    // Get password from localStorage or use default
    const storedPassword = typeof window !== "undefined" 
      ? localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_PASSWORD
      : DEFAULT_PASSWORD;

    // Demo credentials - will be replaced by Supabase Auth
    if (email === "dr.souidi@justsmile.dz" && password === storedPassword) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_KEY, "authenticated");
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
