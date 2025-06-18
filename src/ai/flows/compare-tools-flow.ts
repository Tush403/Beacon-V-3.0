
'use server';
/**
 * @fileOverview An AI agent for comparing test automation tools.
 *
 * - compareTools - A function that handles the tool comparison process.
 * - CompareToolsInput - The input type for the compareTools function.
 * - CompareToolsOutput - The return type for the compareTools function.
 */

import {ai} from '@/ai/genkit';
import { CompareToolsInputSchema, CompareToolsOutputSchema, type CompareToolsInput, type CompareToolsOutput } from '@/types';

export type { CompareToolsInput, CompareToolsOutput }; // Re-export for clarity

export async function compareTools(input: CompareToolsInput): Promise<CompareToolsOutput> {
  return compareToolsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareToolsPrompt',
  input: {schema: CompareToolsInputSchema},
  output: {schema: CompareToolsOutputSchema},
  prompt: `You are an expert Test Automation Analyst. Compare the following tools:
{{#each toolNames}}
- {{{this}}}
{{/each}}

Provide a detailed comparison based on these criteria. For each criterion and each tool, provide concise (1-3 sentences, suitable for a table cell) and factual information:
- Ease of Use: Consider setup complexity, learning curve, and UI/UX if applicable.
- Key Features: Highlight 2-3 unique selling points or core functionalities.
- Primary Use Case: Specify typical applications (e.g., Web UI, Mobile Native, API, Performance).
- Strengths: What does this tool do exceptionally well?
- Weaknesses: What are its main limitations or drawbacks?
- Pricing Model: Describe the general model (e.g., Open Source, Freemium, Subscription Tiers, Perpetual License). Avoid specific costs unless widely known and stable.
- Community Support & Documentation: Assess availability, quality, and activity of support channels and docs.
- Best For: Identify specific project types, team sizes, or scenarios where this tool excels.

Also, provide a very brief (1-2 sentence) overall summary for each tool.

Format the output as a JSON object adhering to the CompareToolsOutputSchema.
The "comparisonTable" should be an array of objects. Each object represents one of the above criteria and must have:
  - "criterionName": The exact name of the criterion as listed above.
  - "toolValues": An object where keys are the exact tool names provided in the input, and values are the comparison text for that tool for that specific criterion.
The "toolOverviews" should be an object where keys are the exact tool names provided in the input, and values are their brief 1-2 sentence overviews.

Ensure all requested criteria are present in the comparisonTable.
Ensure all provided tool names are present as keys in each criterion's "toolValues" object and in "toolOverviews".
Be objective and base your comparison on generally accepted knowledge about these tools.
If a tool is significantly weaker or stronger in a particular area, reflect that in the comparison.
`,
  config: {
    temperature: 0.3, // Lower temperature for more factual and consistent comparisons
  }
});

const compareToolsFlow = ai.defineFlow(
  {
    name: 'compareToolsFlow',
    inputSchema: CompareToolsInputSchema,
    outputSchema: CompareToolsOutputSchema,
  },
  async (input: CompareToolsInput) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate tool comparison.');
    }
    // Ensure the output structure aligns with expectations, especially tool names as keys
    const validatedOutput: CompareToolsOutput = {
        comparisonTable: output.comparisonTable.map(criterion => ({
            criterionName: criterion.criterionName,
            toolValues: input.toolNames.reduce((acc, toolName) => {
                acc[toolName] = criterion.toolValues[toolName] || "N/A"; // Ensure all tools have an entry
                return acc;
            }, {} as Record<string, string>)
        })),
        toolOverviews: input.toolNames.reduce((acc, toolName) => {
            acc[toolName] = output.toolOverviews?.[toolName] || "No overview available.";
            return acc;
        }, {} as Record<string, string>)
    };
    return validatedOutput;
  }
);
