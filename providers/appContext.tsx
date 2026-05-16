// main/components/context/AppContext.tsx
"use client";
import React, { createContext, useContext } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => (
  <AppContext.Provider value={null}>{children}</AppContext.Provider>
);

export const useAppContext = () => {
  const url = useContext(AppContext);
  if (!url) throw new Error("useAppContext must be used inside ApiUrlProvider");
  return url;
};
