
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
  - QA Team Size (for calculating final duration, not total person-days): {{qaTeamSize}}
  - Project Description: {{#if projectDescription}}{{projectDescription}}{{else}}No additional project description provided.{{/if}}

  Follow these steps for your calculation and explanation:
  1.  **Calculate Base Estimate**: Use the following multipliers for test case complexities to get a base person-day estimate. Show this calculation.
      - Low: 0.06 days/case
      - Medium: 0.12 days/case
      - High: 0.2 days/case
      - Highly Complex: 0.3 days/case
  2.  **Apply Tool-Specific Adjustments**:
      - If "Functionize" is the tool, apply a 15% reduction to the base estimate for its AI efficiency. State this adjustment clearly.
      - If "ZeTA Automation" is the tool, apply a 10% reduction for its template-driven approach. State this adjustment.
      - For other known script-heavy tools (Selenium, Playwright, Cypress), make no adjustment to the base estimate.
  3.  **Apply Framework/CI-CD Adjustments**:
      - If 'useStandardFramework' is true, apply an additional 5% reduction to the current estimate. State this.
      - If 'cicdPipelineIntegrated' is true, add a fixed 2 person-days for initial setup overhead. State this.
  4.  **Final Estimate & Explanation**: Sum all calculations to get the final 'estimatedEffortDays'. The explanation must clearly walk through each step of the calculation (Base Estimate, Tool Adjustment, Framework/CI-CD adjustments) to arrive at the final number. Round the final person-day estimate to two decimal places.
  5.  **Confidence Score**: Provide a confidence score between 90-100. Base confidence on how many parameters were provided. If a tool and all complexities are given, confidence should be high (95-98%).

  If the total number of test cases (sum of all complexities) is 0, then 'estimatedEffortDays' must be 0, and the explanation should state that no test cases were provided. The confidence score in this case should be 100.

  The final 'estimatedEffortDays' is the key output. The explanation should be a transparent breakdown of how you reached it. Do not factor the qaTeamSize into the final 'estimatedEffortDays' output; it's for context only.
  `,
  config: {
    temperature: 0.1, // Very low temperature for consistent, deterministic calculations
  }
});

const estimateEffortFlow = ai.defineFlow(
  {
    name: 'estimateEffortFlow',
    inputSchema: EstimateEffortInputSchema,
    outputSchema: EstimateEffortOutputSchema,
  },
  async (input) => {
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
