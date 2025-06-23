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
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow">
          <div className="p-6">
            <div className="mx-auto max-w-xs space-y-6">
              <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Estimated Effort</p>
                <p className="text-3xl font-bold text-primary">{estimation.estimatedEffortDays}</p>
                <p className="text-xs text-muted-foreground">Days</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Info className="h-5 w-5 text-foreground" />
                    Explanation
                </h4>
                <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
                  <p className="whitespace-pre-line">
                    {estimation.explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="p-6 pt-4 border-t bg-background">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
