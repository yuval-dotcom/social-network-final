import { createContext, useContext } from "react";

const AppContext = createContext();

export function AppProvider({ copy, currentUser, children }) {
  return <AppContext.Provider value={{ copy, currentUser }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
