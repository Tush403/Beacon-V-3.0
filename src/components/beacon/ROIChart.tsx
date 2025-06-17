
'use client';

import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, Label } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import type { ToolRecommendationItem } from '@/types';

interface ROIChartProps {
  recommendedTools: ToolRecommendationItem[];
}

const generateMockRoiData = (tools: ToolRecommendationItem[]) => {
  if (!tools || tools.length === 0) return [];
  const months = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'];
  
  const baseStartRois = [50, 45, 40, 55, 48, 60]; // More base ROIs
  const growthFactors = [5, 6, 4.5, 5.5, 4, 6.5]; // More growth factors

  const data = months.map((monthLabel, monthIndex) => {
    const monthData: { month: string; [toolName: string]: number | string } = { month: monthLabel };
    tools.forEach((tool, toolIndex) => {
      const startRoi = baseStartRois[toolIndex % baseStartRois.length];
      const growth = growthFactors[toolIndex % growthFactors.length];
      const scoreInfluence = (tool.score / 100) * 10; // Score can influence up to 10 ROI points
      
      let currentRoi = startRoi + (monthIndex * growth) + scoreInfluence + (Math.random() * 6 - 3); // Add some randomness
      currentRoi = Math.min(100, Math.max(0, currentRoi)); // Clamp between 0 and 100
      monthData[tool.toolName] = Math.round(currentRoi);
    });
    return monthData;
  });
  return data;
};


export function ROIChart({ recommendedTools }: ROIChartProps) {
  const chartData = generateMockRoiData(recommendedTools);

  const chartConfig = {} as ChartConfig;
  recommendedTools.forEach((tool, index) => {
    chartConfig[tool.toolName] = {
      label: tool.toolName,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
  });

  if (!chartData || chartData.length === 0 || recommendedTools.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-headline">
            <TrendingUp className="h-6 w-6 text-primary" />
            ROI Projection Comparison
          </CardTitle>
          <CardDescription>Projected Return on Investment (ROI) for the selected tools over 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available to display ROI chart. Please get recommendations first.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
          <TrendingUp className="h-6 w-6 text-primary" />
          ROI Projection Comparison
        </CardTitle>
        <CardDescription>Projected Return on Investment (ROI) for the selected tools over 6 months. (Simulated Data)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                ticks={['M1', 'M3', 'M6']} 
                interval={0} 
                tickLine={false} 
                axisLine={false} 
                stroke="hsl(var(--foreground))" 
                fontSize={12}
              >
                <Label value="Month" position="insideBottom" dy={15} fill="hsl(var(--foreground))" fontSize={12} />
              </XAxis>
              <YAxis 
                unit="%" 
                domain={[0, 100]} 
                tickLine={false} 
                axisLine={false} 
                stroke="hsl(var(--foreground))" 
                fontSize={12}
              >
                 <Label value="ROI (%)" angle={-90} position="insideLeft" dx={-5} fill="hsl(var(--foreground))" fontSize={12} />
              </YAxis>
              <RechartsTooltip
                cursor={{ stroke: 'hsl(var(--primary))', strokeDasharray: '3 3' }}
                content={<ChartTooltipContent 
                  formatter={(value) => `${value}%`} 
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0 && payload[0].payload.month) {
                       // Format M1 to Month 1 etc.
                      const monthNum = payload[0].payload.month.substring(1);
                      return `Month ${monthNum}`;
                    }
                    return label;
                  }}
                />}
              />
              <Legend content={<ChartLegendContent iconType="circle" />} verticalAlign="bottom" wrapperStyle={{paddingTop: "25px"}} />
              {recommendedTools.map((tool) => (
                <Line
                  key={tool.toolName}
                  type="monotone"
                  dataKey={tool.toolName}
                  stroke={chartConfig[tool.toolName]?.color}
                  strokeWidth={2.5}
                  activeDot={{ r: 6, strokeWidth: 0, fill: chartConfig[tool.toolName]?.color }}
                  dot={{ r: 4, fill: 'hsl(var(--background))', stroke: chartConfig[tool.toolName]?.color, strokeWidth: 2 }}
                  name={tool.toolName}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

