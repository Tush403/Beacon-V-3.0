
'use client';

import Link from 'next/link';
import { AppHeader } from '@/components/beacon/AppHeader';
import React from 'react'; 
import { Separator } from '@/components/ui/separator';

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
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow flex"> {/* Added flex to allow sidebar and main content to fill height */}
        {children}
      </main>
      <footer className="p-4 text-sm text-muted-foreground border-t border-border">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-y-2">
          <p className="text-center sm:text-left">© {year} Beacon: AI Test Tool Navigator. Powered by Firebase Studio & Genkit.</p>
          <div className="flex items-center gap-x-3 sm:gap-x-4">
            <Link href="https://www.taodigitalsolutions.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Separator orientation="vertical" className="h-4 bg-border hidden sm:block" />
            <Link href="https://www.taodigitalsolutions.com/terms-conditions" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
