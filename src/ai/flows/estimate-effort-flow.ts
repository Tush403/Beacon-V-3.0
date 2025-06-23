
'use server';
/**
 * @fileOverview An AI agent for estimating test automation project effort.
 *
 * - estimateEffort - A function that handles the effort estimation process.
 * - EstimateEffortInput - The input type for the estimateEffort function.
 * - EstimateEffortOutput - The return type for the estimateEffort function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { EstimateEffortInputSchema, EstimateEffortOutputSchema, type EstimateEffortInput } from '@/types';

export type { EstimateEffortOutput } from '@/types'; // Re-export for clarity

export async function estimateEffort(input: EstimateEffortInput): Promise<EstimateEffortOutput> {
  return estimateEffortFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateEffortPrompt',
  input: {schema: EstimateEffortInputSchema},
  output: {schema: EstimateEffortOutputSchema},
  prompt: `You are an expert QA Project Manager specializing in test automation effort estimation.
  Based on the provided project parameters, estimate the effort required in person-days.

  Project Parameters:
  - Automation Tool: {{#if automationTool}}{{automationTool}}{{else}}Not specified/Undecided{{/if}}
  - Test Case Complexity:
    - Low: {{complexityLow}}
    - Medium: {{complexityMedium}}
    - High: {{complexityHigh}}
    - Highly Complex: {{complexityHighlyComplex}}
  - Using Standard Framework: {{#if useStandardFramework}}Yes{{else}}No{{/if}}
  - CI/CD Integrated: {{#if cicdPipelineIntegrated}}Yes{{else}}No{{/if}}
  - QA Team Size (for potential parallel work, not overall project duration): {{qaTeamSize}}
  - Project Description: {{#if projectDescription}}{{projectDescription}}{{else}}No additional project description provided.{{/if}}

  Considerations:
  - Test case counts are primary drivers. Assign nominal days per complexity (e.g., Low: 0.05-0.1 days, Medium: 0.1-0.15 days, High: 0.15-0.25 days, Highly Complex: 0.25-0.4 days).
  - If a specific automation tool is mentioned, and it's known for rapid development (e.g., codeless tools), adjust estimates slightly downwards. If it's known for complexity (e.g., requiring extensive setup), adjust slightly upwards. If 'None' or 'Undecided', assume a generic scripting tool.
  - Using a standard framework generally speeds up development and maintenance.
  - CI/CD integration might add some initial setup effort but is not the primary driver for test creation effort itself.
  - QA team size might influence how quickly the work can be done if tasks are parallelizable, but the total person-days effort should be estimated first.
  
  Provide:
  1. estimatedEffortDays: Your single, most likely estimate in person-days, presented as a precise number. If total test cases are zero, this must be 0.
  2. explanation: A brief explanation of your reasoning, highlighting key factors.
  3. confidenceScore: A score from 90 to 100 indicating your confidence in the estimate. If you cannot provide an estimate with at least 90% confidence, explain why in the explanation field but still provide your best possible single estimate.
  
  If the total number of test cases (sum of all complexities: low, medium, high, highly complex) is 0, then estimatedEffortDays must be 0, and the explanation should state that no test cases were provided.
  The estimate should be purely for the automation effort itself (design, scripting, execution, initial debugging). Do not include environment setup, long-term maintenance, or extensive documentation writing unless implied by standard framework usage.
  Be realistic and base your estimate on common industry experiences.
  `,
  config: {
    temperature: 0.2, // Lower temperature for more deterministic and precise estimates
  }
});

const estimateEffortFlow = ai.defineFlow(
  {
    name: 'estimateEffortFlow',
    inputSchema: EstimateEffortInputSchema,
    outputSchema: EstimateEffortOutputSchema,
  },
  async (input) => {
    // Business logic to handle zero test cases is now in the action wrapper (actions.ts)
    // for better separation of concerns and to handle undefined inputs before Zod defaults.
    // The prompt is still robust enough to handle a zero-case if called directly.
    
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate an effort estimate.");
    }
    
    // Ensure confidence score is within range, just in case AI doesn't adhere.
    const confidence = Math.max(90, Math.min(100, output.confidenceScore || 90));
    
    return {
        ...output,
        confidenceScore: confidence,
    };
  }
);
