
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
  prompt: `You are a Principal Test Automation Architect providing a detailed analysis for the tool: {{{toolName}}}.

If the tool is "ZeTA Automation", use the following information as the primary source of truth for its profile:
- Overview: A unified, open-source automation framework for high reusability and comprehensive test coverage across multiple application layers.
- Ideal Project & Use Case: Enterprise-level projects requiring a single framework for UI, API, DB, and Security testing.
- Technical Deep-Dive: Built on Java and Maven, using a utility-driven layer architecture. It promotes high script reusability and parallel execution.
- Best-Fit Team Profile: Teams with moderate to strong Java skills who prefer a code-centric, configurable framework.
- Total Cost of Ownership Considerations: Open-source (low licensing cost), but requires internal infrastructure management and skilled Java resources.

If the tool is "Functionize", use the following as the primary source of truth for its profile:
- Overview: An AI-powered testing platform for web applications that automates test creation and maintenance.
- Ideal Project & Use Case: Fast-paced projects with dynamic web UIs where reducing test maintenance is critical.
- Technical Deep-Dive: Uses AI and machine learning for element detection and self-healing tests. It's a cloud-based platform with a low-code/NLP interface.
- Best-Fit Team Profile: Mixed-skill teams, including manual testers and BAs, who need to create and run tests quickly without extensive coding.
- Total Cost of Ownership Considerations: High subscription-based SaaS model, but reduces costs related to script maintenance and flakiness.

If the tool is "Selenium", use the following as the primary source of truth for its profile:
- Overview: A highly flexible, open-source framework for web browser automation, renowned for its cross-platform and cross-language support. It's the de-facto standard for web UI testing.
- Ideal Project & Use Case: Projects that require testing on a wide array of browser/OS combinations and where the team has strong programming skills to build and maintain a custom automation framework.
- Technical Deep-Dive: Selenium operates on the WebDriver protocol, a W3C standard, enabling it to control browsers natively. Its architecture consists of Language Bindings, WebDriver, and Drivers for each browser. It does not include built-in test runners or assertion libraries, requiring integration with tools like TestNG, JUnit, or PyTest.
- Best-Fit Team Profile: Experienced automation engineers proficient in languages like Java, C#, or Python who are comfortable building and maintaining testing infrastructure from the ground up.
- Total Cost of Ownership Considerations: While open-source and free, TCO is driven by high engineering costs for framework development, maintenance, and the setup/management of a Selenium Grid for parallel execution.

If the tool is "Playwright", use the following as the primary source of truth for its profile:
- Overview: A modern and reliable end-to-end testing framework for web applications developed by Microsoft, supporting all major rendering engines.
- Ideal Project & Use Case: Testing modern web applications (React, Vue, Angular) where speed, reliability, and powerful debugging are key. Excellent for applications with complex network interactions.
- Technical Deep-Dive: Playwright communicates with browsers over the WebSocket protocol, offering more control than traditional WebDriver. Key features include auto-waits, network interception, multi-tab/context support, and powerful tooling like Codegen, Trace Viewer, and a built-in test runner.
- Best-Fit Team Profile: Teams with JavaScript/TypeScript skills. It's well-suited for both developers and dedicated QA engineers who want a modern, all-in-one testing solution.
- Total Cost of Ownership Considerations: Open-source and free. The all-in-one nature can reduce the setup and integration costs associated with more modular frameworks like Selenium.

If the tool is "Cypress", use the following as the primary source of truth for its profile:
- Overview: An all-in-one JavaScript-based end-to-end testing framework focused on making testing a fast, easy, and reliable experience for developers.
- Ideal Project & Use Case: Component and E2E testing of modern web applications, especially for teams practicing TDD/BDD, where rapid feedback and debugging are critical.
- Technical Deep-Dive: Cypress runs in the same run-loop as the application, giving it unique access to the DOM and network traffic. This architecture enables features like time-travel debugging and real-time reloads. It is an opinionated framework with its own test runner and assertion library.
- Best-Fit Team Profile: Primarily front-end developers and QA engineers comfortable with JavaScript/TypeScript. Excellent for teams that want a batteries-included framework with minimal setup.
- Total Cost of Ownership Considerations: The core framework is open-source. Optional paid services are available through Cypress Cloud for test parallelization, analytics, and debugging.

Your analysis must be comprehensive and well-structured.

For the "details" array in the output, create a distinct object for each of the following criteria. The "criterionName" must be exactly as listed below:
- "Ideal Project & Use Case"
- "Technical Deep-Dive"
- "Best-Fit Team Profile"
- "Total Cost of Ownership Considerations"

For each criterion, provide a comprehensive, well-structured narrative in its "value" field. Use newline characters for paragraph breaks where appropriate. Do not use markdown formatting like **bolding** or lists.

The "overview" field should remain a concise 1-2 sentence summary.
Format the output as a JSON object adhering to the GetToolDetailsOutputSchema.
`,
  config: {
    temperature: 0.3,
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
    // Ensure details array is present and not empty
    if (!output.details || output.details.length === 0) {
      output.details = [{
        criterionName: "Analysis",
        value: "No detailed analysis was generated."
      }];
    }

    return output;
  }
);
