import React, { createContext, useContext, useMemo, useState } from "react";

type FeaturesContextValue = {
  swipeEnabled: boolean;
  setSwipeEnabled: (enabled: boolean) => void;
};

const FeaturesContext = createContext<FeaturesContextValue | undefined>(undefined);

export const FeaturesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [swipeEnabled, setSwipeEnabled] = useState<boolean>(true);

  const value = useMemo(
    () => ({ swipeEnabled, setSwipeEnabled }),
    [swipeEnabled]
  );

  return <FeaturesContext.Provider value={value}>{children}</FeaturesContext.Provider>;
};

export const useFeatures = (): FeaturesContextValue => {
  const ctx = useContext(FeaturesContext);
  if (!ctx) {
    throw new Error("useFeatures must be used within a FeaturesProvider");
  }
  return ctx;
};


