// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth";
import { authService } from "../services/authService";
import {
  getAllSettings,
  upsertSetting,
  type Settings,
} from "../services/settingsService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  settings: Settings;
  login: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateSetting: (key: string, value: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>({ weight_unit: "kg" });

  const checkAuth = async () => {
    try {
      const userData = await authService.getUser();
      setUser(userData);

      // Fetch settings after user is confirmed logged in
      const settingsData = await getAllSettings();
      if (settingsData.success) {
        setSettings(settingsData.data);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      // setSettings({ weight_unit: "kg" }); // reset settings on logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Update a single setting locally and persist to backend
  const updateSetting = async (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    await upsertSetting(key, value);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        settings,
        login,
        logout,
        checkAuth,
        updateSetting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
