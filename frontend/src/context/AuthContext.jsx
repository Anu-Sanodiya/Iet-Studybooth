 import { createContext, useState, useEffect } from "react";

import { 
  logoutUser as apiLogoutUser,
  loginAdmin as apiLoginAdmin,
  registerAdmin as apiRegisterAdmin
} from "../services/authService";

// Create context
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores logged-in user data
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token"); // Check for token too if needed logic depends on it
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage");
        localStorage.removeItem("user"); // Cleanup if corrupt
      }
    }
    setLoading(false);
  }, []);

  // Login handler (State Updater)
  const login = (data) => {
    // Backend returns { success, token, user } OR just { user, token }
    if (!data) return;
    
    // Handle nested 'user' object or flat structure
    const userData = data.user || data;
    const token = data.token;

    // Persist token (used by API request interceptor)
    if (token) {
      localStorage.setItem("token", token);
    }
    
    // Persist User
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout handler
  const logout = async () => {
    try {
      // Tell backend to clear cookie/session (best-effort)
      await apiLogoutUser();
    } catch (err) {
      // ignore network errors; proceed to clear local state anyway
      console.warn('Logout API failed:', err?.message || err);
    }

    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // --- Admin Specific Actions ---

  const adminLogin = async (formData) => {
    // 1. Call API
    const data = await apiLoginAdmin(formData);
    // 2. Update State
    login(data);
    return data;
  };

  const adminRegister = async (formData) => {
    // 1. Call API
    const data = await apiRegisterAdmin(formData);
    // Note: We usually DO NOT auto-login after admin register 
    // as it might require manual approval or email verification.
    // But if your logic allows it, you could call login(data) here.
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, adminLogin, adminRegister, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
