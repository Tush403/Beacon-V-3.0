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
import { Info, Download, Star } from 'lucide-react';
import type { CompareToolsOutput } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface ToolComparisonTableProps {
  data: CompareToolsOutput | null;
  toolNames: string[];
  allTools: { value: string; label: string; }[];
  onToolChange: (index: number, newToolValue: string) => void;
  isLoading?: boolean;
}

const ComparisonTableSkeleton = ({ toolNames }: { toolNames: string[] }) => (
  <Card className="shadow-lg w-full">
    <CardHeader>
      <Skeleton className="h-7 w-1/2 mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </CardHeader>
    <CardContent>
      <div className="border rounded-lg overflow-hidden">
        <Table className="table-fixed">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[220px] p-3">
                <Skeleton className="h-5 w-24" />
              </TableHead>
              {toolNames.map((_, index) => (
                <TableHead key={index} className="p-2">
                  <Skeleton className="h-9 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(6)].map((_, i) => (
              <TableRow key={i}>
                <TableCell className="p-3"><Skeleton className="h-5 w-32" /></TableCell>
                {toolNames.map((_, j) => (
                  <TableCell key={j} className="p-3"><Skeleton className="h-5 w-full" /></TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

export function ToolComparisonTable({ data, toolNames, allTools, onToolChange, isLoading }: ToolComparisonTableProps) {
  const { toast } = useToast();

  const handleExportCSV = () => {
    if (!data || !data.comparisonTable) return;

    const { comparisonTable, toolOverviews } = data;
    let csvContent = 'data:text/csv;charset=utf-8,';

    // Headers
    const headers = ['Parameters', ...toolNames];
    csvContent += headers.join(',') + '\r\n';

    // Overviews
    if (toolOverviews) {
      const overviewRow = ['Overview', ...toolNames.map(name => `"${toolOverviews[name]?.replace(/"/g, '""') || 'N/A'}"`)];
      csvContent += overviewRow.join(',') + '\r\n';
    }

    // Comparison Table
    comparisonTable.forEach(criterion => {
      const row = [
        `"${criterion.criterionName}"`,
        ...toolNames.map(toolName => `"${criterion.toolValues[toolName]?.replace(/"/g, '""') || 'N/A'}"`)
      ];
      csvContent += row.join(',') + '\r\n';
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tool_comparison.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "The tool comparison data has been exported to CSV.",
    });
  };

  if (isLoading) {
    return <ComparisonTableSkeleton toolNames={toolNames} />;
  }

  if (!data || !data.comparisonTable || data.comparisonTable.length === 0) {
    return null; // Return null if there's no data and it's not loading, navigator page handles error display
  }

  const { comparisonTable, toolOverviews } = data;
  const uniqueToolNames = toolNames.filter((name, index, self) => self.indexOf(name) === index);

  const getToolValueByName = (label: string) => {
    return allTools.find(tool => tool.label === label)?.value || label;
  };

  return (
    <Card 
        key={toolNames.join('-')} 
        className="shadow-lg w-full animate-in fade-in-50 duration-500"
    >
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline text-foreground">
                <Star className="h-7 w-7 text-primary" />
                Tool Comparison Table
            </CardTitle>
            <CardDescription className="mt-1">
                Compare tools side-by-side. You can change tools from the dropdowns to update the comparison.
            </CardDescription>
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
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
        <div className="border rounded-lg overflow-hidden">
          <Table className="table-fixed">
            <TableCaption className="mt-4 text-xs">AI-generated comparison. Information may require validation for critical decisions.</TableCaption>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[220px] p-3 font-semibold text-primary border-r">Parameters</TableHead>
                {uniqueToolNames.map((toolName, index) => {
                  return (
                    <TableHead key={`${toolName}-${index}`} className="p-2 align-top text-foreground font-semibold border-r last:border-r-0">
                        <Select 
                            value={getToolValueByName(toolName)}
                            onValueChange={(newValue) => onToolChange(index, newValue)}
                        >
                            <SelectTrigger className="font-semibold text-sm text-primary">
                                <SelectValue>{toolName}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {allTools.map(tool => (
                                    <SelectItem key={tool.value} value={tool.value}>
                                        {tool.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </TableHead>
                  )
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonTable.map((criterion) => (
                <TableRow key={criterion.criterionName} className="border-t">
                  <TableCell className="font-medium text-foreground align-top border-r p-3">{criterion.criterionName}</TableCell>
                  {uniqueToolNames.map((toolName, index) => (
                    <TableCell key={`${toolName}-${index}`} className="text-sm text-muted-foreground align-top whitespace-pre-line border-r last:border-r-0 p-3">
                      {criterion.toolValues[toolName] || 'N/A'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
