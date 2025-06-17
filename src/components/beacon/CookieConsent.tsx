
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'cookie_consent_preference';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentPreference = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consentPreference) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (preference: 'accepted' | 'rejected') => {
    localStorage.setItem(COOKIE_CONSENT_KEY, preference);
    setIsVisible(false);
    // Here you would typically initialize analytics or other services based on consent
    if (preference === 'accepted') {
      console.log('Cookies accepted by user.');
    } else {
      console.log('Cookies rejected by user.');
    }
  };

  const handleManageSettings = () => {
    // Placeholder for manage settings functionality
    console.log('Manage cookie settings clicked.');
    // Potentially open a dialog or navigate to a settings page
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <Card className="max-w-2xl mx-auto shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-6 w-6 text-primary" />
            Cookie Consent
          </CardTitle>
          <CardDescription>
            We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. With your consent, you're helping us to make our documentation better.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button 
            onClick={() => handleConsent('accepted')} 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Accept
          </Button>
          <Button 
            onClick={() => handleConsent('rejected')} 
            variant="secondary" 
            className="w-full sm:w-auto"
          >
            Reject
          </Button>
          <Button 
            onClick={handleManageSettings} 
            variant="outline" 
            className="w-full sm:w-auto"
          >
            Manage settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
