
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
import { Rocket, Sparkles, Wrench, AlertTriangle, Diamond, ChevronRight, PackageCheck } from 'lucide-react';

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
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <Diamond className="h-4 w-4 mr-2 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">Dive Deeper, Faster:</span> Our revamped Tool Comparison UI lets you analyze features side-by-side with unparalleled clarity, helping you make data-driven decisions in record time.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-4 w-4 mr-2 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">Find Your Perfect Match Instantly:</span> Experience lightning-fast and laser-accurate results with our upgraded Smart Search. No more endless scrolling – get to the right tools, right away!</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-4 w-4 mr-2 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">Smarter Estimations, Real-World Accuracy:</span> Our AI Effort Estimator now incorporates your chosen 'Automation Tool Name' and is calibrated with real-world project data, delivering more precise and actionable effort projections for better project planning.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-4 w-4 mr-2 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">Maximize Your Returns:</span> The ROI Comparison Table now offers a crystal-clear view of potential gains, with improved data organization to clearly illustrate the value each tool brings to your bottom line.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-4 w-4 mr-2 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">Seamless Navigation:</span> Effortlessly glide back to the top of any page with our new 'Back to Top' button – because your time is valuable.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-4 w-4 mr-2 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">Intuitive Actions at Your Fingertips:</span> Discover functionality faster with new tooltips on our floating action buttons. Clarity and convenience, combined for a smoother workflow.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-4 w-4 mr-2 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">Export to PDF:</span> (Coming Soon) Get ready to share your findings easily!</span>
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
                <li>Smoother Filtering: Resolved an issue where the coding language dropdown would sometimes disappear when 'AI/ML' was selected, ensuring a seamless filtering experience.</li>
                <li>Cleaner Data Entry: The AI Effort Estimator now handles numeric inputs more gracefully, preventing leading zeros and allowing empty fields for quicker and cleaner data entry.</li>
                <li>Behind-the-Scenes Polish: We've squashed minor bugs and optimized internal data handling (like `comparisonParametersData`) for a more robust and reliable experience.</li>
                <li>Resolved incorrect tool values in dropdowns.</li>
                <li>Improved visibility & styling of disabled fields for better clarity.</li>
                <li>Optimized performance for faster search results, getting you to insights quicker.</li>
              </ul>
            </section>

            <Separator />
            
            <section>
              <h3 className="flex items-center text-lg font-semibold text-primary mb-3">
                <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                Important Notes
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside pl-2">
                <li>Our migration to Firebase Studio means you can look forward to more frequent updates and exciting new features. Stay tuned!</li>
                <li>The "Export to PDF" feature is under active development and will be rolled out soon.</li>
                <li>We value your feedback! Use the contact options to share your thoughts and help us make Beacon even better.</li>
              </ul>
            </section>
            
            <div className="mt-4 text-xs text-muted-foreground flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-500" />
                Beacon V.2.0 - Powered by Firebase Studio
            </div>

          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={onAcknowledge} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Acknowledge & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
