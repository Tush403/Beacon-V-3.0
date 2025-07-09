
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; // Import Link
import { CogIcon, Mail, Moon, Search, Library, Sun, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReleaseNotesDialog } from '@/components/beacon/ReleaseNotesDialog';
import { ToolSearchDialog } from '@/components/beacon/ToolSearchDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAnimationContext } from '@/contexts/AnimationContext';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';

const RELEASE_NOTES_ACKNOWLEDGED_KEY = 'release_notes_acknowledged_v3.0';

export function AppHeader() {
  const { isMobile, state } = useSidebar();
  const [theme, setTheme] = useState('light');
  const [showReleaseNotesDialog, setShowReleaseNotesDialog] = useState(false);
  const [isSearchDialogOpen, setSearchDialogOpen] = useState(false);
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);
  const logoRef = useRef<SVGSVGElement>(null);
  const { setLogoPosition } = useAnimationContext();

  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }

    // Release notes indicator initialization
    if (typeof window !== 'undefined') {
      const acknowledged = localStorage.getItem(RELEASE_NOTES_ACKNOWLEDGED_KEY);
      if (acknowledged !== 'true') {
        setShowUpdateIndicator(true);
      }
    }
  }, []);

  useEffect(() => {
    // This effect updates the logo's position in the context whenever the window is resized.
    const updatePosition = () => {
      if (logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect();
        setLogoPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    // Also update on scroll, as sticky header might change position relative to viewport
    document.addEventListener('scroll', updatePosition); 
    
    return () => {
        window.removeEventListener('resize', updatePosition);
        document.removeEventListener('scroll', updatePosition);
    }
  }, [setLogoPosition]);

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

  const handleDocButtonClick = () => {
    setShowReleaseNotesDialog(true);
  };

  const handleAcknowledgeReleaseNotes = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(RELEASE_NOTES_ACKNOWLEDGED_KEY, 'true');
      setShowUpdateIndicator(false); // Hide indicator once acknowledged
    }
    setShowReleaseNotesDialog(false);
  };

  return (
    <>
      <TooltipProvider delayDuration={100}>
        <header className="bg-gradient-to-r from-gradient-from to-gradient-to text-primary-foreground shadow-lg sticky top-0 z-40">
          <div className="py-3 px-4 md:px-8 flex items-center">
            {/* Left Side: TAO Digital Branding */}
            <div className="flex items-center gap-3">
              {isMobile && <SidebarTrigger className="md:hidden" />}
              <CogIcon ref={logoRef} className="h-9 w-9" />
              <div>
                <h1 className="text-lg font-bold sm:text-xl">TAO DIGITAL</h1>
                <p className="text-xs text-primary-foreground/80 hidden sm:block">Transformation Made Simple</p>
              </div>
            </div>

            {/* Right Side: Beacon Branding & Icons */}
            <div className="flex items-center gap-3 sm:gap-4 ml-auto">
              {!isMobile && state === 'collapsed' && (
                <SidebarTrigger asChild>
                  <Button variant="ghost" className="hover:bg-primary-foreground/10">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </Button>
                </SidebarTrigger>
              )}
              <h2 className="text-lg md:text-xl font-headline font-semibold">
                Beacon
              </h2>
              <div className="flex items-center gap-1 sm:gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Contact Us" asChild className="hover:bg-primary-foreground/10">
                      <Link href="https://www.taodigitalsolutions.com/contact-us-lead-generation-form" target="_blank" rel="noopener noreferrer">
                        <Mail className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Contact Us</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Toggle Theme" onClick={toggleTheme} className="hover:bg-primary-foreground/10">
                      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle Theme</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Search Tool Information" onClick={() => setSearchDialogOpen(true)} className="hover:bg-primary-foreground/10">
                      <Search className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search Tool Information</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Button variant="ghost" size="icon" aria-label="View Release Notes" onClick={handleDocButtonClick} className="hover:bg-primary-foreground/10">
                        <Library className="h-5 w-5" />
                      </Button>
                      {showUpdateIndicator && (
                        <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background pointer-events-none" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Release Notes</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </header>
      </TooltipProvider>
      <ReleaseNotesDialog
        isOpen={showReleaseNotesDialog}
        onOpenChange={setShowReleaseNotesDialog}
        onAcknowledge={handleAcknowledgeReleaseNotes}
      />
      <ToolSearchDialog
        isOpen={isSearchDialogOpen}
        onOpenChange={setSearchDialogOpen}
      />
    </>
  );
}
