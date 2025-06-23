
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

  **Tool: TestComplete**
  - Best for: Teams that need to automate UI tests for a wide range of desktop, web, and mobile technologies.
  - Application Under Test: Desktop, Web, Mobile
  - Test Type: UI, Keyword-driven, Data-driven
  - Operating System: Windows
  - Coding Requirement: Low Code & Scripting
  - Coding Language: JavaScript, Python, VBScript, JScript, DelphiScript, C++Script, C#Script
  - Pricing Model: Perpetual License / Subscription
  - Key Features: AI-powered object recognition, record-and-playback, keyword-driven testing, cross-browser and device testing.

  **Tool: Ranorex Studio**
  - Best for: End-to-end testing of desktop, web, and mobile applications with a powerful object recognition engine.
  - Application Under Test: Desktop, Web, Mobile
  - Test Type: UI, End-to-End, Regression
  - Operating System: Windows (for test creation), can test cross-platform.
  - Coding Requirement: Low Code & Scripting
  - Coding Language: C#, VB.NET
  - Pricing Model: Perpetual License / Subscription
  - Key Features: Codeless test creation, record-and-playback, powerful object spy, integrates with CI/CD.

  **Tool: WinAppDriver (Windows Application Driver)**
  - Best for: Automating native Windows (UWP, WinForms, WPF) applications on Windows 10/11.
  - Application Under Test: Desktop
  - Test Type: UI, Regression
  - Operating System: Windows
  - Coding Requirement: Scripting Heavy
  - Coding Language: C#, Java, Python, JavaScript (via WebdriverIO)
  - Pricing Model: Open Source
  - Key Features: Microsoft-supported, based on WebDriver protocol, integrates with Appium.

  If a criterion is set to 'all', 'any', a generic placeholder like 'All Applications', or is not provided, consider it as not a strong preference or applicable to all options for that category.
  Focus on tools that best match the specified criteria. If advanced criteria are provided, give them significant weight.
  When 'API Testing' is selected, you should strongly consider tools like ZeTA Automation and others known for robust API capabilities.
  When 'Desktop Applications' is selected as the Application Under Test, you MUST prioritize tools with strong desktop capabilities like ZeTA Automation, WinAppDriver, Ranorex Studio, and TestComplete.

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
