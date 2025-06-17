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

const GenerateToolAnalysisInputSchema = z.object({
  toolName: z.string().describe('The name of the tool to analyze.'),
});

export type GenerateToolAnalysisInput = z.infer<typeof GenerateToolAnalysisInputSchema>;

const GenerateToolAnalysisOutputSchema = z.object({
  strengths: z.string().describe('The strengths of the tool.'),
  weaknesses: z.string().describe('The weaknesses of the tool.'),
});

export type GenerateToolAnalysisOutput = z.infer<typeof GenerateToolAnalysisOutputSchema>;

export async function generateToolAnalysis(input: GenerateToolAnalysisInput): Promise<GenerateToolAnalysisOutput> {
  return generateToolAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateToolAnalysisPrompt',
  input: {schema: GenerateToolAnalysisInputSchema},
  output: {schema: GenerateToolAnalysisOutputSchema},
  prompt: `You are an expert QA lead specializing in test automation tools.

You will analyze the tool and generate a summary of its strengths and weaknesses.

Tool Name: {{{toolName}}}

Strengths:

Weaknesses:`,
});

const generateToolAnalysisFlow = ai.defineFlow(
  {
    name: 'generateToolAnalysisFlow',
    inputSchema: GenerateToolAnalysisInputSchema,
    outputSchema: GenerateToolAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
