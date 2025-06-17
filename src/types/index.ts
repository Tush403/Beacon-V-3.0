
import type { RecommendToolsOutput } from '@/ai/flows/recommend-tools';
import { z } from 'genkit'; // Import z from genkit

export type ToolRecommendationItem = RecommendToolsOutput['recommendations'][0];

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
  toolName:string;
  url: string;
  label: string;
}

// Define the Zod schema for filter criteria here
export const RecommendToolsInputSchema = z.object({
  applicationUnderTest: z.string().describe('The type of application to be tested (e.g., "Web Applications", "Mobile Applications", "API", "All Applications").'),
  testType: z.string().describe('The type of testing to be performed (e.g., "UI Testing", "API Testing", "Performance Testing", "All Test Types").'),
  operatingSystem: z.string().describe('The target operating system (e.g., "Windows", "MacOS", "Linux", "All OS").'),
  codingRequirement: z.string().describe('The level of coding required (e.g., "Codeless", "Low Code", "Scripting Heavy", "Any Requirement").'),
  codingLanguage: z.string().describe('The preferred coding language if scripting is involved (e.g., "JavaScript", "Python", "Java", "Any Language").'),
  pricingModel: z.string().describe('The preferred pricing model for the tool (e.g., "Open Source", "Subscription", "Perpetual License", "Any Model").'),
  reportingAnalytics: z.string().describe('The required level of reporting and analytics capabilities (e.g., "Basic Reporting", "Advanced Analytics", "Dashboard Integration", "Any Analytics").'),
  
  // AI Effort Estimator Fields (also part of RecommendToolsInput as they are on the same form)
  automationTool: z.string().optional().describe('Selected automation tool for effort estimation.'),
  complexityLow: z.number().optional().describe('Number of low complexity test cases.'),
  complexityMedium: z.number().optional().describe('Number of medium complexity test cases.'),
  complexityHigh: z.number().optional().describe('Number of high complexity test cases.'),
  complexityHighlyComplex: z.number().optional().describe('Number of highly complex test cases.'),
  useStandardFramework: z.boolean().optional().describe('Whether a standard test framework is in use.'),
  cicdPipelineIntegrated: z.boolean().optional().describe('Whether CI/CD pipeline is integrated.'),
  qaTeamSize: z.number().optional().describe('Size of the QA team in engineers.'),
});

// This ensures that RecommendToolsInput is exactly what the flow expects.
export type RecommendToolsInput = z.infer<typeof RecommendToolsInputSchema>;

// This type is used by generateToolAnalysisAction
export interface GenerateToolAnalysisInput {
  toolName: string;
}

// Keep FilterCriteria as an alias or separate interface if used directly by UI components
// and ensure it aligns with RecommendToolsInput.
export interface FilterCriteria extends RecommendToolsInput {}


// Schema for AI Effort Estimation
export const EstimateEffortInputSchema = z.object({
  automationTool: z.string().optional().describe('The name of the automation tool being considered or used. Can be "None" or "Undecided".'),
  complexityLow: z.number().optional().default(0).describe('Number of low complexity test cases.'),
  complexityMedium: z.number().optional().default(0).describe('Number of medium complexity test cases.'),
  complexityHigh: z.number().optional().default(0).describe('Number of high complexity test cases.'),
  complexityHighlyComplex: z.number().optional().default(0).describe('Number of highly complex test cases.'),
  useStandardFramework: z.boolean().optional().default(false).describe('Is a standard, well-defined test automation framework being used? (e.g., Page Object Model, BDD framework)'),
  cicdPipelineIntegrated: z.boolean().optional().default(false).describe('Is the test automation integrated into a CI/CD pipeline?'),
  qaTeamSize: z.number().optional().default(0).describe('Number of QA engineers available for the automation effort.'),
  projectDescription: z.string().optional().describe('A brief description of the project or features to be automated.'),
});
export type EstimateEffortInput = z.infer<typeof EstimateEffortInputSchema>;

export const EstimateEffortOutputSchema = z.object({
  estimatedEffortDaysMin: z.number().describe('The minimum estimated effort in person-days.'),
  estimatedEffortDaysMax: z.number().describe('The maximum estimated effort in person-days.'),
  explanation: z.string().describe('A brief explanation of how the estimate was derived, including key factors considered.'),
  confidenceScore: z.number().min(0).max(100).optional().describe('A score (0-100) indicating the confidence in this estimate.'),
});
export type EstimateEffortOutput = z.infer<typeof EstimateEffortOutputSchema>;
