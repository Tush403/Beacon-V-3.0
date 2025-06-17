
// src/ai/flows/recommend-tools.ts
'use server';
/**
 * @fileOverview AI-powered tool recommendation flow.
 *
 * This file defines a Genkit flow that recommends the top 3 test automation tools
 * based on user-provided filter criteria.
 *
 * @module src/ai/flows/recommend-tools
 *
 * @exports recommendTools - A function that initiates the tool recommendation process.
 * @exports RecommendToolsInputSchema - The Zod schema for the input.
 * @exports RecommendToolsInput - The input type for the recommendTools function.
 * @exports RecommendToolsOutput - The return type for the recommendTools function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Updated input schema for the new "Filter Tools"
export const RecommendToolsInputSchema = z.object({
  applicationUnderTest: z.string().describe('The type of application to be tested (e.g., "Web Applications", "Mobile Applications", "API", "All Applications").'),
  testType: z.string().describe('The type of testing to be performed (e.g., "UI Testing", "API Testing", "Performance Testing", "All Test Types").'),
  operatingSystem: z.string().describe('The target operating system (e.g., "Windows", "MacOS", "Linux", "All OS").'),
  codingRequirement: z.string().describe('The level of coding required (e.g., "Codeless", "Low Code", "Scripting Heavy", "Any Requirement").'),
  codingLanguage: z.string().describe('The preferred coding language if scripting is involved (e.g., "JavaScript", "Python", "Java", "Any Language").'),
  pricingModel: z.string().describe('The preferred pricing model for the tool (e.g., "Open Source", "Subscription", "Perpetual License", "Any Model").'),
  reportingAnalytics: z.string().describe('The required level of reporting and analytics capabilities (e.g., "Basic Reporting", "Advanced Analytics", "Dashboard Integration", "Any Analytics").'),
});
export type RecommendToolsInput = z.infer<typeof RecommendToolsInputSchema>;

const ToolRecommendationSchema = z.object({
  toolName: z.string().describe('The name of the recommended tool.'),
  score: z.number().describe('A score indicating the suitability of the tool (0-100).'),
  justification: z.string().describe('Explanation of why the tool is a good fit based on provided filter criteria.'),
});

const RecommendToolsOutputSchema = z.object({
  recommendations: z.array(ToolRecommendationSchema).length(3).describe('The top 3 AI-recommended tools with detailed scores.'),
});
export type RecommendToolsOutput = z.infer<typeof RecommendToolsOutputSchema>;

export async function recommendTools(input: RecommendToolsInput): Promise<RecommendToolsOutput> {
  return recommendToolsFlow(input);
}

const recommendToolsPrompt = ai.definePrompt({
  name: 'recommendToolsPrompt',
  input: {schema: RecommendToolsInputSchema},
  output: {schema: RecommendToolsOutputSchema},
  prompt: `You are an AI-powered tool recommendation engine for test automation.

  Based on the following criteria, recommend the top 3 test automation tools.
  Explain why each tool is a good fit based on the criteria, and provide a score between 0 and 100.

  Criteria:
  Application Under Test: {{{applicationUnderTest}}}
  Test Type: {{{testType}}}
  Operating System: {{{operatingSystem}}}
  Coding Requirement: {{{codingRequirement}}}
  Coding Language: {{{codingLanguage}}}
  Pricing Model: {{{pricingModel}}}
  Reporting & Analytics Capabilities: {{{reportingAnalytics}}}

  If a criterion is set to 'all', 'any', or a generic placeholder like 'All Applications', consider it as not a strong preference or applicable to all options for that category.
  Focus on tools that best match the specified criteria.

  Format your response as a JSON object with a "recommendations" array.
  Each entry in the array should include "toolName", "score", and "justification" fields.
`,
});

const recommendToolsFlow = ai.defineFlow(
  {
    name: 'recommendToolsFlow',
    inputSchema: RecommendToolsInputSchema,
    outputSchema: RecommendToolsOutputSchema,
  },
  async input => {
    const {output} = await recommendToolsPrompt(input);
    return output!;
  }
);
