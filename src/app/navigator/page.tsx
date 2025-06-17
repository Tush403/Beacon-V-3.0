'use client';

import { useState, useEffect } from 'react';
import { FilterForm } from '@/components/beacon/FilterForm';
import { RecommendationsDisplay } from '@/components/beacon/RecommendationsDisplay';
import { ROIChart } from '@/components/beacon/ROIChart';
import { TrendAnalysisCard } from '@/components/beacon/TrendAnalysisCard';
import { recommendToolsAction, generateToolAnalysisAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import type { FilterCriteria, ToolRecommendationItem, ToolAnalysisItem } from '@/types';
import { Separator } from '@/components/ui/separator';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarInset,
  SidebarHeader,
  SidebarTrigger // Optional: if you want a button to toggle sidebar on mobile/desktop
} from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle } from '@/components/ui/card'; // For filter title if needed
import { Filter as FilterIcon } from 'lucide-react';

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
    complexityMedium: 30,
    complexityHigh: 15,
    complexityHighlyComplex: 5,
    useStandardFramework: false,
    cicdPipelineIntegrated: false,
    qaTeamSize: 1,
  };

  useEffect(() => {
     // handleFilterSubmit(initialFilterValues); // Uncomment to auto-load on page init
  }, []);

  return (
    <SidebarProvider defaultOpen={true}> {/* Sidebar open by default on desktop */}
      <div className="flex flex-1"> {/* This div is important for SidebarProvider's direct child */}
        <Sidebar className="h-auto border-r" collapsible="icon"> {/* Use 'icon' for desktop collapse, offcanvas for mobile */}
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <FilterIcon className="h-5 w-5" />
              <span>Filter Options</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <FilterForm 
              onSubmit={handleFilterSubmit} 
              isLoading={isLoadingRecommendations}
              defaultValues={initialFilterValues}
            />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="p-4 md:p-8 space-y-10"> {/* Add padding to main content area */}
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
