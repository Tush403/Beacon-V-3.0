
'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import type { EstimateEffortOutput } from '@/types';

interface EffortEstimationResultCardProps {
  estimationResult: EstimateEffortOutput | null;
  onClose: () => void;
}

export function EffortEstimationResultCard({ estimationResult, onClose }: EffortEstimationResultCardProps) {
  if (!estimationResult) {
    return null;
  }

  return (
    <Dialog open={!!estimationResult} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-headline text-foreground">
            <Calculator className="h-6 w-6 text-foreground" />
            AI Effort Estimation Result
          </DialogTitle>
          <DialogDescription>
            A "Person-Day" is the amount of work one person can do in a single day.
            Your confidence score in this estimate is <span className="font-semibold text-foreground">{estimationResult.confidenceScore}%</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex flex-col items-center justify-center text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-foreground">Estimated Project Effort</p>
            <p className="text-5xl font-bold text-primary my-1">{estimationResult.estimatedEffortDays}</p>
            <p className="text-sm text-muted-foreground">Person-Days</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-base">Explanation</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line border bg-muted/20 p-3 rounded-md">
              {estimationResult.explanation}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
