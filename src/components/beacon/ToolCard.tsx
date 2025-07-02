
'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle, XCircle, Eye } from 'lucide-react';
import type { ToolRecommendationItem, ToolAnalysisItem, DocumentationLink } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toolLogos } from '@/lib/tool-logos';

interface ToolCardProps {
  tool: ToolRecommendationItem;
  analysis?: ToolAnalysisItem | null;
  docLink?: DocumentationLink | null;
  isAnalysisLoading: boolean;
  onViewDetails: (toolName: string) => void;
}

const getInitials = (name: string) => {
  const words = name.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/);
  if (words.length === 1) {
    // For single-word names, take up to 2 characters.
    return words[0].substring(0, 2).toUpperCase();
  }
  // For multi-word names, take the first letter of the first two words.
  return (words[0][0] + (words[1]?.[0] || '')).toUpperCase();
};

const AnalysisContent = ({ analysis, isAnalysisLoading, toolName }: { analysis?: ToolAnalysisItem | null, isAnalysisLoading: boolean, toolName: string }) => {
  if (isAnalysisLoading && !analysis) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Analysis for {toolName} is being loaded...</p>
      </div>
    );
  }

  const strengths = analysis.strengths?.split('\n').filter(s => s.trim() !== '') || [];
  const weaknesses = analysis.weaknesses?.split('\n').filter(w => w.trim() !== '') || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <h4 className="font-semibold text-base flex items-center gap-2 text-green-600 dark:text-green-500 mb-2">
            <CheckCircle className="h-5 w-5" />
            Strengths
          </h4>
          <ul className="list-none space-y-1.5 text-sm text-muted-foreground">
            {strengths.map((item, index) => (
              <li key={`str-${index}`} className="flex items-start">
                <span className="mr-2 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
            {strengths.length === 0 && <li>No specific strengths listed.</li>}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-base flex items-center gap-2 text-red-600 dark:text-red-500 mb-2">
            <XCircle className="h-5 w-5" />
            Weaknesses
          </h4>
          <ul className="list-none space-y-1.5 text-sm text-muted-foreground">
            {weaknesses.map((item, index) => (
              <li key={`wk-${index}`} className="flex items-start">
                <span className="mr-2 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
            {weaknesses.length === 0 && <li>No specific weaknesses listed.</li>}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t">
        <div>
            <h4 className="font-semibold text-sm text-foreground">Application Types</h4>
            <p className="text-sm text-muted-foreground">{analysis.applicationTypes?.join(', ') || 'N/A'}</p>
        </div>
        <div>
            <h4 className="font-semibold text-sm text-foreground">Test Types</h4>
            <p className="text-sm text-muted-foreground">{analysis.testTypes?.join(', ') || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}

export function ToolCard({
  tool,
  analysis,
  docLink,
  isAnalysisLoading,
  onViewDetails,
}: ToolCardProps) {
  const logoSrc = toolLogos[tool.toolName.toLowerCase()];

  return (
    <Card className="shadow-none border rounded-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 text-xl bg-card border">
              {logoSrc ? (
                  <Image
                    src={logoSrc}
                    alt={`${tool.toolName} logo`}
                    width={64}
                    height={64}
                    className="object-contain p-1"
                  />
              ) : (
                <AvatarFallback className="bg-muted text-primary font-semibold">
                  {getInitials(tool.toolName)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
                <CardTitle className="text-2xl font-headline text-foreground">{tool.toolName}</CardTitle>
                <CardDescription className="text-base">
                    Overall Score: <span className="font-bold text-accent">{(tool.score / 10).toFixed(1)}/10</span>
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <AnalysisContent analysis={analysis} isAnalysisLoading={isAnalysisLoading} toolName={tool.toolName} />
      </CardContent>
      <CardFooter className="pt-6 mt-auto border-t bg-muted/30 flex justify-end gap-2 px-6 py-4">
        {docLink && (
          <Button variant="outline" asChild>
            <a href={docLink.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2" />
              Visit Website
            </a>
          </Button>
        )}
        <Button className="bg-gradient-from hover:bg-gradient-from/90 text-primary-foreground" onClick={() => onViewDetails(tool.toolName)}>
            <Eye className="mr-2" />
            View Full Details
        </Button>
      </CardFooter>
    </Card>
  );
}
