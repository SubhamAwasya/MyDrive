import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/AxiosApi";

// Create context
const UserContext = createContext();

// Hook for consuming context
export const useUser = () => useContext(UserContext);

// Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => logout()); // token expired or invalid
    }
  }, []);

  const login = (userData, token) => {
    setUser({ ...userData, token });
    localStorage.setItem("user", JSON.stringify({ ...userData, token }));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
