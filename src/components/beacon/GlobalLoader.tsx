'use client';

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface GlobalLoaderProps {
  isLoading: boolean;
}

export function GlobalLoader({ isLoading }: GlobalLoaderProps) {
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[101] h-1 transition-opacity duration-300", // High z-index
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <Progress value={100} className="w-full h-full animate-pulse rounded-none bg-primary/30 [&>div]:bg-primary" />
    </div>
  );
}
