'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Calculator } from 'lucide-react';
import type { EstimateEffortOutput } from '@/types';

interface EffortEstimationResultCardProps {
  estimationResult: EstimateEffortOutput;
  onClose: () => void;
}

export function EffortEstimationResultCard({ estimationResult, onClose }: EffortEstimationResultCardProps) {
  return (
    <Card className="shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl font-headline text-foreground">
            <Calculator className="h-6 w-6 text-foreground" />
            AI Effort Estimation Result
          </CardTitle>
          <CardDescription>
            Confidence Score: <span className="font-semibold text-foreground">{estimationResult.confidenceScore}%</span>
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close Estimation</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Estimated Effort</p>
          <p className="text-4xl font-bold text-primary">{estimationResult.estimatedEffortDays}</p>
          <p className="text-sm text-muted-foreground">Days</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-base">Explanation</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line border bg-muted/20 p-3 rounded-md">
            {estimationResult.explanation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
