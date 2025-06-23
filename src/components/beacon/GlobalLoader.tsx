'use client';

import { CogIcon } from 'lucide-react';
import { useAnimationContext } from '@/contexts/AnimationContext';
import { useState, useEffect } from 'react';

interface GlobalLoaderProps {
  loadingState: 'idle' | 'loading' | 'finished';
}

export function GlobalLoader({ loadingState }: GlobalLoaderProps) {
  const { logoPosition } = useAnimationContext();
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (loadingState === 'loading') {
      setIsVisible(true);
      // Reset to center, spinning state
      setStyle({
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '6rem',
        height: '6rem',
        transform: 'translate(-50%, -50%) rotate(0deg)',
        transition: 'all 0s',
      });
    } else if (loadingState === 'finished' && logoPosition) {
      // Animate to header logo position
      setStyle({
        position: 'fixed',
        top: `${logoPosition.top}px`,
        left: `${logoPosition.left}px`,
        width: `${logoPosition.width}px`,
        height: `${logoPosition.height}px`,
        transform: 'translate(0, 0) rotate(360deg)', // End rotation
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)', // Ease-in-out
      });
      // Hide the component after animation is complete
      setTimeout(() => setIsVisible(false), 800);
    }
  }, [loadingState, logoPosition]);

  if (!isVisible) {
    return null;
  }

  const isFlying = loadingState === 'finished';

  return (
    <div
      className="fixed inset-0 z-[101] bg-background/80 backdrop-blur-sm transition-opacity duration-300"
      style={{ opacity: isFlying ? 0 : 1 }} // Fade out the backdrop as the icon flies
    >
      <div style={style}>
        <CogIcon 
          className="text-primary"
          style={{ 
            width: '100%', 
            height: '100%', 
            animation: isFlying ? 'none' : 'spin 2s linear infinite',
            transition: 'width 0.8s, height 0.8s',
          }}
        />
      </div>
    </div>
  );
}
