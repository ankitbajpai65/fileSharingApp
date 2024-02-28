"use client"
import React, { useState, createContext } from "react";

export const AppContext = createContext({})

export default function AppContextProvider({ children }) {
    const [isUserLoggedin, setIsUserLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const values = { isUserLoggedin, setIsUserLoggedin, userData, setUserData, isLoading, setIsLoading }

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}