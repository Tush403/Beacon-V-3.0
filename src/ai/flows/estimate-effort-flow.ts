
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
  - Test case counts are primary drivers. Assign nominal days per complexity (e.g., Low: 0.25-0.5 days, Medium: 0.5-1 day, High: 1-2 days, Highly Complex: 2-4 days).
  - If a specific automation tool is mentioned, and it's known for rapid development (e.g., codeless tools), adjust estimates slightly downwards. If it's known for complexity (e.g., requiring extensive setup), adjust slightly upwards. If 'None' or 'Undecided', assume a generic scripting tool.
  - Using a standard framework generally speeds up development and maintenance.
  - CI/CD integration might add some initial setup effort but is not the primary driver for test creation effort itself.
  - QA team size might influence how quickly the work can be done if tasks are parallelizable, but the total person-days effort should be estimated first.
  
  Provide:
  1. estimatedEffortDaysMin: Your lower-bound estimate in person-days.
  2. estimatedEffortDaysMax: Your upper-bound estimate in person-days. Ensure Max is greater than or equal to Min. If total test cases are zero, both should be 0.
  3. explanation: A brief explanation of your reasoning, highlighting key factors.
  4. confidenceScore: A score from 0-100 indicating your confidence in the estimate.
  
  If the total number of test cases (sum of all complexities: low, medium, high, highly complex) is 0, then estimatedEffortDaysMin and estimatedEffortDaysMax must be 0, and the explanation should state that no test cases were provided.
  The estimate should be purely for the automation effort itself (design, scripting, execution, initial debugging). Do not include environment setup, long-term maintenance, or extensive documentation writing unless implied by standard framework usage.
  Be realistic and base your estimate on common industry experiences.
  `,
  config: {
    temperature: 0.4, // Lower temperature for more deterministic estimates
  }
});

const estimateEffortFlow = ai.defineFlow(
  {
    name: 'estimateEffortFlow',
    inputSchema: EstimateEffortInputSchema,
    outputSchema: EstimateEffortOutputSchema,
  },
  async (input) => {
    const totalTestCases = 
      (input.complexityLow || 0) + 
      (input.complexityMedium || 0) + 
      (input.complexityHigh || 0) + 
      (input.complexityHighlyComplex || 0);

    if (totalTestCases === 0 && (input.complexityLow !== undefined || input.complexityMedium !== undefined || input.complexityHigh !== undefined || input.complexityHighlyComplex !== undefined)) {
      return {
        estimatedEffortDaysMin: 0,
        estimatedEffortDaysMax: 0,
        explanation: "No test cases were provided for estimation (all complexity counts are zero). Effort is zero.",
        confidenceScore: 100,
      };
    }
    
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate an effort estimate.");
    }
    
    // Ensure min <= max, and handle potential non-numeric or unexpected LLM outputs gracefully
    const minEffort = typeof output.estimatedEffortDaysMin === 'number' ? output.estimatedEffortDaysMin : 0;
    const maxEffort = typeof output.estimatedEffortDaysMax === 'number' ? output.estimatedEffortDaysMax : 0;

    if (minEffort > maxEffort) {
        console.warn("AI returned min effort greater than max. Adjusting: using min as max and attempting a sensible new min, or clamping.");
        return {
            ...output,
            estimatedEffortDaysMin: Math.max(0, maxEffort - (maxEffort * 0.2)), // e.g. min is 80% of originally returned max
            estimatedEffortDaysMax: maxEffort,
        };
    }
    
    return {
        ...output,
        estimatedEffortDaysMin: minEffort,
        estimatedEffortDaysMax: maxEffort,
    };
  }
);
