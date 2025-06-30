
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
import { Rocket, Sparkles, Wrench, MessageSquare, Diamond, PackageCheck, LayoutPanelLeft, BrainCircuit } from 'lucide-react';

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
            What's New in Beacon V2.1
          </DialogTitle>
          <DialogDescription className="pt-1">
            Discover the latest enhancements designed to streamline your workflow.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow overflow-y-auto px-6 py-4">
          <div className="space-y-6">

            <section>
              <h3 className="flex items-center text-lg font-semibold text-primary mb-3">
                <Rocket className="h-5 w-5 mr-2 text-accent" />
                Introducing Your AI Assistant
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <MessageSquare className="h-4 w-4 mr-2.5 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">AI-Powered Chatbot:</span> Have a question? Get instant help from our new AI assistant. Click the chat icon to get answers about test automation tools, concepts, or how to use Beacon's features.</span>
                </li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="flex items-center text-lg font-semibold text-primary mb-3">
                <Sparkles className="h-5 w-5 mr-2 text-accent" />
                Enhanced User Experience
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <LayoutPanelLeft className="h-4 w-4 mr-2.5 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">Interactive Recommendations:</span> We've revamped the results page! Now you can easily switch between your top recommended tools with an interactive tab-based view for a more focused analysis.</span>
                </li>
                <li className="flex items-start">
                  <Wrench className="h-4 w-4 mr-2.5 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">Simplified Filtering:</span> The filter panel has been streamlined for clarity. The "Advanced Filters" section has been removed, and we've consolidated actions into a single "Get AI Recommendations" button for a more intuitive workflow.</span>
                </li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="flex items-center text-lg font-semibold text-primary mb-3">
                <BrainCircuit className="h-5 w-5 mr-2 text-accent" />
                Smarter AI Engine
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <Diamond className="h-4 w-4 mr-2.5 mt-1 shrink-0 text-primary" />
                  <span><span className="font-medium text-foreground">More Accurate AI/ML Recommendations:</span> When you select "AI/ML" as a coding requirement, Beacon now provides a highly curated and accurate list of specialized AI-powered testing tools.</span>
                </li>
              </ul>
            </section>
            
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t flex flex-col items-center gap-3">
          <p className="text-xs text-muted-foreground">Beacon V.2.1 - Powered by Firebase Studio</p>
          <div className="flex flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={onAcknowledge} className="bg-gradient-from hover:bg-gradient-from/90 text-primary-foreground">
              Acknowledge & Continue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
