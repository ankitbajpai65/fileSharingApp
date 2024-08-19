"use client";
import React, { useState, createContext, useEffect } from "react";

export const AppContext = createContext({});

const BASE_URL = process.env.BASE_URL;

export default function AppContextProvider({ children }) {
  const [isUserLoggedin, setIsUserLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const values = {
    isUserLoggedin,
    setIsUserLoggedin,
    userData,
    setUserData,
    isLoading,
    setIsLoading,
  };

  const handleUserData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user/userData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      const response = await res.json();

      if (response.status === "ok") {
        setUserData(response.data);
        setIsUserLoggedin(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsUserLoggedin(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleUserData();
  }, []);

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}
