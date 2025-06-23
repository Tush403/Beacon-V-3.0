'use client';

import { cn } from "@/lib/utils";

interface GlobalLoaderProps {
  isLoading: boolean;
}

export function GlobalLoader({ isLoading }: GlobalLoaderProps) {
  const cubeFaceClasses = "absolute h-full w-full rounded-md border-2 border-primary bg-primary/20";
  const cubeSize = 32; // Corresponds to half the container's h-16/w-16 (64px / 2 = 32px)

  return (
    <div
      className={cn(
        "fixed inset-0 z-[101] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300 [perspective:800px]",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="relative h-16 w-16 transform-style-3d animate-cube-spin">
        {/* Front */}
        <div className={cn(cubeFaceClasses, `[transform:rotateY(0deg)_translateZ(${cubeSize}px)]`)}></div>
        {/* Right */}
        <div className={cn(cubeFaceClasses, `[transform:rotateY(90deg)_translateZ(${cubeSize}px)]`)}></div>
        {/* Back */}
        <div className={cn(cubeFaceClasses, `[transform:rotateY(180deg)_translateZ(${cubeSize}px)]`)}></div>
        {/* Left */}
        <div className={cn(cubeFaceClasses, `[transform:rotateY(-90deg)_translateZ(${cubeSize}px)]`)}></div>
        {/* Top */}
        <div className={cn(cubeFaceClasses, `[transform:rotateX(90deg)_translateZ(${cubeSize}px)]`)}></div>
        {/* Bottom */}
        <div className={cn(cubeFaceClasses, `[transform:rotateX(-90deg)_translateZ(${cubeSize}px)]`)}></div>
      </div>
    </div>
  );
}
