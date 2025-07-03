
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search as SearchIcon, AlertCircle, Sparkles } from 'lucide-react';
import { getToolDetailsAction } from '@/app/actions';
import type { GetToolDetailsOutput, GetToolDetailsInput } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface ToolSearchDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ToolSearchDialog({ isOpen, onOpenChange }: ToolSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toolDetails, setToolDetails] = useState<GetToolDetailsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a tool name to search.');
      setToolDetails(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setToolDetails(null);
    try {
      const input: GetToolDetailsInput = { toolName: searchTerm };
      const result = await getToolDetailsAction(input);
      
      if (result.toolName?.includes('(Error)')) {
          setError(result.overview);
          setToolDetails(null);
      } else {
          setToolDetails(result);
      }

    } catch (e: any) {
      const errorMessage = e.message || `Failed to get analysis for ${searchTerm}.`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    onOpenChange(false);
    // Reset state when dialog is explicitly closed or onOpenChange(false) is called
    setTimeout(() => {
      setSearchTerm('');
      setToolDetails(null);
      setError(null);
      setIsLoading(false);
    }, 300); // Delay reset to allow fade-out animation
  };

  const renderSkeleton = () => (
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

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <SearchIcon className="h-6 w-6 text-foreground" />
            Search Tool Information
          </DialogTitle>
          <DialogDescription>
            Enter the name of a test automation tool to get AI-generated insights.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter tool name (e.g., Selenium, Cypress)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !isLoading) handleSearch(); }}
              disabled={isLoading}
              aria-label="Tool name for search"
            />
            <Button onClick={handleSearch} disabled={isLoading || !searchTerm.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground px-3">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <SearchIcon className="h-4 w-4" />}
              <span className="sr-only">Search</span>
            </Button>
          </div>

          {error && !isLoading && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-md flex items-center gap-2 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {isLoading && renderSkeleton()}

          {toolDetails && !isLoading && (
            <div className="mt-6 space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Analysis for: <span className="text-accent">{toolDetails.toolName}</span>
              </h3>
              
              <div>
                <h4 className="font-medium text-primary">Overview</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{toolDetails.overview}</p>
              </div>

              <Separator/>

              <div className="space-y-4">
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
