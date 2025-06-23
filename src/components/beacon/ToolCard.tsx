'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Sparkles, FileText, ExternalLink, AlertCircle } from 'lucide-react';
import type { ToolRecommendationItem, ToolAnalysisItem, DocumentationLink } from '@/types';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ToolCardProps {
  tool: ToolRecommendationItem;
  analysis?: ToolAnalysisItem | null;
  docLink?: DocumentationLink | null;
  onGetAnalysis: (toolName: string) => void;
  isAnalysisLoading: boolean;
  rank: number;
}

export function ToolCard({
  tool,
  analysis,
  docLink,
  onGetAnalysis,
  isAnalysisLoading,
  rank
}: ToolCardProps) {
  const cardBorderColor = rank === 1 ? "border-accent" : rank === 2 ? "border-primary" : "border-border";

  return (
    <Card className={`shadow-lg transition-all duration-300 hover:shadow-xl flex flex-col h-full ${cardBorderColor} border-2`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-headline text-foreground">{tool.toolName}</CardTitle>
            <CardDescription className="text-sm">AI Justification: {tool.justification}</CardDescription>
          </div>
          <Badge variant={rank === 1 ? "default" : "secondary"} className={`text-lg px-3 py-1 ${rank === 1 ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>
            Rank #{rank}
          </Badge>
        </div>
        <div className="mt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-muted-foreground">Suitability Score</span>
            <span className="text-lg font-bold text-accent">{tool.score}%</span>
          </div>
          <Progress value={tool.score} aria-label={`Suitability score: ${tool.score}%`} className="w-full h-3 [&>div]:bg-gradient-to-r [&>div]:from-secondary [&>div]:to-primary" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="analysis">
            <AccordionTrigger
              onClick={() => {
                if (!analysis && !isAnalysisLoading) {
                  onGetAnalysis(tool.toolName);
                }
              }}
              className="text-left hover:no-underline"
              disabled={isAnalysisLoading && !analysis}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                AI-Generated Analysis
                {isAnalysisLoading && !analysis && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              {isAnalysisLoading && !analysis ? (
                <div className="space-y-2 mt-2">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                </div>
              ) : analysis ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold text-primary">Strengths:</h4>
                    <p className="text-muted-foreground whitespace-pre-line">{analysis.strengths}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-destructive">Weaknesses:</h4>
                    <p className="text-muted-foreground whitespace-pre-line">{analysis.weaknesses}</p>
                  </div>
                </div>
              ) : (
                 <div className="flex items-center text-muted-foreground text-sm">
                    <AlertCircle className="h-4 w-4 mr-2"/> Click to load analysis.
                 </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="pt-4 mt-auto border-t">
        {docLink ? (
          <Button variant="outline" asChild className="w-full">
            <a href={docLink.url} target="_blank" rel="noopener noreferrer">
              <FileText className="mr-2 h-4 w-4" />
              Visit Official Website
              <ExternalLink className="ml-auto h-4 w-4 opacity-70" />
            </a>
          </Button>
        ) : (
            <Button variant="outline" disabled className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Documentation N/A
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
