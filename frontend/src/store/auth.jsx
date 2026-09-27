/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import { apiRequest, toList } from "../utils/api-client";

export const AuthContext = createContext();

// Read token from browser storage.
const getStoredToken = () => localStorage.getItem("token");

// Create bearer token for protected APIs.
const getAuthorizationToken = (token) => (token ? `Bearer ${token}` : "");

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken());
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(getStoredToken()));
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);

  const isLoggedIn = Boolean(token);
  const authorizationToken = getAuthorizationToken(token);

  // Save login token and optional user data.
  const storeTokenInLS = (serverToken, loggedInUser = null) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);

    if (loggedInUser) {
      setUser(loggedInUser);
    }
  };

  // Clear user session from state and browser storage.
  const LogoutUser = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  // Load services for public/service pages.
  const loadServices = async () => {
    try {
      const result = await apiRequest(API_ENDPOINTS.services, { method: "GET" });

      if (result.ok) {
        setServices(toList(result.data));
      }
    } catch (error) {
      console.log(`services frontend error: ${error}`);
    }
  };

  // Load logged-in user from token.
  const loadCurrentUser = async () => {
    if (!token) {
      setUser(null);
      setIsAuthLoading(false);
      return;
    }

    setIsAuthLoading(true);

    try {
      const result = await apiRequest(API_ENDPOINTS.currentUser, {
        method: "GET",
        token: authorizationToken,
      });

      if (result.ok) {
        setUser(result.data.userData);
        return;
      }

      setUser(null);
      setToken("");
      localStorage.removeItem("token");
    } catch (error) {
      console.error("error fetching user data", error);
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Fetch services once when app starts.
  useEffect(() => {
    loadServices();
  }, []);

  // Verify token whenever token changes.
  useEffect(() => {
    loadCurrentUser();
  }, [authorizationToken, token]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLS,
        LogoutUser,
        user,
        services,
        authorizationToken,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);

  if (!authContextValue) {
    throw new Error("useAuth used outside of the provider");
  }

  return authContextValue;
};
