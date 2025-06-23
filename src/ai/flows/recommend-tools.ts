
// src/ai/flows/recommend-tools.ts
'use server';
/**
 * @fileOverview AI-powered tool recommendation flow.
 *
 * This file defines a Genkit flow that recommends the top 3 test automation tools
 * based on user-provided filter criteria, including advanced options.
 *
 * @module src/ai/flows/recommend-tools
 *
 * @exports recommendTools - A function that initiates the tool recommendation process.
 * @exports RecommendToolsInput - The input type for the recommendTools function.
 * @exports RecommendToolsOutput - The return type for the recommendTools function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { RecommendToolsInput } from '@/types'; // Import the type
import { RecommendToolsInputSchema } from '@/types'; // Import the schema

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

  Based on the following criteria, recommend the top 3 DISTINCT test automation tools. Ensure each recommended tool is unique.
  Explain why each tool is a good fit based on the criteria, and provide a score between 0 and 100.
  Your response MUST contain exactly three recommendations for three different tools.

  Criteria:
  Application Under Test: {{{applicationUnderTest}}}
  Test Type: {{{testType}}}
  Operating System: {{{operatingSystem}}}
  Coding Requirement: {{{codingRequirement}}}
  Coding Language: {{{codingLanguage}}}
  Pricing Model: {{{pricingModel}}}
  Reporting & Analytics Capabilities: {{{reportingAnalytics}}}

  {{#if applicationSubCategory}}Advanced - Application Sub-Category: {{{applicationSubCategory}}}{{/if}}
  {{#if integrationCapabilities}}Advanced - Integration Capabilities: {{{integrationCapabilities}}}{{/if}}
  {{#if teamSizeSuitability}}Advanced - Team Size Suitability: {{{teamSizeSuitability}}}{{/if}}
  {{#if keyFeatureFocus}}Advanced - Key Feature Focus: {{{keyFeatureFocus}}}{{/if}}

  Consider the following tool profiles when making recommendations:
  **Tool: ZeTA Automation**
  - Best for: Enterprise-level projects needing unified testing across UI, API, DB, and Security.
  - Application Under Test: Web, API, Desktop
  - Test Type: UI, API, Security, Performance, Integration
  - Operating System: Cross-platform
  - Coding Requirement: Scripting Heavy
  - Coding Language: Java
  - Pricing Model: Open Source
  - Key Features: High reusability, config-driven design, CI-ready, broad coverage.

  **Tool: Functionize**
  - Best for: Teams looking for rapid test creation and low maintenance through AI.
  - Application Under Test: Web Applications, Web Automation
  - Test Type: UI, End-to-End, Regression
  - Operating System: Cross-platform (Cloud-based)
  - Coding Requirement: Low Code, AI/ML
  - Coding Language: N/A
  - Pricing Model: Subscription-based
  - Key Features: AI-powered test creation and maintenance, Self-healing tests, Cloud execution.
  
  **Tool: Postman**
  - Best for: API development and testing, from individual developers to large teams.
  - Application Under Test: API
  - Test Type: API, Integration
  - Operating System: Cross-platform
  - Coding Requirement: Low Code to Scripting Heavy
  - Coding Language: JavaScript
  - Pricing Model: Freemium, Subscription-based
  - Key Features: Powerful request builder, test scripting, collection runner, mock servers, monitoring.

  If a criterion is set to 'all', 'any', a generic placeholder like 'All Applications', or is not provided, consider it as not a strong preference or applicable to all options for that category.
  Focus on tools that best match the specified criteria. If advanced criteria are provided, give them significant weight.
  When 'API Testing' is selected, you should strongly consider tools like Postman, ZeTA Automation, and others known for robust API capabilities.

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
