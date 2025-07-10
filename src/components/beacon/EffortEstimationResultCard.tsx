
'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import type { EstimateEffortOutput } from '@/types';
import { useMemo } from 'react';

interface EffortEstimationResultCardProps {
  estimationData: { result: EstimateEffortOutput; qaTeamSize: number; } | null;
  onClose: () => void;
}

export function EffortEstimationResultCard({ estimationData, onClose }: EffortEstimationResultCardProps) {
  const calculatedDays = useMemo(() => {
    if (!estimationData) return 0;
    const { result, qaTeamSize } = estimationData;
    // Handle division by zero or invalid qaTeamSize
    if (qaTeamSize > 0) {
      return (result.estimatedEffortDays / qaTeamSize).toFixed(1);
    }
    // If team size is 0 or not provided, return the raw person-days as the duration for a single person.
    return result.estimatedEffortDays.toFixed(1);
  }, [estimationData]);

  if (!estimationData) {
    return null;
  }
  
  const { result, qaTeamSize } = estimationData;
  const teamSizeForDisplay = qaTeamSize > 0 ? qaTeamSize : 1;

  return (
    <Dialog open={!!estimationData} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-headline text-foreground">
            <Calculator className="h-6 w-6 text-foreground" />
            AI Effort Estimation
          </DialogTitle>
          <DialogDescription>
            This AI-powered estimate is based on the project details you provided. Your confidence score is <span className="font-semibold text-foreground">{result.confidenceScore}%</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex flex-col items-center justify-center text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-foreground">Estimated Project Duration</p>
            <p className="text-5xl font-bold text-primary my-1">{calculatedDays}</p>
            <p className="text-sm text-muted-foreground">
              Days (based on a team of {teamSizeForDisplay} {teamSizeForDisplay === 1 ? 'engineer' : 'engineers'})
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-base">Explanation</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line border bg-muted/20 p-3 rounded-md">
              {result.explanation}
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
