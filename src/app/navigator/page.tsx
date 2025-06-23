
'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import React from 'react';
import { FilterForm } from '@/components/beacon/FilterForm';
import { RecommendationsDisplay } from '@/components/beacon/RecommendationsDisplay';
import { ROIChart } from '@/components/beacon/ROIChart';
import { TrendAnalysisCard } from '@/components/beacon/TrendAnalysisCard';
import { ToolComparisonTable } from '@/components/beacon/ToolComparisonTable';
import { recommendToolsAction, generateToolAnalysisAction, compareToolsAction, estimateEffortAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import type { FilterCriteria, ToolRecommendationItem, ToolAnalysisItem, GenerateToolAnalysisInput, CompareToolsOutput, CompareToolsInput, EstimateEffortOutput, EstimateEffortInput } from '@/types';
import { Separator } from '@/components/ui/separator';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarInset,
} from '@/components/ui/sidebar';
import { BackToTopButton } from '@/components/beacon/BackToTopButton';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { automationToolOptions } from '@/lib/tool-options';

export default function NavigatorPage() {
  const [filters, setFilters] = useState<FilterCriteria | null>(null);
  const [recommendations, setRecommendations] = useState<ToolRecommendationItem[]>([]);
  const [toolAnalyses, setToolAnalyses] = useState<Record<string, ToolAnalysisItem | null>>({});
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  
  const [comparisonData, setComparisonData] = useState<CompareToolsOutput | null>(null);
  const [comparedToolNames, setComparedToolNames] = useState<string[]>([]);
  const [isComparingTools, setIsComparingTools] = useState(false);
  const [comparisonError, setComparisonError] = useState<string | null>(null);

  const [hasInteracted, setHasInteracted] = useState(false);

  const { toast } = useToast();

  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const initialFilterValues: FilterCriteria = {
    applicationUnderTest: 'all',
    testType: 'all',
    operatingSystem: 'all',
    codingRequirement: 'any',
    codingLanguage: 'any',
    pricingModel: 'any',
    reportingAnalytics: 'any',
    applicationSubCategory: 'any',
    integrationCapabilities: 'any',
    teamSizeSuitability: 'any',
    keyFeatureFocus: 'any',
    automationTool: undefined,
    complexityLow: undefined,
    complexityMedium: undefined,
    complexityHigh: undefined,
    complexityHighlyComplex: undefined,
    useStandardFramework: false,
    cicdPipelineIntegrated: false,
    qaTeamSize: undefined,
  };

  const handleFilterSubmit = async (data: FilterCriteria) => {
    setHasInteracted(true);
    setIsLoadingRecommendations(true);
    setError(null);
    setRecommendations([]); 
    setToolAnalyses({});
    // Clear comparison from previous search
    setComparisonData(null);
    setComparisonError(null);
    
    try {
      const result = await recommendToolsAction(data);
      setRecommendations(result.recommendations);
      setFilters(data); 

      // Automatically trigger comparison for new recommendations
      if (result.recommendations.length > 0) {
        await handleCompareRequest(result.recommendations.map(r => r.toolName));
      }
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
    try {
      const analysisInput: GenerateToolAnalysisInput = { toolName };
      const analysisResult = await generateToolAnalysisAction(analysisInput);
      setToolAnalyses((prev) => ({ ...prev, [toolName]: analysisResult }));
    } catch (e: any) {
      toast({
        title: 'Analysis Error',
        description: e.message || `Failed to get analysis for ${toolName}.`,
        variant: 'destructive',
      });
      setToolAnalyses((prev) => ({ ...prev, [toolName]: null }));
    } finally {
      setIsLoadingAnalysis((prev) => ({ ...prev, [toolName]: false }));
    }
  };

  const handleCompareRequest = async (toolDisplayNames: string[]) => {
    setHasInteracted(true);
    setIsComparingTools(true);
    setComparisonError(null);
    setComparisonData(null);
    setComparedToolNames(toolDisplayNames);

    try {
      const input: CompareToolsInput = { toolNames: toolDisplayNames };
      const result = await compareToolsAction(input);
      setComparisonData(result);
    } catch (e: any) {
      const msg = e.message || 'An unknown error occurred while comparing tools.';
      setComparisonError(msg);
      toast({
        title: 'Comparison Error',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsComparingTools(false);
    }
  };
  
  const handleComparisonToolChange = async (indexToChange: number, newToolValue: string) => {
    // Find the label for the given value
    const newToolLabel = automationToolOptions.find(opt => opt.value === newToolValue)?.label || newToolValue;
  
    // Create the new list of tool names for comparison
    const newToolNames = [...comparedToolNames];
    newToolNames[indexToChange] = newToolLabel;
  
    // Call the comparison function
    await handleCompareRequest(newToolNames);
  };
  
  useEffect(() => {
     // To auto-load on page init with default filters:
     // handleFilterSubmit(initialFilterValues); 
  }, []);

  const recommendationsExist = recommendations.length > 0;
  const comparisonIsActive = isComparingTools || !!comparisonData || !!comparisonError;

  const ComparisonRenderBlock = () => (
    <>
      {isComparingTools && (
        <div className="text-center py-10">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
          <h3 className="text-xl font-semibold text-muted-foreground">AI is comparing tools...</h3>
          <p className="text-muted-foreground">This may take a moment.</p>
        </div>
      )}
      {comparisonError && !isComparingTools && (
        <div className="mt-8 text-center py-10 bg-destructive/10 rounded-lg border border-destructive text-destructive">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Comparison Failed</h3>
          <p>{comparisonError}</p>
        </div>
      )}
      {comparisonData && !isComparingTools && !comparisonError && (
        <ToolComparisonTable 
          data={comparisonData} 
          toolNames={comparedToolNames}
          recommendations={recommendations}
          allTools={automationToolOptions}
          onToolChange={handleComparisonToolChange}
        />
      )}
    </>
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-1">
        <Sidebar className="h-auto border-r" collapsible="icon">
          <SidebarContent className="md:mt-16 px-4 pb-4">
            <FilterForm 
              onSubmit={handleFilterSubmit} 
              isLoading={isLoadingRecommendations}
              defaultValues={initialFilterValues}
              onCompareSubmit={handleCompareRequest}
              isComparing={isComparingTools}
            />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="flex flex-col flex-1 h-full">
            <div className="flex-grow p-4 md:p-8 space-y-10 overflow-y-auto">
              
              <RecommendationsDisplay
                recommendations={recommendations}
                toolAnalyses={toolAnalyses}
                docLinks={{}}
                onGetAnalysis={handleGetAnalysis}
                isLoadingRecommendations={isLoadingRecommendations}
                isLoadingAnalysis={isLoadingAnalysis}
                error={error}
                hasInteracted={hasInteracted} 
              />

              {comparisonIsActive && <ComparisonRenderBlock />}
              
              {recommendationsExist && (
                <div className="space-y-8">
                  <ROIChart recommendedTools={recommendations} />
                  <TrendAnalysisCard />
                </div>
              )}

            </div>
            <footer className="p-4 text-sm text-muted-foreground border-t border-border">
              <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-y-2">
                <p className="text-center sm:text-left">Copyright © {year} TAO Digital Solutions Inc. All rights reserved.</p>
                <div className="flex items-center gap-x-3 sm:gap-x-4">
                  <Link href="https://www.taodigitalsolutions.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                  <Separator orientation="vertical" className="h-4 bg-border hidden sm:block" />
                  <Link href="https://www.taodigitalsolutions.com/terms-conditions" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    Terms & Conditions
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </SidebarInset>
      </div>
      <BackToTopButton />
    </SidebarProvider>
  );
}
