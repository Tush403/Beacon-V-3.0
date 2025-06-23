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
import { Loader2, Search as SearchIcon, AlertCircle, Sparkles } from 'lucide-react'; // Renamed Search to SearchIcon to avoid conflict
import { generateToolAnalysisAction } from '@/app/actions';
import type { ToolAnalysisItem, GenerateToolAnalysisInput } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface ToolSearchDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ToolSearchDialog({ isOpen, onOpenChange }: ToolSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ToolAnalysisItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a tool name to search.');
      setAnalysisResult(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const input: GenerateToolAnalysisInput = { toolName: searchTerm };
      const result = await generateToolAnalysisAction(input);
      setAnalysisResult(result);
    } catch (e: any) {
      const errorMessage = e.message || `Failed to get analysis for ${searchTerm}.`;
      setError(errorMessage);
      // Toast is good for transient errors, but direct display might be better for search result context
      // For now, keeping error display within the dialog.
      // toast({
      //   title: 'Search Error',
      //   description: errorMessage,
      //   variant: 'destructive',
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    onOpenChange(false);
    // Reset state when dialog is explicitly closed or onOpenChange(false) is called
    setSearchTerm('');
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };

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
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SearchIcon className="h-4 w-4" />
              )}
              <span className="sr-only">Search</span>
            </Button>
          </div>

          {isLoading && (
            <div className="text-center py-6">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Fetching AI insights for "{searchTerm}"...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-md flex items-center gap-2 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {analysisResult && !isLoading && (
            <div className="mt-6 space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                AI Analysis for: <span className="text-accent">{analysisResult.toolName || searchTerm}</span>
              </h3>
              <div>
                <h4 className="font-medium text-primary">Strengths:</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{analysisResult.strengths}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium text-destructive">Weaknesses:</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{analysisResult.weaknesses}</p>
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
