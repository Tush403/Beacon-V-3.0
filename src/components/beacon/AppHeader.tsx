
'use client';

import { useState, useEffect } from 'react';
import { CogIcon, Mail, Moon, Search, Library, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReleaseNotesDialog } from '@/components/beacon/ReleaseNotesDialog'; 

// Key for the main release notes acknowledgment, consistent with src/app/page.tsx
const RELEASE_NOTES_ACKNOWLEDGED_KEY = 'release_notes_acknowledged_v2.0';

export function AppHeader() {
  const [theme, setTheme] = useState('light'); // Default to light
  const [showReleaseNotesDialog, setShowReleaseNotesDialog] = useState(false);

  useEffect(() => {
    // Client-side only effect for theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    // Client-side only effect for applying theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleDocButtonClick = () => {
    // Always show the ReleaseNotesDialog when the documentation button is clicked
    setShowReleaseNotesDialog(true);
  };

  const handleAcknowledgeReleaseNotes = () => {
    // This function is called when "Acknowledge & Continue" is clicked in the ReleaseNotesDialog
    if (typeof window !== 'undefined') {
      localStorage.setItem(RELEASE_NOTES_ACKNOWLEDGED_KEY, 'true');
    }
    setShowReleaseNotesDialog(false);
    // No longer opens an external document link
  };

  return (
    <>
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="container mx-auto py-3 px-4 md:px-8 flex items-center justify-between">
          {/* Left Side: TAO Digital Branding */}
          <div className="flex items-center gap-3">
            <CogIcon className="h-9 w-9 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-foreground sm:text-xl">TAO DIGITAL</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Transformation Made Simple</p>
            </div>
          </div>

          {/* Right Side: Beacon Branding & Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <h2 className="text-xl sm:text-2xl font-headline font-semibold text-primary hidden md:block">
              Beacon
            </h2>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="icon" aria-label="Mail">
                <Mail className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Toggle Theme" onClick={toggleTheme}>
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Documentation" onClick={handleDocButtonClick}>
                <Library className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <ReleaseNotesDialog
        isOpen={showReleaseNotesDialog}
        onOpenChange={setShowReleaseNotesDialog}
        onAcknowledge={handleAcknowledgeReleaseNotes} // Use the updated handler
      />
    </>
  );
}
