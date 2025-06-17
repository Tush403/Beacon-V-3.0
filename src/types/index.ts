import type { RecommendToolsOutput, GenerateToolAnalysisOutput } from '@/ai/flows/recommend-tools';

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

export interface FilterCriteria {
  applicationType: string;
  os: string;
  testType: string;
  codingNeeds: string;
}
