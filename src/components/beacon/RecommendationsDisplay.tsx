
'use client';

import { ToolCard } from './ToolCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'; // Added Card imports
import type { ToolRecommendationItem, ToolAnalysisItem, ProjectEffort, DocumentationLink } from '@/types';
import { Lightbulb, AlertTriangle } from 'lucide-react';

interface RecommendationsDisplayProps {
  recommendations: ToolRecommendationItem[];
  toolAnalyses: Record<string, ToolAnalysisItem | null>;
  projectEfforts: Record<string, ProjectEffort | null>;
  docLinks: Record<string, DocumentationLink | null>;
  onGetAnalysis: (toolName: string) => void;
  isLoadingRecommendations: boolean;
  isLoadingAnalysis: Record<string, boolean>;
  error?: string | null;
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
  'Tool A': { toolName: 'Tool A', url: 'https://example.com/tool-a.pdf', label: 'View Tool A Docs' },
  'Tool B': { toolName: 'Tool B', url: 'https://example.com/tool-b.pdf', label: 'View Tool B Docs' },
  'Tool C': { toolName: 'Tool C', url: 'https://example.com/tool-c.pdf', label: 'View Tool C Docs' },
  'DefaultTool1': { toolName: 'DefaultTool1', url: 'https://example.com/default-tool1.pdf', label: 'View DefaultTool1 Docs' },
  'DefaultTool2': { toolName: 'DefaultTool2', url: 'https://example.com/default-tool2.pdf', label: 'View DefaultTool2 Docs' },
  'DefaultTool3': { toolName: 'DefaultTool3', url: 'https://example.com/default-tool3.pdf', label: 'View DefaultTool3 Docs' },
};


export function RecommendationsDisplay({
  recommendations,
  toolAnalyses,
  isLoadingRecommendations,
  isLoadingAnalysis,
  onGetAnalysis,
  error,
}: RecommendationsDisplayProps) {
  if (isLoadingRecommendations) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-headline font-semibold mb-6 text-center flex items-center justify-center gap-2">
          <Lightbulb className="h-7 w-7 text-primary animate-pulse" />
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

  if (recommendations.length === 0) {
    return (
      <div className="mt-8 text-center py-10 bg-card rounded-lg">
        <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold text-muted-foreground">No recommendations yet.</h3>
        <p className="text-muted-foreground">Adjust your filters and try again to get AI-powered tool suggestions.</p>
      </div>
    );
  }

  // Sort recommendations by score descending before assigning rank
  const sortedRecommendations = [...recommendations].sort((a, b) => b.score - a.score);

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-headline font-semibold mb-8 text-center flex items-center justify-center gap-3">
        <Lightbulb className="h-8 w-8 text-primary" />
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
