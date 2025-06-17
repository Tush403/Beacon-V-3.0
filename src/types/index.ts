import type { RecommendToolsInput as GenkitRecommendToolsInput, RecommendToolsOutput, GenerateToolAnalysisOutput } from '@/ai/flows/recommend-tools';

export interface ToolRecommendationItem extends RecommendToolsOutput['recommendations'][0] {}

export interface ToolAnalysisItem extends GenerateToolAnalysisOutput {}

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

// Updated FilterCriteria
export interface FilterCriteria {
  complexityMedium: number;
  complexityHigh: number;
  complexityHighlyComplex: number;
  useStandardFramework: boolean;
  cicdPipelineIntegrated: boolean;
  qaTeamSize: number;
}

// This type is used by the AI flow, ensure it matches the new FilterCriteria structure if it's intended to be the same.
// For now, GenkitRecommendToolsInput is defined in the flow itself.
// If FilterCriteria is meant to be the same as RecommendToolsInput, then this re-export might be needed or schema updated.
// For clarity, we'll assume FilterCriteria is the UI-side representation and the flow will adapt.
export type RecommendToolsInput = GenkitRecommendToolsInput;
