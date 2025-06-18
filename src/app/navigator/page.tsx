
'use client';

import { useState, useEffect, Fragment } from 'react'; // Added Fragment
import Link from 'next/link'; // Added Link
import React from 'react'; // Added React import
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
          <div className="flex flex-col flex-1 h-full"> {/* Wrapper for content + footer */}
            <div className="flex-grow p-4 md:p-8 space-y-10 overflow-y-auto"> {/* Main content area */}
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
            {/* Footer moved here */}
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

