import { createContext, useState, useEffect } from "react";
import { logoutUser as apiLogoutUser } from "../services/authService";

// Create context
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores logged-in user data
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login handler
   // Login handler
  // This function receives the data from the backend
 const login = (data) => {
   // Backend returns { success, token, user }
   if (!data) return;
   const userData = data.user || data;
   const token = data.token;

   // Persist token (used by API request interceptor) and user
   if (token) {
    localStorage.setItem("token", token);
   }
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

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
