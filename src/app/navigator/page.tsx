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
import { GlobalLoader } from '@/components/beacon/GlobalLoader';
import { cn } from '@/lib/utils';
import { EffortEstimationDialog } from '@/components/beacon/EffortEstimationDialog';

export default function NavigatorPage() {
  const [filters, setFilters] = useState<FilterCriteria | null>(null);
  const [recommendations, setRecommendations] = useState<ToolRecommendationItem[]>([]);
  const [toolAnalyses, setToolAnalyses] = useState<Record<string, ToolAnalysisItem | null>>({});
  const [error, setError] = useState<string | null>(null);
  
  const [comparisonData, setComparisonData] = useState<CompareToolsOutput | null>(null);
  const [comparedToolNames, setComparedToolNames] = useState<string[]>([]);
  const [comparisonError, setComparisonError] = useState<string | null>(null);

  const [hasInteracted, setHasInteracted] = useState(false);
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'finished'>('idle');

  const { toast } = useToast();

  const [effortEstimationResult, setEffortEstimationResult] = useState<EstimateEffortOutput | null>(null);
  const [isEffortDialogOpen, setIsEffortDialogOpen] = useState(false);

  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    // This effect resets the animation state after it has finished, so it can run again.
    if (loadingState === 'finished') {
        const timer = setTimeout(() => setLoadingState('idle'), 1000); // Animation duration + buffer
        return () => clearTimeout(timer);
    }
  }, [loadingState]);

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
    setLoadingState('loading');
    setError(null);
    setRecommendations([]); 
    setToolAnalyses({});
    setComparisonData(null);
    setComparisonError(null);
    
    try {
      const result = await recommendToolsAction(data);
      setRecommendations(result.recommendations);
      setFilters(data); 

      if (result.recommendations.length > 0) {
        const toolNames = result.recommendations.map(r => r.toolName);
        setComparedToolNames(toolNames);
        const comparisonInput: CompareToolsInput = { toolNames };
        const comparisonResult = await compareToolsAction(comparisonInput);
        setComparisonData(comparisonResult);
      }
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred while fetching recommendations.');
      toast({
        title: 'Error',
        description: e.message || 'Failed to get tool recommendations.',
        variant: 'destructive',
      });
    } finally {
      setLoadingState('finished');
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
  
  const handleComparisonToolChange = async (indexToChange: number, newToolValue: string) => {
    const newToolLabel = automationToolOptions.find(opt => opt.value === newToolValue)?.label || newToolValue;
    const newToolNames = [...comparedToolNames];
    newToolNames[indexToChange] = newToolLabel;
  
    setLoadingState('loading');
    setComparisonError(null);
    setComparisonData(null);
    setComparedToolNames(newToolNames);

    try {
      const input: CompareToolsInput = { toolNames: newToolNames };
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
      setLoadingState('finished');
    }
  };
  
  const handleEstimateSubmit = async (input: EstimateEffortInput) => {
    setLoadingState('loading');
    try {
      const result = await estimateEffortAction(input);
      setEffortEstimationResult(result);
      setIsEffortDialogOpen(true);
    } catch (e: any) {
      toast({
        title: 'Estimation Error',
        description: e.message || 'Failed to get effort estimate.',
        variant: 'destructive',
      });
    } finally {
      setLoadingState('finished');
    }
  };

  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
     // To auto-load on page init with default filters:
     // handleFilterSubmit(initialFilterValues); 
  }, []);

  const recommendationsExist = recommendations.length > 0;
  const isLoading = loadingState === 'loading';

  return (
    <SidebarProvider defaultOpen={true}>
      <GlobalLoader loadingState={loadingState} />
      <div className="flex flex-1">
        <Sidebar className="h-auto border-r" collapsible="icon">
          <SidebarContent className="md:mt-16 px-4 pb-4">
            <FilterForm 
              onSubmit={handleFilterSubmit} 
              isLoading={isLoading}
              defaultValues={initialFilterValues}
              onEstimate={handleEstimateSubmit}
            />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="flex flex-col flex-1 h-full">
            <div className={cn(
              "flex-grow p-4 md:p-8 space-y-10 overflow-y-auto transition-opacity duration-500",
              isLoading ? "opacity-0" : "opacity-100 delay-300"
            )}>
              
              <RecommendationsDisplay
                recommendations={recommendations}
                toolAnalyses={toolAnalyses}
                docLinks={{}}
                onGetAnalysis={handleGetAnalysis}
                isLoadingRecommendations={false}
                isLoadingAnalysis={isLoadingAnalysis}
                error={error}
                hasInteracted={hasInteracted} 
              />

              {!isLoading && (
                <>
                  {comparisonError && (
                    <div className="mt-8 text-center py-10 bg-destructive/10 rounded-lg border border-destructive text-destructive">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Comparison Failed</h3>
                      <p>{comparisonError}</p>
                    </div>
                  )}
                  {comparisonData && !comparisonError && (
                    <ToolComparisonTable 
                      data={comparisonData} 
                      toolNames={comparedToolNames}
                      allTools={automationToolOptions}
                      onToolChange={handleComparisonToolChange}
                    />
                  )}
                  
                  {recommendationsExist && (
                    <div className="space-y-8">
                      <ROIChart recommendedTools={recommendations} />
                      <TrendAnalysisCard />
                    </div>
                  )}
                </>
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
      <EffortEstimationDialog 
        isOpen={isEffortDialogOpen}
        onOpenChange={setIsEffortDialogOpen}
        estimation={effortEstimationResult}
      />
    </SidebarProvider>
  );
}
