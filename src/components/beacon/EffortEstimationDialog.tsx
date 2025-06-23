'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Info } from 'lucide-react';
import type { EstimateEffortOutput } from '@/types';

interface EffortEstimationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  estimation: EstimateEffortOutput | null;
}

export function EffortEstimationDialog({ isOpen, onOpenChange, estimation }: EffortEstimationDialogProps) {
  if (!estimation) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BarChart className="h-6 w-6 text-primary" />
            AI Effort Estimation
          </DialogTitle>
          <DialogDescription>
            Here is the AI-generated effort estimation based on the provided parameters.
            {estimation.confidenceScore && ` (Confidence: ${estimation.confidenceScore}%)`}
          </DialogDescription>
        </DialogHeader>
        
        {/* Main content area, flex-1 allows it to grow and fill space, min-h-0 prevents it from overflowing its container */}
        <div className="flex-1 p-6 flex flex-col space-y-4 min-h-0">
            
            {/* Effort block - does not grow */}
            <div className="flex flex-col items-center text-center p-2 bg-muted/50 rounded-lg shrink-0">
              <p className="text-xs text-muted-foreground">Estimated Effort</p>
              <p className="text-2xl font-bold text-primary">{estimation.estimatedEffortDays}</p>
              <p className="text-xs text-muted-foreground">Days</p>
            </div>

            {/* Explanation block - this whole block will grow */}
            <div className="flex-1 flex flex-col space-y-2 min-h-0">
              <h4 className="font-semibold text-foreground flex items-center gap-2 shrink-0">
                  <Info className="h-5 w-5 text-foreground" />
                  Explanation
              </h4>
              
              {/* This container takes up the remaining space and acts as a positioning parent for the scroll area */}
              <div className="flex-1 relative">
                <ScrollArea className="absolute inset-0 rounded-md border bg-muted/20 p-3">
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {estimation.explanation}
                  </p>
                </ScrollArea>
              </div>
            </div>
        </div>
        
        <DialogFooter className="p-6 pt-4 border-t bg-background">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
