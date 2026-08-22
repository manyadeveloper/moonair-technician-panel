"use client";

import {
  getAuthSnapshot,
  login,
  logout,
  subscribeAuth,
  updateProfile,
} from "@/lib/services/auth";
import type { AuthUser, Technician } from "@/types/technician";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (
    identifier: string,
    password: string,
    remember?: boolean
  ) => Promise<string | null>;
  signOut: () => Promise<void>;
  updateProfile: (
    data: Pick<Technician, "name" | "phone" | "email" | "address">
  ) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUser = () => {
      setUser((current) => {
        const next = getAuthSnapshot();
        return current === next ? current : next;
      });
    };

    syncUser();
    setLoading(false);

    return subscribeAuth(syncUser);
  }, []);

  const signIn = useCallback(
    async (identifier: string, password: string, remember?: boolean) => {
      const { user: nextUser, error } = await login(identifier, password, remember);
      if (error || !nextUser) return error ?? "Sign in failed.";
      setUser(nextUser);
      return null;
    },
    []
  );

  const signOut = useCallback(async () => {
    await logout();
    setUser(null);
  }, []);

  const updateProfileFn = useCallback(
    async (data: Pick<Technician, "name" | "phone" | "email" | "address">) => {
      const { user: nextUser, error } = await updateProfile(data);
      if (error || !nextUser) return error ?? "Unable to update profile.";
      setUser(nextUser);
      return null;
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        updateProfile: updateProfileFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
