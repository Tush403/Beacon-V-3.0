
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
import { GitCompare, Info } from 'lucide-react';
import type { CompareToolsOutput } from '@/types';
import { Fragment } from 'react';

interface ToolComparisonTableProps {
  data: CompareToolsOutput;
  toolNames: string[]; // Pass the tool names to maintain column order and get actual names
}

export function ToolComparisonTable({ data, toolNames }: ToolComparisonTableProps) {
  if (!data || !data.comparisonTable || data.comparisonTable.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-headline">
            <GitCompare className="h-6 w-6 text-primary" />
            Tool Comparison
          </CardTitle>
          <CardDescription>No comparison data available.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { comparisonTable, toolOverviews } = data;

  // Ensure toolNames are unique and in the order they were selected for columns
  const uniqueToolNames = toolNames.filter((name, index, self) => self.indexOf(name) === index);


  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline">
          <GitCompare className="h-7 w-7 text-primary" />
          AI-Powered Tool Comparison
        </CardTitle>
        <CardDescription>
          Side-by-side analysis of: {uniqueToolNames.join(', ')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {toolOverviews && Object.keys(toolOverviews).length > 0 && (
          <div className="mb-6 space-y-4">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <Info className="h-5 w-5" />
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px] font-semibold text-foreground">Feature</TableHead>
                {uniqueToolNames.map((toolName) => (
                  <TableHead key={toolName} className="min-w-[200px] font-semibold text-foreground">{toolName}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonTable.map((criterion) => (
                <TableRow key={criterion.criterionName}>
                  <TableCell className="font-medium text-primary align-top">{criterion.criterionName}</TableCell>
                  {uniqueToolNames.map((toolName) => (
                    <TableCell key={toolName} className="text-sm text-muted-foreground align-top whitespace-pre-line">
                      {criterion.toolValues[toolName] || 'N/A'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <TableCaption className="mt-4 text-xs">AI-generated comparison. Information may require validation for critical decisions.</TableCaption>
      </CardContent>
    </Card>
  );
}
