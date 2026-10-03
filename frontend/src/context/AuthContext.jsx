import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";


export const AuthContext = createContext();

export function AuthProvider({ children }) {


  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    //  console.log("Fetching current user...");

    try {

      const response = await getCurrentUser();

       console.log(response.data);

      setUser(response.data.data.user);

    } catch (error) {

      setUser(null);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
  const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",

  ];

  if (authRoutes.includes(window.location.pathname)) {
    setLoading(false);
    return;
  }

  fetchCurrentUser();
}, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}