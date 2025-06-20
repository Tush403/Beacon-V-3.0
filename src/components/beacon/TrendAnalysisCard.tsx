
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Activity, Telescope } from 'lucide-react';
import type { Trend } from '@/types';

const mockTrends: Trend[] = [
  {
    category: 'AI in Testing',
    description: 'Increased adoption of AI/ML for test case generation, self-healing tests, and defect triaging.',
    popularTools: ['Testim', 'Applitools', 'Mabl'],
    emergingTools: ['Functionize', 'GenAI Test Data Platforms'],
    icon: Zap,
  },
  {
    category: 'Shift-Left & Shift-Right Testing',
    description: 'Emphasis on earlier testing in the SDLC and continuous monitoring in production environments.',
    popularTools: ['Cypress (Shift-Left)', 'Datadog (Shift-Right)', 'Sentry'],
    emergingTools: ['Observability Platforms with Test Hooks'],
    icon: Activity,
  },
  {
    category: 'Codeless & Low-Code Automation',
    description: 'Growing demand for tools that reduce scripting efforts and empower non-technical testers.',
    popularTools: ['Katalon Studio', 'ACCELQ', 'Tosca'],
    emergingTools: ['Playwright Codegen improvements', 'Visual Test Builders'],
    icon: Telescope,
  },
];

export function TrendAnalysisCard() {
  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline text-foreground">
          <Zap className="h-6 w-6 text-foreground" />
          Testing Trends Overview
        </CardTitle>
        <CardDescription>Insights into popular and emerging trends in test automation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {mockTrends.map((trend) => (
          <div key={trend.category} className="p-4 border border-border rounded-lg bg-card/50">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {trend.icon && <trend.icon className="h-5 w-5 text-accent" />}
              {trend.category}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-3">{trend.description}</p>
            <div className="space-y-2">
              <div>
                <h4 className="text-xs font-medium uppercase text-muted-foreground">Popular Tools:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {trend.popularTools.map((tool) => (
                    <Badge key={tool} variant="secondary">{tool}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-medium uppercase text-muted-foreground">Emerging:</h4>
                 <div className="flex flex-wrap gap-1 mt-1">
                  {trend.emergingTools.map((tool) => (
                    <Badge key={tool} variant="outline" className="border-accent text-accent">{tool}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
