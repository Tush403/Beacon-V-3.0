
import type { RecommendToolsOutput } from '@/ai/flows/recommend-tools';
import { z } from 'genkit'; // Import z from genkit

export type ToolRecommendationItem = RecommendToolsOutput['recommendations'][0];

// Make sure this matches GenerateToolAnalysisOutput from its flow
export interface ToolAnalysisItem {
  toolName?: string; // Optional: AI can return it, or we use searchTerm
  strengths: string;
  weaknesses: string;
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
  
  // Advanced Filters
  applicationSubCategory: z.string().optional().describe('Specific sub-category or industry for the application under test (e.g., "E-commerce", "Healthcare", "Fintech", "Any").'),
  integrationCapabilities: z.string().optional().describe('Key integration capabilities required (e.g., "Jira", "Jenkins/CI-CD", "Test Management Tools", "Any").'),
  teamSizeSuitability: z.string().optional().describe('The size of the team that will be using the tool (e.g., "Small Team (2-10)", "Enterprise (>200)", "Any").'),
  keyFeatureFocus: z.string().optional().describe('A specific key feature or testing focus area (e.g., "Visual Regression Testing", "BDD Support", "AI-assisted Scripting", "Any").'),

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
  estimatedEffortDays: z.number().describe('A precise estimated effort in person-days.'),
  explanation: z.string().describe('A brief explanation of how the estimate was derived, including key factors considered.'),
  confidenceScore: z.number().min(90).max(100).describe('A score (90-100) indicating the confidence in this estimate.'),
});
export type EstimateEffortOutput = z.infer<typeof EstimateEffortOutputSchema>;

// Output schema for generateToolAnalysisFlow - ensure it matches the flow
export const GenerateToolAnalysisOutputSchema = z.object({
  toolName: z.string().optional().describe('The name of the tool that was analyzed. May be returned by AI if it differs from input or for confirmation.'),
  strengths: z.string().describe('The strengths of the tool.'),
  weaknesses: z.string().describe('The weaknesses of the tool.'),
});
export type GenerateToolAnalysisOutput = z.infer<typeof GenerateToolAnalysisOutputSchema>;


// Schemas for Get Tool Details (for the search dialog)
export const GetToolDetailsInputSchema = z.object({
    toolName: z.string().describe('The name of the tool to get details for.'),
});
export type GetToolDetailsInput = z.infer<typeof GetToolDetailsInputSchema>;

export const ToolDetailCriterionSchema = z.object({
    criterionName: z.string().describe("The name of the detail criterion (e.g., 'Initial Setup Time')."),
    value: z.string().describe("The value or assessment for that criterion."),
});

export const GetToolDetailsOutputSchema = z.object({
    toolName: z.string().describe('The official name of the tool.'),
    overview: z.string().describe('A brief, 1-2 sentence overview of the tool.'),
    details: z.array(ToolDetailCriterionSchema).describe('An array of detailed criteria and their corresponding values for the tool.'),
});
export type GetToolDetailsOutput = z.infer<typeof GetToolDetailsOutputSchema>;


// Schemas for Tool Comparison
export const CompareToolsInputSchema = z.object({
  toolNames: z.array(z.string()).min(2).max(3).describe('An array of 2 to 3 tool names to compare.'),
});
export type CompareToolsInput = z.infer<typeof CompareToolsInputSchema>;

// Internal Zod schemas for what the AI will generate for comparison (array-based for toolValues)
const AIToolValueSchema = z.object({
  toolName: z.string().describe("The exact tool name."),
  value: z.string().describe("The comparison text for this tool for this specific criterion."),
});

const AIComparisonCriterionSchema = z.object({
  criterionName: z.string().describe("The name of the comparison criterion (e.g., 'Ease of Use', 'Key Features')."),
  toolValues: z.array(AIToolValueSchema).describe("An array of objects, each providing the comparison text for a specific tool under this criterion."),
});

const AIToolOverviewSchema = z.object({
    toolName: z.string().describe("The exact tool name."),
    overview: z.string().describe("The 1-2 sentence overview for this tool."),
});

// This is what the AI *generates*
const AICompareToolsOutputSchema = z.object({
  comparisonTable: z.array(AIComparisonCriterionSchema).describe("An array of criteria, where each criterion contains an array of tool-specific comparison details."),
  toolOverviews: z.array(AIToolOverviewSchema).optional().describe("Optional: An array of objects, each containing a tool name and its overview."),
});


// This is what the *application* uses (Record-based for toolValues and toolOverviews)
export const ComparisonCriterionSchema = z.object({
  criterionName: z.string().describe("The name of the comparison criterion (e.g., 'Ease of Use', 'Key Features', 'Primary Use Case', 'Strengths', 'Weaknesses', 'Pricing Model', 'Community Support', 'Best For')."),
  toolValues: z.record(z.string(), z.string().describe("The comparison details for this tool regarding this specific criterion. The text should be concise and suitable for a table cell.")),
});
export type ComparisonCriterion = z.infer<typeof ComparisonCriterionSchema>;

export const CompareToolsOutputSchema = z.object({
  comparisonTable: z.array(ComparisonCriterionSchema).describe("An array of criteria, where each criterion contains a mapping of tool names to their respective comparison details for that criterion."),
  toolOverviews: z.record(z.string(), z.string()).optional().describe("Optional: A brief 1-2 sentence overview for each compared tool. For each tool name key present in this object, the value must be a non-empty string overview."),
});
export type CompareToolsOutput = z.infer<typeof CompareToolsOutputSchema>;

export type { AICompareToolsOutput }; // Export internal AI type if needed by flow

// Schemas for Support Chatbot
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const SupportChatInputSchema = z.object({
  messages: z.array(ChatMessageSchema).describe('The history of the conversation.'),
});
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

export const SupportChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;
