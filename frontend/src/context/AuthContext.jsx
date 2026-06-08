
// Any component can call useAuth() to get the current user.

import { createContext, useContext, useState, useEffect } from "react";
import { getMe, logoutUser } from "../services/auth.service.js";

// 1. Create the context object
const AuthContext = createContext(null);

// 2. Provider component — wraps the whole app and provides the auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Current logged-in user
  const [loading, setLoading] = useState(true);  // Is auth check still running?

  // When the app first loads, check if user is already logged in
  // by hitting /api/auth/me (which reads the cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await getMe();
        setUser(data.user);
      } catch {
        setUser(null); // Not logged in
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Logout function — clears the cookie on the backend, resets state
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    }
    setUser(null);
  };

  return (
    // 3. Pass user, setUser, logout, loading to all child components
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom hook — makes it easy to use auth in any component
//    Usage: const { user, logout } = useAuth();
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
