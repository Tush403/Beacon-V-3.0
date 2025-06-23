'use client';

import { cn } from "@/lib/utils";
import { CogIcon } from "lucide-react";

interface GlobalLoaderProps {
  isLoading: boolean;
}

export function GlobalLoader({ isLoading }: GlobalLoaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[101] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <CogIcon className="h-24 w-24 animate-spin text-primary" />
    </div>
  );
}
