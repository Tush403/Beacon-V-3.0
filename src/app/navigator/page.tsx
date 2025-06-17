'use client';

import { useState, useEffect } from 'react';
// Removed AppHeader import, it's in navigator/layout.tsx
import { FilterForm } from '@/components/beacon/FilterForm';
import { RecommendationsDisplay } from '@/components/beacon/RecommendationsDisplay';
import { ROIChart } from '@/components/beacon/ROIChart';
import { TrendAnalysisCard } from '@/components/beacon/TrendAnalysisCard';
import { recommendToolsAction, generateToolAnalysisAction } from '../actions'; // Adjusted path for actions
import { useToast } from '@/hooks/use-toast';
import type { FilterCriteria, ToolRecommendationItem, ToolAnalysisItem } from '@/types';
import { Separator } from '@/components/ui/separator';

export default function NavigatorPage() {
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
    setRecommendations([]); 
    setToolAnalyses({}); 
    try {
      const result = await recommendToolsAction(data);
      setRecommendations(result.recommendations);
      setFilters(data); 
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
    if (toolAnalyses[toolName]) return; 

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
      setToolAnalyses((prev) => ({ ...prev, [toolName]: null }));
    } finally {
      setIsLoadingAnalysis((prev) => ({ ...prev, [toolName]: false }));
    }
  };
  
  const initialFilterValues: FilterCriteria = {
    applicationType: 'Web',
    os: 'Cross-Platform',
    testType: 'Functional',
    codingNeeds: 'Scripting',
  };

  useEffect(() => {
     // handleFilterSubmit(initialFilterValues); // Uncomment to auto-load on page init
  }, []);


  return (
    // Removed outer div and AppHeader, handled by layout
    // Main tag from original page.tsx structure preserved here
    <div className="space-y-10">
      <FilterForm 
        onSubmit={handleFilterSubmit} 
        isLoading={isLoadingRecommendations}
        defaultValues={initialFilterValues}
      />
      
      <RecommendationsDisplay
        recommendations={recommendations}
        toolAnalyses={toolAnalyses}
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
    </div>
    // Removed footer, handled by layout
  );
}
