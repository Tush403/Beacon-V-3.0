
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
import { ScrollArea } from '@/components/ui/scroll-area';

interface ToolDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  toolName: string | null;
}

const DetailsSkeleton = () => (
  <div className="space-y-4 pt-4 animate-pulse">
    <Skeleton className="h-6 w-1/2 mb-2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Separator className="my-4" />
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Sparkles className="h-6 w-6 text-accent" />
            Tool Deep Dive
          </DialogTitle>
          <DialogDescription>
            AI-generated analysis for {toolName || 'the selected tool'}.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow overflow-y-auto px-6 py-4">
            {error && !isLoading && (
              <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md flex items-center gap-2 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {isLoading && <DetailsSkeleton />}

            {toolDetails && !isLoading && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                    {toolDetails.toolName}
                </h3>
                <p className="text-sm text-muted-foreground">{toolDetails.overview}</p>
                
                <Separator className="my-4"/>

                <div 
                  className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed"
                >
                  {toolDetails.detailedAnalysis}
                </div>
              </div>
            )}
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t">
          <Button variant="outline" onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
