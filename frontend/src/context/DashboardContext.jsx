import { createContext, useContext } from "react";
import useDashboard from "@/hooks/useDashboard";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const dashboardState = useDashboard();

  return (
    <DashboardContext.Provider value={dashboardState}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboardContext must be used inside DashboardProvider"
    );
  }

  return context;
}