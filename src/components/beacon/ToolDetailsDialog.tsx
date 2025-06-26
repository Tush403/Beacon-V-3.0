
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { getToolDetailsAction } from '@/app/actions';
import type { GetToolDetailsOutput, GetToolDetailsInput } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface ToolDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  toolName: string | null;
}

const DetailsSkeleton = () => (
  <div className="mt-6 space-y-4 pt-4 border-t animate-pulse">
      <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-48" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Separator/>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i}>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
  </div>
);

export function ToolDetailsDialog({ isOpen, onOpenChange, toolName }: ToolDetailsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [toolDetails, setToolDetails] = useState<GetToolDetailsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!toolName) return;

      setIsLoading(true);
      setError(null);
      setToolDetails(null);
      try {
        const input: GetToolDetailsInput = { toolName };
        const result = await getToolDetailsAction(input);
        
        if (result.toolName?.includes('(Error)')) {
            setError(result.overview);
            setToolDetails(null);
        } else {
            setToolDetails(result);
        }
      } catch (e: any) {
        const errorMessage = e.message || `Failed to get details for ${toolName}.`;
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && toolName) {
      fetchDetails();
    }
  }, [isOpen, toolName]);

  const handleCloseDialog = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Sparkles className="h-6 w-6 text-accent" />
            Tool Details
          </DialogTitle>
          <DialogDescription>
            AI-generated insights for {toolName || 'the selected tool'}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {error && !isLoading && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-md flex items-center gap-2 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {isLoading && <DetailsSkeleton />}

          {toolDetails && !isLoading && (
            <div className="mt-6 space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                Analysis for: <span className="text-accent">{toolDetails.toolName}</span>
              </h3>
              
              <div>
                <h4 className="font-medium text-primary">Overview</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{toolDetails.overview}</p>
              </div>

              <Separator/>

              <div className="space-y-3">
                {toolDetails.details.map(detail => (
                    <div key={detail.criterionName}>
                        <h4 className="font-medium text-foreground text-sm">{detail.criterionName}</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{detail.value}</p>
                    </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
