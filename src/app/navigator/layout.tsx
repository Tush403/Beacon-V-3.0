
'use client';

import Link from 'next/link';
import { AppHeader } from '@/components/beacon/AppHeader';
import React from 'react'; 
import { Separator } from '@/components/ui/separator';
import { AnimationProvider } from '@/contexts/AnimationContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Chatbot } from '@/components/beacon/Chatbot';

export default function NavigatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AnimationProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full flex-col min-h-screen bg-background">
          <AppHeader />
          <main className="flex-grow flex min-h-0"> {/* Added flex to allow sidebar and main content to fill height */}
            {children}
          </main>
          {/* Footer has been moved to navigator/page.tsx to be within SidebarInset */}
          <Chatbot />
        </div>
      </SidebarProvider>
    </AnimationProvider>
  );
}
