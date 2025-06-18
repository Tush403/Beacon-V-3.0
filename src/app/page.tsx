
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CogIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CookieConsent } from '@/components/beacon/CookieConsent';
import { ReleaseNotesDialog } from '@/components/beacon/ReleaseNotesDialog';

const LandingHeader = () => (
  <header className="py-6 px-4 md:px-8">
    <div className="container mx-auto flex items-center">
      <CogIcon className="h-10 w-10 text-primary mr-3" />
      <div>
        <h1 className="text-2xl font-bold text-foreground">TAO DIGITAL</h1>
        <p className="text-sm text-muted-foreground">Transformation Made Simple</p>
      </div>
    </div>
  </header>
);

const LandingFooter = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-6 text-center">
      <p className="text-sm text-muted-foreground">© {year} TAO Digital. All rights reserved.</p>
    </footer>
  );
};

const RELEASE_NOTES_ACKNOWLEDGED_KEY = 'release_notes_acknowledged_v2.0';

export default function LandingPage() {
  const [showReleaseNotes, setShowReleaseNotes] = useState(false);
  const router = useRouter();

  const handleGetStartedClick = () => {
    if (typeof window !== 'undefined') {
      const alreadyAcknowledged = localStorage.getItem(RELEASE_NOTES_ACKNOWLEDGED_KEY);
      if (alreadyAcknowledged === 'true') {
        router.push('/navigator');
      } else {
        setShowReleaseNotes(true);
      }
    }
  };

  const handleAcknowledgeReleaseNotes = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(RELEASE_NOTES_ACKNOWLEDGED_KEY, 'true');
    }
    setShowReleaseNotes(false);
    router.push('/navigator');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Welcome to TAO's Beacon
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-10 leading-relaxed">
          Elevate your test automation strategy with TAO's Beacon. This enterprise-grade decision
          engine demystifies tool selection, providing data-driven recommendations to optimize your
          QA processes, accelerate delivery, and drive innovation at scale.
        </p>
        <Button
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-6 text-lg rounded-lg shadow-lg transform transition-transform hover:scale-105"
          onClick={handleGetStartedClick}
        >
          Get Started
        </Button>
      </main>
      <LandingFooter />
      <CookieConsent />
      <ReleaseNotesDialog
        isOpen={showReleaseNotes}
        onOpenChange={setShowReleaseNotes}
        onAcknowledge={handleAcknowledgeReleaseNotes}
      />
    </div>
  );
}
