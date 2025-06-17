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
 * @exports RecommendToolsInput - The input type for the recommendTools function.
 * @exports RecommendToolsOutput - The return type for the recommendTools function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Updated input schema to match new filter criteria
const RecommendToolsInputSchema = z.object({
  complexityMedium: z.number().describe('Number of medium complexity test cases (e.g., 30).'),
  complexityHigh: z.number().describe('Number of high complexity test cases (e.g., 15).'),
  complexityHighlyComplex: z.number().describe('Number of highly complex test cases (e.g., 5).'),
  useStandardFramework: z.boolean().describe('Whether a standard test framework is used (true/false).'),
  cicdPipelineIntegrated: z.boolean().describe('Whether CI/CD pipeline is integrated (true/false).'),
  qaTeamSize: z.number().int().positive().describe('Size of the QA team in engineers (e.g., 1).'),
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
  Medium Complexity Test Cases: {{{complexityMedium}}}
  High Complexity Test Cases: {{{complexityHigh}}}
  Highly Complex Test Cases: {{{complexityHighlyComplex}}}
  Uses Standard Test Framework: {{{useStandardFramework}}}
  CI/CD Pipeline Integrated: {{{cicdPipelineIntegrated}}}
  QA Team Size: {{{qaTeamSize}}} engineers

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
