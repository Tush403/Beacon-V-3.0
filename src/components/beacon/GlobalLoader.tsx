'use client';

import { CogIcon } from 'lucide-react';
import { useAnimationContext } from '@/contexts/AnimationContext';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GlobalLoaderProps {
  loadingState: 'idle' | 'loading' | 'finished';
}

export function GlobalLoader({ loadingState }: GlobalLoaderProps) {
  const { logoPosition } = useAnimationContext();
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [isVisible, setIsVisible] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hideBackdrop, setHideBackdrop] = useState(false);

  useEffect(() => {
    if (loadingState === 'loading' && logoPosition) {
      // --- Animation START ---
      // 1. Instantly position loader at the header logo.
      setIsVisible(true);
      setHideBackdrop(false);
      setIsSpinning(false); // Not spinning yet
      setStyle({
        position: 'fixed',
        top: `${logoPosition.top}px`,
        left: `${logoPosition.left}px`,
        width: `${logoPosition.width}px`,
        height: `${logoPosition.height}px`,
        transform: 'translate(0, 0) rotate(0deg)',
        transition: 'all 0s', // No transition for initial placement
      });

      // 2. After a tick, animate it to the center of the screen.
      const moveTimer = setTimeout(() => {
        setStyle({
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '6rem',
          height: '6rem',
          transform: 'translate(-50%, -50%) rotate(360deg)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)', // Animate the movement
        });
      }, 50);

      // 3. Once it arrives at the center, start the infinite spin.
      const spinTimer = setTimeout(() => {
        setIsSpinning(true);
      }, 850); // 800ms animation + 50ms delay

      return () => {
        clearTimeout(moveTimer);
        clearTimeout(spinTimer);
      };

    } else if (loadingState === 'finished' && logoPosition) {
      // --- Animation END ---
      // 1. Stop the infinite spin, prepare to fly back.
      setIsSpinning(false);
      setHideBackdrop(true); // Start fading out the backdrop.

      // 2. Animate back to the header logo's position.
      setStyle({
        position: 'fixed',
        top: `${logoPosition.top}px`,
        left: `${logoPosition.left}px`,
        width: `${logoPosition.width}px`,
        height: `${logoPosition.height}px`,
        transform: 'translate(0, 0) rotate(720deg)', // Continue rotation
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      });

      // 3. Hide the component after the animation is done.
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 800);

      return () => clearTimeout(hideTimer);

    } else if (loadingState === 'idle') {
      // Reset state for next time
      setIsVisible(false);
      setHideBackdrop(false);
      setIsSpinning(false);
    }
  }, [loadingState, logoPosition]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[101] bg-background/80 backdrop-blur-sm transition-opacity duration-500"
      style={{ opacity: hideBackdrop ? 0 : 1 }}
    >
      <div style={style}>
        <CogIcon
          className={cn(
            "text-primary h-full w-full",
            isSpinning && "animate-spin"
          )}
          style={{
            animationDuration: '2s', // Slower spin
          }}
        />
      </div>
    </div>
  );
}
