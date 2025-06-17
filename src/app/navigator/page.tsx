
'use client';

import { useState, useEffect } from 'react';
import { FilterForm } from '@/components/beacon/FilterForm';
import { RecommendationsDisplay } from '@/components/beacon/RecommendationsDisplay';
import { ROIChart } from '@/components/beacon/ROIChart';
import { TrendAnalysisCard } from '@/components/beacon/TrendAnalysisCard';
import { recommendToolsAction, generateToolAnalysisAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import type { FilterCriteria, ToolRecommendationItem, ToolAnalysisItem, GenerateToolAnalysisInput } from '@/types';
import { Separator } from '@/components/ui/separator';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarInset,
} from '@/components/ui/sidebar';
import { BackToTopButton } from '@/components/beacon/BackToTopButton';

export default function NavigatorPage() {
  const [filters, setFilters] = useState<FilterCriteria | null>(null);
  const [recommendations, setRecommendations] = useState<ToolRecommendationItem[]>([]);
  const [toolAnalyses, setToolAnalyses] = useState<Record<string, ToolAnalysisItem | null>>({});
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const initialFilterValues: FilterCriteria = {
    applicationUnderTest: 'all',
    testType: 'all',
    operatingSystem: 'all',
    codingRequirement: 'any',
    codingLanguage: 'any',
    pricingModel: 'any',
    reportingAnalytics: 'any',
    // AI Effort Estimator defaults
    automationTool: 'none',
    complexityLow: 0,
    complexityMedium: 0,
    complexityHigh: 0,
    complexityHighlyComplex: 0,
    useStandardFramework: false,
    cicdPipelineIntegrated: false,
    qaTeamSize: 0,
  };

  const handleFilterSubmit = async (data: FilterCriteria) => {
    setIsLoadingRecommendations(true);
    setError(null);
    setRecommendations([]); 
    setToolAnalyses({}); 
    try {
      // The data from the form should match RecommendToolsInput, which is FilterCriteria
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
      const analysisInput: GenerateToolAnalysisInput = { toolName };
      const analysisResult = await generateToolAnalysisAction(analysisInput);
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
  
  useEffect(() => {
     // To auto-load on page init with default filters:
     // handleFilterSubmit(initialFilterValues); 
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-1">
        <Sidebar className="h-auto border-r" collapsible="icon">
          <SidebarContent className="md:mt-16 px-4 pb-4">
            <FilterForm 
              onSubmit={handleFilterSubmit} 
              isLoading={isLoadingRecommendations}
              defaultValues={initialFilterValues}
            />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="p-4 md:p-8 space-y-10">
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
                <div className="space-y-8">
                  <ROIChart recommendedTools={recommendations} />
                  <TrendAnalysisCard />
                </div>
              </>
            )}
          </div>
        </SidebarInset>
      </div>
      <BackToTopButton />
    </SidebarProvider>
  );
}
