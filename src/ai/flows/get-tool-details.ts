
'use server';
/**
 * @fileOverview An AI agent for getting detailed information about a single test automation tool.
 *
 * - getToolDetails - A function that handles fetching tool details.
 * - GetToolDetailsInput - The input type for the getToolDetails function.
 * - GetToolDetailsOutput - The return type for the getToolDetails function.
 */

import {ai} from '@/ai/genkit';
import { GetToolDetailsInputSchema, GetToolDetailsOutputSchema, type GetToolDetailsInput, type GetToolDetailsOutput } from '@/types';
import {z} from 'genkit';


export type { GetToolDetailsInput, GetToolDetailsOutput };

export async function getToolDetails(input: GetToolDetailsInput): Promise<GetToolDetailsOutput> {
  return getToolDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getToolDetailsPrompt',
  input: {schema: GetToolDetailsInputSchema},
  output: {schema: GetToolDetailsOutputSchema},
  prompt: `You are an expert Test Automation Analyst. Provide a detailed profile for the following tool: {{{toolName}}}.

If the tool is "ZeTA Automation", use the following information as the primary source of truth:
- Tool Overview: A unified, open-source automation framework for high reusability and comprehensive test coverage across multiple application layers.
- Criteria:
  - Initial Setup Time: 2-4 days.
  - Maintenance Overhead: Low; utility-driven layers reduce impact.
  - Test Creation Speed: High; pre-built templates and plug & play logic.
  - Script Reusability: High; shared libraries and config-driven design.
  - Parallel Execution Support: Excellent; CI-ready with parallel run support.
  - Test Case Creation Effort: Medium; template-based creation simplifies effort.
  - Skill Requirement: Moderate; Java and Maven knowledge preferred.
  - Overall Automation Coverage: Very High; unified UI, API, DB, Security.
  - Total Cost of Ownership: Low; open-source with internal infrastructure.

If the tool is "Functionize", use the following as the primary source of truth:
- Tool Overview: An AI-powered testing platform for web applications that automates test creation and maintenance.
- Criteria:
  - Initial Setup Time: <1 day; cloud-based with no local setup.
  - Maintenance Overhead: Very Low; AI-powered self-healing adapts to UI changes.
  - Test Creation Speed: Very High; uses natural language and visual tools.
  - Script Reusability: Moderate; promotes reusable test steps and flows.
  - Parallel Execution Support: Excellent; cloud infrastructure supports massive parallelization.
  - Test Case Creation Effort: Very Low; uses NLP and visual tools.
  - Skill Requirement: Low; no coding required for most tasks.
  - Overall Automation Coverage: High; focuses primarily on web UI and end-to-end testing.
  - Total Cost of Ownership: High; enterprise-level subscription-based SaaS model.

Provide a detailed profile based on these criteria. For each criterion, provide a highly concise summary (strictly less than 10-15 words) that is factual and informative.
- Initial Setup Time
- Maintenance Overhead
- Test Creation Speed
- Script Reusability
- Parallel Execution Support
- Test Case Creation Effort
- Skill Requirement
- Overall Automation Coverage
- Total Cost of Ownership

Format the output as a JSON object adhering to the GetToolDetailsOutputSchema.
- "toolName": The official tool name.
- "overview": A brief 1-2 sentence overview.
- "details": An array of objects, where each object has "criterionName" and "value".
`,
  config: {
    temperature: 0.2,
  }
});


const getToolDetailsFlow = ai.defineFlow(
  {
    name: 'getToolDetailsFlow',
    inputSchema: GetToolDetailsInputSchema,
    outputSchema: GetToolDetailsOutputSchema,
  },
  async (input: GetToolDetailsInput): Promise<GetToolDetailsOutput> => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error(`AI failed to generate details for ${input.toolName}`);
    }
    
    // Ensure toolName is present in the output
    if (!output.toolName) {
        output.toolName = input.toolName;
    }

    return output;
  }
);
