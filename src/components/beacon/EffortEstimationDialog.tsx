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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BarChart, BrainCircuit, Info } from 'lucide-react';
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BarChart className="h-6 w-6 text-primary" />
            AI Effort Estimation
          </DialogTitle>
          <DialogDescription>
            Here is the AI-generated effort estimation based on the provided parameters.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex justify-around items-center text-center p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Min Effort</p>
              <p className="text-2xl font-bold text-primary">{estimation.estimatedEffortDaysMin}</p>
              <p className="text-xs text-muted-foreground">Person-Days</p>
            </div>
            <Separator orientation="vertical" className="h-16" />
            <div>
              <p className="text-sm text-muted-foreground">Max Effort</p>
              <p className="text-2xl font-bold text-primary">{estimation.estimatedEffortDaysMax}</p>
              <p className="text-xs text-muted-foreground">Person-Days</p>
            </div>
          </div>

          {estimation.confidenceScore && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-accent" />
                    <span className="font-medium text-foreground">AI Confidence</span>
                </div>
                <Badge variant="secondary" className="text-base">{estimation.confidenceScore}%</Badge>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Info className="h-5 w-5 text-foreground" />
                Explanation
            </h4>
            <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-md border whitespace-pre-line">
              {estimation.explanation}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
