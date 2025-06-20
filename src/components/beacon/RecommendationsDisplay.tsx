
'use client';

import { ToolCard } from './ToolCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import type { ToolRecommendationItem, ToolAnalysisItem, ProjectEffort, DocumentationLink } from '@/types';
import { Lightbulb, AlertTriangle, Compass } from 'lucide-react';

interface RecommendationsDisplayProps {
  recommendations: ToolRecommendationItem[];
  toolAnalyses: Record<string, ToolAnalysisItem | null>;
  projectEfforts: Record<string, ProjectEffort | null>;
  docLinks: Record<string, DocumentationLink | null>;
  onGetAnalysis: (toolName: string) => void;
  isLoadingRecommendations: boolean;
  isLoadingAnalysis: Record<string, boolean>;
  error?: string | null;
  hasInteracted: boolean; // New prop
}

const mockEfforts: Record<string, ProjectEffort> = {
  'Tool A': { toolName: 'Tool A', effortDaysMin: 10, effortDaysMax: 15, assumptions: ['Medium project complexity', 'Team has prior experience'] },
  'Tool B': { toolName: 'Tool B', effortDaysMin: 12, effortDaysMax: 20, assumptions: ['High project complexity', 'Requires new skill acquisition'] },
  'Tool C': { toolName: 'Tool C', effortDaysMin: 8, effortDaysMax: 12, assumptions: ['Low project complexity', 'Utilizes low-code features'] },
  'DefaultTool1': { toolName: 'DefaultTool1', effortDaysMin: 10, effortDaysMax: 15, assumptions: ['Medium project complexity', 'Team has prior experience'] },
  'DefaultTool2': { toolName: 'DefaultTool2', effortDaysMin: 12, effortDaysMax: 20, assumptions: ['High project complexity', 'Requires new skill acquisition'] },
  'DefaultTool3': { toolName: 'DefaultTool3', effortDaysMin: 8, effortDaysMax: 12, assumptions: ['Low project complexity', 'Utilizes low-code features'] },
};

const mockDocLinks: Record<string, DocumentationLink> = {
  'Tool A': { toolName: 'Tool A', url: 'https://example.com/tool-a.pdf', label: 'Visit Official Website' },
  'Tool B': { toolName: 'Tool B', url: 'https://example.com/tool-b.pdf', label: 'Visit Official Website' },
  'Tool C': { toolName: 'Tool C', url: 'https://example.com/tool-c.pdf', label: 'Visit Official Website' },
  'DefaultTool1': { toolName: 'DefaultTool1', url: 'https://example.com/default-tool1.pdf', label: 'Visit Official Website' },
  'DefaultTool2': { toolName: 'DefaultTool2', url: 'https://example.com/default-tool2.pdf', label: 'Visit Official Website' },
  'DefaultTool3': { toolName: 'DefaultTool3', url: 'https://example.com/default-tool3.pdf', label: 'Visit Official Website' },
};


export function RecommendationsDisplay({
  recommendations,
  toolAnalyses,
  isLoadingRecommendations,
  isLoadingAnalysis,
  onGetAnalysis,
  error,
  hasInteracted, // Use the new prop
}: RecommendationsDisplayProps) {
  if (isLoadingRecommendations) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-headline font-semibold mb-6 text-center flex items-center justify-center gap-2 text-foreground">
          <Lightbulb className="h-7 w-7 text-foreground animate-pulse" />
          Fetching AI Recommendations...
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-lg">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 text-center py-10 bg-destructive/10 rounded-lg border border-destructive text-destructive">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong.</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!hasInteracted && recommendations.length === 0) {
    return (
      <Card className="mt-8 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-headline text-foreground">
            <Compass className="h-6 w-6 text-foreground" />
            Navigate Your Test Automation Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-base text-muted-foreground">
            Welcome to Beacon, your AI-powered guide to selecting the perfect test automation tools.
          </p>
          <div>
            <p className="text-sm text-foreground font-medium">
              To get started:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 my-2 ml-4">
              <li>Explore the <span className="font-semibold text-accent">Filter Tools</span> section in the sidebar.</li>
              <li>Define your project's specific requirements (application type, test type, OS, etc.).</li>
              <li>Click <span className="font-semibold text-accent">"Get AI Recommendations"</span>.</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Beacon will then analyze your criteria and present the top 3 AI-recommended tools, complete with detailed analysis and insights.
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Let's find the best tools for your success!</p>
        </CardFooter>
      </Card>
    );
  }

  if (hasInteracted && recommendations.length === 0) {
    return (
      <div className="mt-8 text-center py-8">
        <Lightbulb className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-muted-foreground">No Results Found</h3>
        <p className="text-sm text-muted-foreground">
          We couldn't find any tools matching your current filter criteria.
          <br />
          Please adjust your selections in the sidebar and try again.
        </p>
      </div>
    );
  }


  if (recommendations.length === 0) {
    // This case should ideally not be hit if the above logic is correct,
    // but as a fallback, it ensures something is shown.
    return (
        <div className="mt-8 text-center py-8">
            <Lightbulb className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-muted-foreground">Ready to Discover?</h3>
            <p className="text-sm text-muted-foreground">Use the filters to find your ideal test automation tools.</p>
        </div>
    );
  }

  // Sort recommendations by score descending before assigning rank
  const sortedRecommendations = [...recommendations].sort((a, b) => b.score - a.score);

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-headline font-semibold mb-8 text-center flex items-center justify-center gap-3 text-foreground">
        <Lightbulb className="h-8 w-8 text-foreground" />
        Top 3 AI-Recommended Tools
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {sortedRecommendations.map((tool, index) => (
          <ToolCard
            key={tool.toolName}
            tool={tool}
            analysis={toolAnalyses[tool.toolName]}
            effort={mockEfforts[tool.toolName] || mockEfforts[`DefaultTool${index + 1}`]}
            docLink={mockDocLinks[tool.toolName] || mockDocLinks[`DefaultTool${index + 1}`]}
            onGetAnalysis={onGetAnalysis}
            isAnalysisLoading={!!isLoadingAnalysis[tool.toolName]}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
