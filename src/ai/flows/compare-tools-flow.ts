
'use server';
/**
 * @fileOverview An AI agent for comparing test automation tools.
 *
 * - compareTools - A function that handles the tool comparison process.
 * - CompareToolsInput - The input type for the compareTools function.
 * - CompareToolsOutput - The return type for the compareTools function.
 */

import {ai} from '@/ai/genkit';
import { CompareToolsInputSchema, CompareToolsOutputSchema, type CompareToolsInput, type CompareToolsOutput, ComparisonCriterionSchema as AppComparisonCriterionSchema } from '@/types';
import {z} from 'genkit';

export type { CompareToolsInput, CompareToolsOutput }; // Re-export for clarity

// Internal Zod schemas for what the AI will generate (array-based)
const AIToolValueSchema = z.object({
  toolName: z.string().describe("The exact tool name."),
  value: z.string().describe("The comparison text for this tool for this specific criterion."),
});

const AIComparisonCriterionSchema = z.object({
  criterionName: z.string().describe("The name of the comparison criterion (e.g., 'Ease of Use', 'Key Features')."),
  toolValues: z.array(AIToolValueSchema).describe("An array of objects, each providing the comparison text for a specific tool under this criterion."),
});

const AIToolOverviewSchema = z.object({
    toolName: z.string().describe("The exact tool name."),
    overview: z.string().describe("The 1-2 sentence overview for this tool."),
});

const AICompareToolsOutputSchema = z.object({
  comparisonTable: z.array(AIComparisonCriterionSchema).describe("An array of criteria, where each criterion contains an array of tool-specific comparison details."),
  toolOverviews: z.array(AIToolOverviewSchema).optional().describe("Optional: An array of objects, each containing a tool name and its overview."),
});
type AICompareToolsOutput = z.infer<typeof AICompareToolsOutputSchema>;


export async function compareTools(input: CompareToolsInput): Promise<CompareToolsOutput> {
  return compareToolsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareToolsPrompt',
  input: {schema: CompareToolsInputSchema},
  output: {schema: AICompareToolsOutputSchema}, // Use the internal AI-friendly schema
  prompt: `You are an expert Test Automation Analyst. Compare the following tools:
{{#each toolNames}}
- {{{this}}}
{{/each}}

Provide a detailed comparison based on these criteria. For each criterion, provide concise (1-3 sentences, suitable for a table cell) and factual information for each tool:
- Ease of Use: Consider setup complexity, learning curve, and UI/UX if applicable.
- Key Features: Highlight 2-3 unique selling points or core functionalities.
- Primary Use Case: Specify typical applications (e.g., Web UI, Mobile Native, API, Performance).
- Strengths: What does this tool do exceptionally well?
- Weaknesses: What are its main limitations or drawbacks?
- Pricing Model: Describe the general model (e.g., Open Source, Freemium, Subscription Tiers, Perpetual License). Avoid specific costs unless widely known and stable.
- Community Support & Documentation: Assess availability, quality, and activity of support channels and docs.
- Best For: Identify specific project types, team sizes, or scenarios where this tool excels.

Format the output as a JSON object adhering to the AICompareToolsOutputSchema.

For "comparisonTable":
Each object in the "comparisonTable" array represents one of the above criteria. It must have:
  - "criterionName": The exact name of the criterion.
  - "toolValues": An array of objects. Each object in this "toolValues" array must have:
    - "toolName": The exact tool name as provided in the input.
    - "value": The comparison text for that tool for that specific criterion.

For "toolOverviews" (if you provide it):
This should be an array of objects. Each object in this "toolOverviews" array must have:
  - "toolName": The exact tool name as provided in the input.
  - "overview": Its brief 1-2 sentence overview.

Ensure all requested criteria are present in the comparisonTable.
Ensure all provided tool names are covered in each criterion's "toolValues" array and in "toolOverviews" if provided.
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
    outputSchema: CompareToolsOutputSchema, // The flow's public contract uses the app's schema
  },
  async (input: CompareToolsInput): Promise<CompareToolsOutput> => {
    const {output: aiOutput} = await prompt(input); // aiOutput is of type AICompareToolsOutput | undefined
    if (!aiOutput) {
      throw new Error('AI failed to generate tool comparison.');
    }

    // Transform AIOutput (array-based) to CompareToolsOutput (record-based)
    const transformedComparisonTable = aiOutput.comparisonTable.map(aiCriterion => {
      const toolValuesRecord: Record<string, string> = {};
      aiCriterion.toolValues.forEach(tv => {
        toolValuesRecord[tv.toolName] = tv.value;
      });
      // Ensure all input tool names have an entry, even if AI missed one
      input.toolNames.forEach(inputToolName => {
        if (!toolValuesRecord[inputToolName]) {
          toolValuesRecord[inputToolName] = "N/A";
        }
      });
      return {
        criterionName: aiCriterion.criterionName,
        toolValues: toolValuesRecord,
      };
    });

    const transformedToolOverviews: Record<string, string> = {};
    if (aiOutput.toolOverviews) {
      aiOutput.toolOverviews.forEach(to => {
        transformedToolOverviews[to.toolName] = to.overview;
      });
    }
    // Ensure all input tool names have an entry in overviews, even if AI missed one
     input.toolNames.forEach(inputToolName => {
        if (aiOutput.toolOverviews && !transformedToolOverviews[inputToolName]) {
           transformedToolOverviews[inputToolName] = "No overview available.";
        } else if (!aiOutput.toolOverviews) {
            // If aiOutput.toolOverviews is undefined, initialize all with default
            transformedToolOverviews[inputToolName] = "No overview available.";
        }
    });


    const validatedOutput: CompareToolsOutput = {
        comparisonTable: transformedComparisonTable,
        toolOverviews: Object.keys(transformedToolOverviews).length > 0 ? transformedToolOverviews : undefined,
    };
    
    // Further validation against the final output schema (optional but good practice)
    try {
        CompareToolsOutputSchema.parse(validatedOutput);
    } catch (e) {
        console.error("Validation error after transforming AI output:", e);
        throw new Error("AI output transformation resulted in invalid structure.");
    }
    
    return validatedOutput;
  }
);

