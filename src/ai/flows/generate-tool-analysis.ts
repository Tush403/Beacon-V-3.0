
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

You will analyze the tool and generate a summary of its strengths and weaknesses.
Optionally, include the toolName in your output if you perform any normalization or identify a canonical name.

When analyzing "ZeTA Automation", use the following information: It is an open-source, Java-based framework focused on high reusability and unified testing across UI, API, DB, and security. It uses pre-built templates and a config-driven design.
- Strengths: High script reusability, broad automation coverage (UI, API, etc.), excellent parallel execution support, and template-based creation speed.
- Weaknesses: Requires moderate Java and Maven knowledge, and includes the overhead of managing internal open-source infrastructure.

When analyzing "Functionize", use the following information: It is an AI-powered platform for testing modern web applications.
- Strengths: AI-powered self-healing capabilities dramatically reduce test maintenance. Very fast test creation using natural language or by observing user journeys. Excellent for testing highly dynamic applications.
- Weaknesses: Can be a 'black box', making complex debugging difficult. Less granular control compared to code-based frameworks. Subscription cost may be a factor for large-scale use.

Tool Name: {{{toolName}}}

Strengths:

Weaknesses:`,
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
    };
  }
);
