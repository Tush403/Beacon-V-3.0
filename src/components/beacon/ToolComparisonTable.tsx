
'use client';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GitCompare, Info, Link as LinkIcon, Download } from 'lucide-react';
import type { CompareToolsOutput, ToolRecommendationItem } from '@/types';
import { Fragment } from 'react';

interface ToolComparisonTableProps {
  data: CompareToolsOutput;
  toolNames: string[];
  recommendations: ToolRecommendationItem[];
  allTools: { value: string; label: string; }[];
  onToolChange: (index: number, newToolValue: string) => void;
}

export function ToolComparisonTable({ data, toolNames, recommendations, allTools, onToolChange }: ToolComparisonTableProps) {
  if (!data || !data.comparisonTable || data.comparisonTable.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-headline text-foreground">
            <GitCompare className="h-6 w-6 text-foreground" />
            Tool Comparison
          </CardTitle>
          <CardDescription>No comparison data available.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { comparisonTable, toolOverviews } = data;
  const uniqueToolNames = toolNames.filter((name, index, self) => self.indexOf(name) === index);

  const getToolValueByName = (label: string) => {
    return allTools.find(tool => tool.label === label)?.value || label;
  };

  const getToolScore = (toolName: string) => {
    const recommendation = recommendations.find(r => r.toolName === toolName);
    return recommendation ? (recommendation.score / 10).toFixed(1) : null;
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline text-foreground">
                <GitCompare className="h-7 w-7 text-foreground" />
                Tool Comparison Table
            </CardTitle>
            <CardDescription className="mt-1">
                Compare tools side-by-side. Use the dropdowns to customize your comparison.
            </CardDescription>
        </div>
        <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        {toolOverviews && Object.keys(toolOverviews).length > 0 && (
          <div className="mb-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Info className="h-5 w-5 text-foreground" />
                Tool Overviews
            </h3>
            {uniqueToolNames.map(toolName => (
              toolOverviews[toolName] && (
                <div key={toolName} className="p-3 border rounded-md bg-muted/20">
                  <h4 className="font-medium text-foreground">{toolName}</h4>
                  <p className="text-sm text-muted-foreground">{toolOverviews[toolName]}</p>
                </div>
              )
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <Table className="border">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="min-w-[180px] font-semibold text-foreground border-r">Parameters</TableHead>
                {uniqueToolNames.map((toolName, index) => {
                  const score = getToolScore(toolName);
                  return (
                    <TableHead key={`${toolName}-${index}`} className="min-w-[250px] p-2 align-top text-foreground font-semibold border-r last:border-r-0">
                       <div className="flex items-center gap-2 mb-1">
                            <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0"/>
                            <Select 
                                value={getToolValueByName(toolName)}
                                onValueChange={(newValue) => onToolChange(index, newValue)}
                            >
                                <SelectTrigger className="text-base font-bold text-accent border-0 shadow-none focus:ring-0 !bg-transparent p-0 h-auto">
                                    <SelectValue placeholder="Select a tool" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allTools.map(tool => (
                                        <SelectItem key={tool.value} value={tool.value}>
                                            {tool.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                       </div>
                       {score && (
                           <p className="text-xs text-muted-foreground font-normal ml-6">Score: {score}/10</p>
                       )}
                    </TableHead>
                  )
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonTable.map((criterion) => (
                <TableRow key={criterion.criterionName} className="border-t">
                  <TableCell className="font-medium text-foreground align-top border-r">{criterion.criterionName}</TableCell>
                  {uniqueToolNames.map((toolName, index) => (
                    <TableCell key={`${toolName}-${index}`} className="text-sm text-muted-foreground align-top whitespace-pre-line border-r last:border-r-0">
                      {criterion.toolValues[toolName] || 'N/A'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
           <TableCaption className="mt-4 text-xs">AI-generated comparison. Information may require validation for critical decisions.</TableCaption>
        </div>
      </CardContent>
    </Card>
  );
}
