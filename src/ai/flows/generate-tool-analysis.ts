
'use server';

/**
 * @fileOverview A tool analysis AI agent.
 *
 * - generateToolAnalysis - A function that handles the tool analysis process.
 * - GenerateToolAnalysisInput - The input type for the generateToolAnalysis function.
 * - GenerateToolAnalysisOutput - The return type for the generateToolAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateToolAnalysisOutputSchema, type GenerateToolAnalysisInput, type GenerateToolAnalysisOutput } from '@/types'; // Import schema from types

export type { GenerateToolAnalysisInput, GenerateToolAnalysisOutput }; // Re-export from types

// Input schema still simple, just toolName
const GenerateToolAnalysisInputSchema = z.object({
  toolName: z.string().describe('The name of the tool to analyze.'),
});

export async function generateToolAnalysis(input: GenerateToolAnalysisInput): Promise<GenerateToolAnalysisOutput> {
  return generateToolAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateToolAnalysisPrompt',
  input: {schema: GenerateToolAnalysisInputSchema},
  output: {schema: GenerateToolAnalysisOutputSchema}, // Use the imported schema
  prompt: `You are an expert QA lead specializing in test automation tools.

You will analyze the tool and generate a summary of its strengths, weaknesses, primary application types, and primary test types.
Optionally, include the toolName in your output if you perform any normalization or identify a canonical name.

When analyzing "ZeTA Automation", use the following information: It is an open-source, Java-based framework focused on high reusability and unified testing across UI, API, DB, and security. It uses pre-built templates and a config-driven design.
- Strengths: High script reusability\nBroad automation coverage (UI, API, etc.)\nExcellent parallel execution support\nTemplate-based creation speed
- Weaknesses: Requires moderate Java and Maven knowledge\nIncludes the overhead of managing internal open-source infrastructure
- Application Types: Web, API, DB, Security
- Test Types: UI Testing, API Testing, Security Testing

When analyzing "Functionize", use the following information: It is an AI-powered platform for testing modern web applications.
- Strengths: AI-powered self-healing capabilities dramatically reduce test maintenance\nVery fast test creation using natural language\nExcellent for testing highly dynamic applications
- Weaknesses: Can be a 'black box', making complex debugging difficult\nLess granular control compared to code-based frameworks\nSubscription cost may be a factor
- Application Types: Web, API
- Test Types: UI Testing, API Testing, E2E Testing

When analyzing "Playwright", use the following information: It is a framework for Web Testing and Automation.
- Strengths: Reliable end-to-end testing across all modern browsers\nAuto-waits and reliable execution prevent flakiness\nPowerful tooling like Codegen, Trace Viewer, and Test Runner
- Weaknesses: Primarily focused on web applications\nCan have a steeper learning curve than codeless tools
- Application Types: Web
- Test Types: E2E Testing, API Testing, Component Testing

When analyzing "Postman", use the following information: It is an API platform for building and using APIs.
- Strengths: Comprehensive toolset for the entire API lifecycle\nUser-friendly interface for creating and testing requests\nStrong collaboration and documentation features
- Weaknesses: Can be resource-intensive\nUI testing capabilities are limited compared to specialized tools
- Application Types: API
- Test Types: API Testing, Integration Testing

Tool Name: {{{toolName}}}

Provide the output in the specified JSON format. Strengths and weaknesses should be newline-separated strings.
`,
});

const generateToolAnalysisFlow = ai.defineFlow(
  {
    name: 'generateToolAnalysisFlow',
    inputSchema: GenerateToolAnalysisInputSchema,
    outputSchema: GenerateToolAnalysisOutputSchema, // Use the imported schema
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error(`AI failed to generate analysis for ${input.toolName}`);
    }
    // Ensure the output includes the toolName, defaulting to input if AI doesn't provide it
    return {
      toolName: output.toolName || input.toolName,
      strengths: output.strengths,
      weaknesses: output.weaknesses,
      applicationTypes: output.applicationTypes || [],
      testTypes: output.testTypes || [],
    };
  }
);
