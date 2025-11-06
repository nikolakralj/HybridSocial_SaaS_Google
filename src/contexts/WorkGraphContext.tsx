import { createContext, useContext, useState, ReactNode } from "react";
import { Context, ContextType } from "../types";

interface WorkGraphContextType {
  currentContext: Context;
  availableContexts: Context[];
  switchContext: (contextId: string) => void;
}

const WorkGraphContext = createContext<WorkGraphContextType | undefined>(undefined);

export function WorkGraphProvider({ children }: { children: ReactNode }) {
  // Mock contexts for demo - in production, these would come from auth/database
  const mockContexts: Context[] = [
    {
      id: "personal-1",
      type: "personal",
      name: "John Doe",
      role: undefined,
    },
    {
      id: "company-1",
      type: "company",
      name: "TechVentures Inc.",
      role: "owner",
    },
    {
      id: "agency-1",
      type: "agency",
      name: "Elite Tech Recruiters",
      role: "admin",
    },
  ];

  const [currentContext, setCurrentContext] = useState<Context>(mockContexts[0]);
  const [availableContexts] = useState<Context[]>(mockContexts);

  const switchContext = (contextId: string) => {
    const newContext = availableContexts.find((c) => c.id === contextId);
    if (newContext) {
      setCurrentContext(newContext);
    }
  };

  return (
    <WorkGraphContext.Provider
      value={{ currentContext, availableContexts, switchContext }}
    >
      {children}
    </WorkGraphContext.Provider>
  );
}

export function useWorkGraph() {
  const context = useContext(WorkGraphContext);
  if (!context) {
    throw new Error("useWorkGraph must be used within WorkGraphProvider");
  }
  return context;
}
