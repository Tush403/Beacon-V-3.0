'use client';

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/beacon/AppHeader';
import { FilterForm } from '@/components/beacon/FilterForm';
import { RecommendationsDisplay } from '@/components/beacon/RecommendationsDisplay';
import { ROIChart } from '@/components/beacon/ROIChart';
import { TrendAnalysisCard } from '@/components/beacon/TrendAnalysisCard';
import { recommendToolsAction, generateToolAnalysisAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import type { FilterCriteria, ToolRecommendationItem, ToolAnalysisItem } from '@/types';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const [filters, setFilters] = useState<FilterCriteria | null>(null);
  const [recommendations, setRecommendations] = useState<ToolRecommendationItem[]>([]);
  const [toolAnalyses, setToolAnalyses] = useState<Record<string, ToolAnalysisItem | null>>({});
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFilterSubmit = async (data: FilterCriteria) => {
    setIsLoadingRecommendations(true);
    setError(null);
    setRecommendations([]); // Clear previous recommendations
    setToolAnalyses({}); // Clear previous analyses
    try {
      const result = await recommendToolsAction(data);
      setRecommendations(result.recommendations);
      setFilters(data); // Store applied filters
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred while fetching recommendations.');
      toast({
        title: 'Error',
        description: e.message || 'Failed to get tool recommendations.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleGetAnalysis = async (toolName: string) => {
    if (toolAnalyses[toolName]) return; // Don't re-fetch if already present

    setIsLoadingAnalysis((prev) => ({ ...prev, [toolName]: true }));
    setError(null);
    try {
      const analysisResult = await generateToolAnalysisAction({ toolName });
      setToolAnalyses((prev) => ({ ...prev, [toolName]: analysisResult }));
    } catch (e: any) {
      setError(e.message || `An unknown error occurred while fetching analysis for ${toolName}.`);
      toast({
        title: 'Error',
        description: e.message || `Failed to get analysis for ${toolName}.`,
        variant: 'destructive',
      });
      // Set analysis to null on error to prevent repeated loading attempts without user action
      setToolAnalyses((prev) => ({ ...prev, [toolName]: null }));
    } finally {
      setIsLoadingAnalysis((prev) => ({ ...prev, [toolName]: false }));
    }
  };
  
  // Default filter values for initial render - can be empty or pre-filled
  const initialFilterValues: FilterCriteria = {
    applicationType: 'Web',
    os: 'Cross-Platform',
    testType: 'Functional',
    codingNeeds: 'Scripting',
  };

  // Effect to fetch initial recommendations on load (optional)
  useEffect(() => {
     // handleFilterSubmit(initialFilterValues); // Uncomment to auto-load on page init
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8 space-y-10">
        <FilterForm 
          onSubmit={handleFilterSubmit} 
          isLoading={isLoadingRecommendations}
          defaultValues={initialFilterValues}
        />
        
        <RecommendationsDisplay
          recommendations={recommendations}
          toolAnalyses={toolAnalyses}
          // These are mocked inside RecommendationsDisplay for now
          projectEfforts={{}} 
          docLinks={{}}
          onGetAnalysis={handleGetAnalysis}
          isLoadingRecommendations={isLoadingRecommendations}
          isLoadingAnalysis={isLoadingAnalysis}
          error={error}
        />

        {recommendations.length > 0 && (
          <>
            <Separator className="my-12" />
            <div className="grid md:grid-cols-2 gap-8">
              <ROIChart recommendedTools={recommendations} />
              <TrendAnalysisCard />
            </div>
          </>
        )}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border mt-auto">
        © {new Date().getFullYear()} Beacon: AI Test Tool Navigator. Powered by Firebase Studio & Genkit.
      </footer>
    </div>
  );
}
