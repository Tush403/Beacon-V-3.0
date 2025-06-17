'use client';

import type { Metadata } from 'next';
import { AppHeader } from '@/components/beacon/AppHeader';
// Toaster is in RootLayout, no need to import here unless it's scoped
import React from 'react'; // Ensure React is imported

// Removed metadata export as it's not allowed in client components

export default function NavigatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // useState and useEffect for year calculation
  const [year, setYear] = React.useState(new Date().getFullYear());
  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {children}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border mt-auto">
        © {year} Beacon: AI Test Tool Navigator. Powered by Firebase Studio & Genkit.
      </footer>
    </div>
  );
}
