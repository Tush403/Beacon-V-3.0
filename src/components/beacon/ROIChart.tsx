'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import type { ToolRecommendationItem } from '@/types';

interface ROIChartProps {
  recommendedTools: ToolRecommendationItem[];
}

// Enhanced mock ROI data generation
const generateMockRoiData = (tools: ToolRecommendationItem[]) => {
  if (!tools || tools.length === 0) return [];
  // Base ROI values - can be adjusted for more variability
  const baseRois = [75, 60, 90, 80, 70, 85]; 
  return tools.map((tool, index) => ({
    name: tool.toolName,
    // Use tool score to influence ROI slightly, add some randomness
    roi: Math.min(100, Math.max(20, baseRois[index % baseRois.length] + Math.floor(tool.score / 10) - 5 + Math.floor(Math.random() * 10))),
  }));
};


export function ROIChart({ recommendedTools }: ROIChartProps) {
  const chartData = generateMockRoiData(recommendedTools);

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-headline">
            <TrendingUp className="h-6 w-6 text-primary" />
            ROI Comparison
          </CardTitle>
          <CardDescription>Potential Return on Investment for recommended tools.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available to display ROI chart. Please get recommendations first.</p>
        </CardContent>
      </Card>
    );
  }
  
  const chartConfig = {} as ChartConfig;
  chartData.forEach((tool, index) => {
    chartConfig[tool.name] = {
      label: tool.name,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
  });


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
          <TrendingUp className="h-6 w-6 text-primary" />
          ROI Comparison
        </CardTitle>
        <CardDescription>Potential Return on Investment for recommended tools (Simulated Data).</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="hsl(var(--foreground))" fontSize={12} />
              <YAxis unit="%" tickLine={false} axisLine={false} stroke="hsl(var(--foreground))" fontSize={12} />
              <RechartsTooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="roi" radius={4}>
                {chartData.map((entry, index) => (
                    <rect key={`cell-${index}`} fill={chartConfig[entry.name]?.color || `hsl(var(--chart-${(index % 5) + 1}))`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
