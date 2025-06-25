
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Rocket, Sparkles, Wrench, AlertTriangle, Diamond, PackageCheck, Smartphone, Search, FileDown } from 'lucide-react';

interface ReleaseNotesDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAcknowledge: () => void;
}

export function ReleaseNotesDialog({ isOpen, onOpenChange, onAcknowledge }: ReleaseNotesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center text-2xl">
            <PackageCheck className="h-7 w-7 mr-3 text-primary" />
            Beacon - Release Notes (V.2.0)
          </DialogTitle>
          <DialogDescription className="pt-1">
            Welcome! Please review the latest updates before proceeding.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            <section>
              <h3 className="flex items-center text-lg font-semibold text-primary mb-2">
                <Rocket className="h-5 w-5 mr-2 text-accent" />
                Major Platform Upgrade!
              </h3>
              <p className="text-sm text-muted-foreground">
                Beacon has leveled up! We're thrilled to announce our migration from Microsoft Power Apps to the cutting-edge Google Firebase Studio.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This strategic move empowers us with enhanced performance, greater scalability, and a modern development environment, allowing us to bring you innovative features faster than ever. Expect a smoother, more responsive experience as you navigate Beacon.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="flex items-center text-lg font-semibold text-primary mb-3">
                <Sparkles className="h-5 w-5 mr-2 text-accent" />
                What's New & Enhanced?
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <Diamond className="h-4 w-4 mr-2.5 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">Official TAO Branding:</span> The application now proudly features the official TAO Digital logo for a consistent and professional brand experience.</span>
                </li>
                <li className="flex items-start">
                  <Smartphone className="h-4 w-4 mr-2.5 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">Full Mobile Responsiveness:</span> Navigate the entire application seamlessly on your mobile device, with a fully functional slide-out sidebar menu.</span>
                </li>
                <li className="flex items-start">
                  <Search className="h-4 w-4 mr-2.5 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">Enhanced Tool Search:</span> Get deeper insights with our supercharged tool search, which now provides a detailed, structured profile for any tool, complete with a smooth skeleton loading state.</span>
                </li>
                 <li className="flex items-start">
                  <FileDown className="h-4 w-4 mr-2.5 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">Export to CSV:</span> You can now export the detailed tool comparison table to a CSV file, making it easy to share your findings and integrate them into reports.</span>
                </li>
                 <li className="flex items-start">
                  <Diamond className="h-4 w-4 mr-2.5 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">Official Tool Links:</span> All recommended tools now link directly to their official websites, providing quick access to authoritative information.</span>
                </li>
                 <li className="flex items-start">
                  <Diamond className="h-4 w-4 mr-2.5 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">Professional Notifications:</span> Filter reset notifications are now more polished, featuring a new "success" style, a more compact size, and a subtle dissolve animation.</span>
                </li>
              </ul>
            </section>
            
            <Separator />

            <section>
              <h3 className="flex items-center text-lg font-semibold text-primary mb-3">
                <Wrench className="h-5 w-5 mr-2 text-accent" />
                Refinements & Fixes
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside pl-2">
                <li><span className="font-medium text-foreground">Scrolling Behavior:</span> Fixed an issue where scrolling with a mouse wheel over number inputs would accidentally change their values.</li>
                <li><span className="font-medium text-foreground">Layout & Display:</span> Resolved layout issues, including making the main header full-width and fixing an overlapping scrollbar in the advanced filters section.</li>
                <li><span className="font-medium text-foreground">Core Stability:</span> Squashed critical React bugs, including hydration errors and incorrect hook rendering, for a more stable and reliable experience.</li>
                <li><span className="font-medium text-foreground">Accessibility:</span> Improved accessibility by adding the required titles to dialogs, ensuring a better experience for screen reader users.</li>
              </ul>
            </section>
            
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t flex flex-col items-center gap-3">
          <p className="text-xs text-muted-foreground">Beacon V.2.0 - Powered by Firebase Studio</p>
          <div className="flex flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={onAcknowledge} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Acknowledge & Continue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
