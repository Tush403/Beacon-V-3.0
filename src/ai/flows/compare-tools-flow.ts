
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

Provide a detailed comparison based on these criteria. For each criterion, provide a highly concise summary (strictly less than 10 words) that is factual and informative for each tool. The content must be suitable for a small table cell.
- Initial Setup Time: Describe the typical time and complexity to get the tool running for a new project.
- Maintenance Overhead: Assess the effort required to maintain tests, handle updates, and manage flakiness.
- Test Creation Speed: How quickly can new tests be authored? Consider scripting vs. low-code/codeless approaches.
- Script Reusability: Evaluate the tool's support for creating reusable components, functions, or modules.
- Parallel Execution Support: Assess the native capabilities for running tests in parallel to reduce execution time.
- Test Case Creation Effort: Describe the level of effort needed to create test cases (e.g., natural language, visual tools, complex scripting).
- Skill Requirement: What skills are needed? (e.g., deep coding skills, basic scripting, no coding required).
- Overall Automation Coverage: How broad is the tool's support for different application types (Web, API, Mobile) and test types?
- Total Cost of Ownership: Consider licensing costs, infrastructure, and human resource costs over time. Describe the general model (e.g., Open Source, Subscription). Avoid specific costs.

Format the output as a JSON object adhering to the AICompareToolsOutputSchema.

For "comparisonTable":
Each object in the "comparisonTable" array represents one of the above criteria. It must have:
  - "criterionName": The exact name of the criterion.
  - "toolValues": An array of objects. Each object in this "toolValues" array must have:
    - "toolName": The exact tool name as provided in the input.
    - "value": The comparison text for that tool for that specific criterion. The value for this field MUST be a string of less than 10 words.

For "toolOverviews":
This should be an array of objects. Each object in this "toolOverviews" array must have:
  - "toolName": The exact tool name as provided in the input.
  - "overview": Its brief 1-2 sentence overview.

Ensure all requested criteria are present in the comparisonTable.
Ensure all provided tool names are covered in each criterion's "toolValues" array and in "toolOverviews".
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
