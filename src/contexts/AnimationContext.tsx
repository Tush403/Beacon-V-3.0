'use client';

import type { RefObject } from 'react';
import { createContext, useState, useContext } from 'react';

interface LogoPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface AnimationContextType {
  setLogoPosition: (position: LogoPosition | null) => void;
  logoPosition: LogoPosition | null;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

export const useAnimationContext = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within an AnimationProvider');
  }
  return context;
};

export const AnimationProvider = ({ children }: { children: React.ReactNode }) => {
  const [logoPosition, setLogoPosition] = useState<LogoPosition | null>(null);

  return (
    <AnimationContext.Provider value={{ logoPosition, setLogoPosition }}>
      {children}
    </AnimationContext.Provider>
  );
};
