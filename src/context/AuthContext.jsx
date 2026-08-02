// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  googleLogin, 
  observeAuthState 
} from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = observeAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    register: registerUser,
    login: loginUser,
    logout: logoutUser,
    googleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}