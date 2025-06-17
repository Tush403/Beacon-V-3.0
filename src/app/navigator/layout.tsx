'use client';

import type { Metadata } from 'next'; // Metadata can't be used in client component
import { AppHeader } from '@/components/beacon/AppHeader';
import React from 'react'; 
import { SidebarProvider } from '@/components/ui/sidebar'; // Import SidebarProvider

// Removed metadata export as it's not allowed in client components

export default function NavigatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [year, setYear] = React.useState(new Date().getFullYear());
  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  
  return (
    // SidebarProvider can wrap the layout if sidebar state needs to be shared more broadly or affect header
    // For now, keeping SidebarProvider in page.tsx is fine if sidebar is self-contained there.
    // If SidebarTrigger were in AppHeader, then SidebarProvider would need to be here.
    // Since Sidebar is self-contained in navigator/page.tsx for now, no need for provider here.
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow flex"> {/* Added flex to allow sidebar and main content to fill height */}
        {children}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {year} Beacon: AI Test Tool Navigator. Powered by Firebase Studio & Genkit.
      </footer>
    </div>
  );
}
