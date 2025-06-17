
'use client';

import { useState, useEffect } from 'react';
import { CogIcon, Mail, Moon, Search, Library, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  const [theme, setTheme] = useState('light'); // Default to light

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
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

  return (
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
            <Button variant="ghost" size="icon" aria-label="Documentation">
              <Library className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
