
'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import type { ToolRecommendationItem, ToolAnalysisItem, DocumentationLink, EstimateEffortOutput } from '@/types';
import { Lightbulb, AlertTriangle, Compass, Calculator, X, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { ToolCard } from './ToolCard';
import { ToolDetailsDialog } from './ToolDetailsDialog';

interface RecommendationsDisplayProps {
  recommendations: ToolRecommendationItem[];
  toolAnalyses: Record<string, ToolAnalysisItem | null>;
  onGetAnalysis: (toolName: string) => void;
  isLoadingRecommendations: boolean;
  isLoadingAnalysis: Record<string, boolean>;
  error?: string | null;
  hasInteracted: boolean;
  estimationResult: EstimateEffortOutput | null;
  onClearEstimation: () => void;
}

const toolDocumentationLinks: Record<string, DocumentationLink> = {
  'Functionize': { toolName: 'Functionize', url: 'https://www.functionize.com/', label: 'Visit Official Website' },
  'ZeTA Automation': { toolName: 'ZeTA Automation', url: 'https://www.taodigitalsolutions.com/zeta', label: 'Visit Official Website' },
  'Selenium': { toolName: 'Selenium', url: 'https://www.selenium.dev/', label: 'Visit Official Website' },
  'TestComplete': { toolName: 'TestComplete', url: 'https://smartbear.com/testcomplete/', label: 'Visit Official Website' },
  'Ranorex Studio': { toolName: 'Ranorex Studio', url: 'https://www.ranorex.com/', label: 'Visit Official Website' },
  'WinAppDriver': { toolName: 'WinAppDriver', url: 'https://github.com/microsoft/WinAppDriver', label: 'Visit Official Website' },
  'Cypress': { toolName: 'Cypress', url: 'https://www.cypress.io/', label: 'Visit Official Website' },
  'Playwright': { toolName: 'Playwright', url: 'https://playwright.dev/', label: 'Visit Official Website' },
  'Postman': { toolName: 'Postman', url: 'https://www.postman.com/', label: 'Visit Official Website' },
  'ACCELQ': { toolName: 'ACCELQ', url: 'https://www.accelq.com/', label: 'Visit Official Website' },
  'Appium': { toolName: 'Appium', url: 'https://appium.io/', label: 'Visit Official Website' },
  'Applitools': { toolName: 'Applitools', url: 'https://applitools.com/', label: 'Visit Official Website' },
  'BrowserStack Automate': { toolName: 'BrowserStack Automate', url: 'https://www.browserstack.com/automate', label: 'Visit Official Website' },
  'Cucumber': { toolName: 'Cucumber', url: 'https://cucumber.io/', label: 'Visit Official Website' },
  'Detox': { toolName: 'Detox', url: 'https://github.com/wix/Detox', label: 'Visit Official Website' },
  'Eggplant': { toolName: 'Eggplant', url: 'https://eggplant.keysight.com/', label: 'Visit Official Website' },
  'Espresso': { toolName: 'Espresso', url: 'https://developer.android.com/training/testing/espresso', label: 'Visit Official Website' },
  'Gatling': { toolName: 'Gatling', url: 'https://gatling.io/', label: 'Visit Official Website' },
  'Gauge': { toolName: 'Gauge', url: 'https://gauge.org/', label: 'Visit Official Website' },
  'Ghost Inspector': { toolName: 'Ghost Inspector', url: 'https://ghostinspector.com/', label: 'Visit Official Website' },
  'Grafana k6': { toolName: 'Grafana k6', url: 'https://k6.io/', label: 'Visit Official Website' },
  'JMeter': { toolName: 'JMeter', url: 'https://jmeter.apache.org/', label: 'Visit Official Website' },
  'Karate DSL': { toolName: 'Karate DSL', url: 'https://github.com/karatelabs/karate', label: 'Visit Official Website' },
  'Katalon Studio': { toolName: 'Katalon Studio', url: 'https://katalon.com/', label: 'Visit Official Website' },
  'Kobiton': { toolName: 'Kobiton', url: 'https://kobiton.com/', label: 'Visit Official Website' },
  'LambdaTest': { toolName: 'LambdaTest', url: 'https://www.lambdatest.com/', label: 'Visit Official Website' },
  'Leapwork': { toolName: 'Leapwork', url: 'https://www.leapwork.com/', label: 'Visit Official Website' },
  'Mabl': { toolName: 'Mabl', url: 'https://www.mabl.com/', label: 'Visit Official Website' },
  'Micro Focus UFT One': { toolName: 'Micro Focus UFT One', url: 'https://www.microfocus.com/en-us/products/uft-one/overview', label: 'Visit Official Website' },
  'Newman': { toolName: 'Newman', url: 'https://github.com/postmanlabs/newman', label: 'Visit Official Website' },
  'Perfecto': { toolName: 'Perfecto', url: 'https://www.perfecto.io/', label: 'Visit Official Website' },
  'Percy': { toolName: 'Percy', url: 'https://percy.io/', label: 'Visit Official Website' },
  'Puppeteer': { toolName: 'Puppeteer', url: 'https://pptr.dev/', label: 'Visit Official Website' },
  'Ranorex': { toolName: 'Ranorex', url: 'https://www.ranorex.com/', label: 'Visit Official Website' },
  'Reflect': { toolName: 'Reflect', url: 'https://reflect.run/', label: 'Visit Official Website' },
  'Rest Assured': { toolName: 'Rest Assured', url: 'https://rest-assured.io/', label: 'Visit Official Website' },
  'Robot Framework': { toolName: 'Robot Framework', url: 'https://robotframework.org/', label: 'Visit Official Website' },
  'Sahi Pro': { toolName: 'Sahi Pro', url: 'https://sahipro.com/', label: 'Visit Official Website' },
  'Sauce Labs': { toolName: 'Sauce Labs', url: 'https://saucelabs.com/', label: 'Visit Official Website' },
  'SoapUI': { toolName: 'SoapUI', url: 'https://www.soapui.org/', label: 'Visit Official Website' },
  'SpecFlow': { toolName: 'SpecFlow', url: 'https://specflow.org/', label: 'Visit Official Website' },
  'TestCafe': { toolName: 'TestCafe', url: 'https://testcafe.io/', label: 'Visit Official Website' },
  'Testim': { toolName: 'Testim', url: 'https://www.testim.io/', label: 'Visit Official Website' },
  'TestSigma': { toolName: 'TestSigma', url: 'https://testsigma.com/', label: 'Visit Official Website' },
  'Tricentis Tosca': { toolName: 'Tricentis Tosca', url: 'https://www.tricentis.com/products/tosca-automated-testing', label: 'Visit Official Website' },
  'WebdriverIO': { toolName: 'WebdriverIO', url: 'https://webdriver.io/', label: 'Visit Official Website' },
  'XCUITest': { toolName: 'XCUITest', url: 'https://developer.apple.com/documentation/xctest', label: 'Visit Official Website' },
};


export function RecommendationsDisplay({
  recommendations,
  toolAnalyses,
  onGetAnalysis,
  isLoadingRecommendations,
  isLoadingAnalysis,
  error,
  hasInteracted,
  estimationResult,
  onClearEstimation,
}: RecommendationsDisplayProps) {
  const [selectedToolName, setSelectedToolName] = useState<string | null>(null);
  const [detailsToolName, setDetailsToolName] = useState<string | null>(null);

  const sortedRecommendations = [...recommendations].sort((a, b) => b.score - a.score);

  useEffect(() => {
    if (sortedRecommendations.length > 0 && !selectedToolName) {
      const topToolName = sortedRecommendations[0].toolName;
      setSelectedToolName(topToolName);
      if (!toolAnalyses[topToolName]) {
        onGetAnalysis(topToolName);
      }
    } else if (sortedRecommendations.length > 0 && selectedToolName && !sortedRecommendations.some(r => r.toolName === selectedToolName)) {
      // If the selected tool is no longer in the recommendations, default to the first one
      const topToolName = sortedRecommendations[0].toolName;
      setSelectedToolName(topToolName);
      if (!toolAnalyses[topToolName]) {
        onGetAnalysis(topToolName);
      }
    } else if (sortedRecommendations.length === 0) {
      setSelectedToolName(null);
    }
  }, [sortedRecommendations, selectedToolName, toolAnalyses, onGetAnalysis]);

  if (isLoadingRecommendations) {
    return null; // The global loader handles this
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

  if (estimationResult) {
    return (
       <Card className="shadow-lg animate-in fade-in-50 duration-500">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-headline text-foreground">
              <Calculator className="h-6 w-6 text-foreground" />
              AI Effort Estimation Result
            </CardTitle>
            <CardDescription>
              Confidence Score: <span className="font-semibold text-foreground">{estimationResult.confidenceScore}%</span>
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClearEstimation}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close Estimation</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Estimated Effort</p>
            <p className="text-4xl font-bold text-primary">{estimationResult.estimatedEffortDays}</p>
            <p className="text-sm text-muted-foreground">Days</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-base">Explanation</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line border bg-muted/20 p-3 rounded-md">
              {estimationResult.explanation}
            </p>
          </div>
        </CardContent>
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
    return (
        <div className="mt-8 text-center py-8">
            <Lightbulb className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-muted-foreground">Ready to Discover?</h3>
            <p className="text-sm text-muted-foreground">Use the filters to find your ideal test automation tools.</p>
        </div>
    );
  }

  const selectedTool = sortedRecommendations.find(r => r.toolName === selectedToolName) || sortedRecommendations[0];

  const handleViewDetails = (toolName: string) => {
    setDetailsToolName(toolName);
  };

  return (
    <>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-headline text-foreground">
              <Star className="h-6 w-6 text-foreground" />
              Top Recommended Tools
            </CardTitle>
            <CardDescription>
              Click on a tool to see more details. Results are sorted by overall score.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-1 rounded-lg bg-muted p-1 mb-4">
              {sortedRecommendations.map((tool) => (
                <button
                  key={tool.toolName}
                  onClick={() => {
                    setSelectedToolName(tool.toolName);
                    if (!toolAnalyses[tool.toolName]) {
                      onGetAnalysis(tool.toolName);
                    }
                  }}
                  className={cn(
                    "w-full rounded-md py-2 px-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selectedToolName === tool.toolName
                      ? "bg-gradient-from text-primary-foreground shadow hover:bg-gradient-from/90"
                      : "text-muted-foreground hover:bg-background/50"
                  )}
                >
                  {tool.toolName} - {(tool.score / 10).toFixed(1)}/10
                </button>
              ))}
            </div>

            <ToolCard
              tool={selectedTool}
              analysis={toolAnalyses[selectedTool.toolName]}
              docLink={toolDocumentationLinks[selectedTool.toolName]}
              isAnalysisLoading={!!isLoadingAnalysis[selectedTool.toolName]}
              onViewDetails={handleViewDetails}
            />

          </CardContent>
        </Card>
      </div>
      <ToolDetailsDialog
        isOpen={!!detailsToolName}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDetailsToolName(null);
          }
        }}
        toolName={detailsToolName}
      />
    </>
  );
}
