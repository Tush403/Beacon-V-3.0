
import type { RecommendToolsOutput } from '@/ai/flows/recommend-tools';
import type { z } from 'genkit';
// Import the schema directly to avoid circular dependencies if RecommendToolsInput was also here
import type { RecommendToolsInputSchema } from '@/ai/flows/recommend-tools'; 

export interface ToolRecommendationItem extends RecommendToolsOutput['recommendations'][0] {}

// Make sure this matches GenerateToolAnalysisOutput from its flow
export interface ToolAnalysisItem {
  strengths: string;
  weaknesses: string;
}


export interface ProjectEffort {
  toolName: string;
  effortDaysMin: number;
  effortDaysMax: number;
  assumptions: string[];
}

export interface Trend {
  category: string;
  description: string;
  popularTools: string[];
  emergingTools: string[];
  icon?: React.ElementType;
}

export interface DocumentationLink {
  toolName: string;
  url: string;
  label: string;
}

// Updated FilterCriteria to match the new "Filter Tools" section
export interface FilterCriteria {
  applicationUnderTest: string;
  testType: string;
  operatingSystem: string;
  codingRequirement: string;
  codingLanguage: string;
  pricingModel: string;
  reportingAnalytics: string;
}

// This ensures that RecommendToolsInput is exactly what the flow expects.
export type RecommendToolsInput = z.infer<typeof RecommendToolsInputSchema>;

// This type is used by generateToolAnalysisAction
export interface GenerateToolAnalysisInput {
  toolName: string;
}
