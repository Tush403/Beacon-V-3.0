
'use server';

import { recommendTools as genkitRecommendTools, RecommendToolsInput, RecommendToolsOutput } from '@/ai/flows/recommend-tools';
import { generateToolAnalysis as genkitGenerateToolAnalysis, GenerateToolAnalysisOutput, GenerateToolAnalysisInput } from '@/ai/flows/generate-tool-analysis';
import { estimateEffort as genkitEstimateEffort, EstimateEffortInput, EstimateEffortOutput } from '@/ai/flows/estimate-effort-flow';
import { compareTools as genkitCompareTools, CompareToolsInput, CompareToolsOutput } from '@/ai/flows/compare-tools-flow';
import { getToolDetails as genkitGetToolDetails, GetToolDetailsInput, GetToolDetailsOutput } from '@/ai/flows/get-tool-details';
import { supportChat as genkitSupportChat, SupportChatInput, SupportChatOutput } from '@/ai/flows/support-chat-flow';
import { localToolAnalysisData } from '@/lib/tool-analysis-data'; // Import local data


export async function recommendToolsAction(filters: RecommendToolsInput): Promise<RecommendToolsOutput> {
  // Handle AI/ML selection first with a curated list for accuracy
  if (filters.codingRequirement === 'ai-ml') {
    return {
      recommendations: [
        {
          toolName: 'Functionize',
          score: 95,
          justification: 'A leading AI-powered platform for web testing that automates test creation and maintenance.',
        },
        {
          toolName: 'Mabl',
          score: 92,
          justification: 'Uses AI for low-code test automation, offering intelligent, self-healing tests for web applications.',
        },
        {
          toolName: 'Testim',
          score: 90,
          justification: 'AI-based test automation that speeds up authoring, execution, and maintenance of tests.',
        },
      ],
    };
  }

  // Hardcode specific results for Web or UI testing
  if (filters.applicationUnderTest.toLowerCase().includes('web') || filters.testType.toLowerCase().includes('ui')) {
    return {
      recommendations: [
        {
          toolName: 'Functionize',
          score: 93,
          justification: 'Excellent for web UI testing with its AI-powered, low-code platform for rapid creation and maintenance.',
        },
        {
          toolName: 'Playwright',
          score: 92,
          justification: 'Provides robust, reliable end-to-end testing for modern web apps across all major browsers.',
        },
        {
          toolName: 'Selenium',
          score: 90,
          justification: 'A highly flexible and widely-used open-source framework for web browser automation with extensive community support.',
        },
      ],
    };
  }

  try {
    const result = await genkitRecommendTools(filters);
    if (!result || !result.recommendations) {
      throw new Error('AI recommendations came back empty.');
    }

    // 1. De-duplicate recommendations to ensure unique tools
    const seenToolNames = new Set<string>();
    const uniqueRecommendations = result.recommendations.filter(rec => {
        const lowerCaseToolName = rec.toolName.toLowerCase().trim();
        // Filter out if the name is empty or already seen
        if (!rec.toolName.trim() || seenToolNames.has(lowerCaseToolName)) {
            return false;
        }
        seenToolNames.add(lowerCaseToolName);
        return true;
    });

    // Take the top 3 unique recommendations
    let processedRecommendations = uniqueRecommendations.slice(0, 3);

    // 2. Override scores for specific tools
    processedRecommendations = processedRecommendations.map(rec => {
      const toolNameLower = rec.toolName.toLowerCase().trim();
      if (toolNameLower === 'functionize') {
        return { ...rec, score: 93 };
      }
       if (toolNameLower === 'playwright') {
        return { ...rec, score: 92 };
      }
       if (toolNameLower === 'selenium') {
        return { ...rec, score: 90 };
      }
      return rec;
    });

    // 3. Sort by score descending to establish an initial ranking
    processedRecommendations.sort((a, b) => b.score - a.score);

    // 4. Ensure scores are unique for ranking, preventing ties.
    // If two tools have the same score, the second one gets a slightly lower score.
    for (let i = 1; i < processedRecommendations.length; i++) {
        if (processedRecommendations[i].score >= processedRecommendations[i - 1].score) {
            processedRecommendations[i].score = processedRecommendations[i - 1].score - 1;
        }
    }
    
    // 5. Final clamping of scores to be within the 0-100 range
    processedRecommendations = processedRecommendations.map(rec => ({
        ...rec,
        score: Math.max(0, Math.min(100, rec.score)),
    }));
    
    result.recommendations = processedRecommendations;
    return result;
    
  } catch (error) {
    console.error('Error recommending tools:', error);
    throw new Error(`Failed to get tool recommendations. ${error instanceof Error ? error.message : ''}`);
  }
}

export async function generateToolAnalysisAction(input: GenerateToolAnalysisInput): Promise<GenerateToolAnalysisOutput> {
  const toolNameLower = input.toolName.toLowerCase();
  
  // 1. Check local data first for an instant response
  if (localToolAnalysisData[toolNameLower]) {
    const localData = localToolAnalysisData[toolNameLower];
    return {
      toolName: input.toolName, // Return with original casing for display
      ...localData
    };
  }

  // 2. Fallback to Genkit AI call if not found locally
  try {
    const result = await genkitGenerateToolAnalysis(input);
     if (!result || !result.strengths || !result.weaknesses) {
      console.warn('AI analysis came back empty or failed, providing mock data for:', input.toolName);
      return {
        toolName: input.toolName,
        strengths: `Mock Strength: ${input.toolName} is highly adaptable and supports various plugins. It has a strong community and performs well under load.`,
        weaknesses: `Mock Weakness: ${input.toolName} can have a steep learning curve for beginners and may require significant setup for complex projects. Documentation could be improved.`,
        applicationTypes: ['Web', 'API'],
        testTypes: ['UI Testing', 'E2E Testing'],
      };
    }
    return result;
  } catch (error) {
    console.error('Error generating tool analysis:', error);
    // Ensure the error fallback also adheres to the GenerateToolAnalysisOutput structure
    return {
        toolName: input.toolName,
        strengths: `Mock Strength (Error Fallback): ${input.toolName} is known for its extensive documentation and ease of integration. It is praised for cross-platform compatibility.`,
        weaknesses: `Mock Weakness (Error Fallback): ${input.toolName} might be resource-intensive for very large test suites on limited hardware. Some advanced features require paid licenses.`,
        applicationTypes: ['Web', 'Mobile'],
        testTypes: ['Regression Testing', 'Functional Testing'],
      };
  }
}

export async function getToolDetailsAction(input: GetToolDetailsInput): Promise<GetToolDetailsOutput> {
    try {
        const result = await genkitGetToolDetails(input);
        if (!result || !result.overview || !result.detailedAnalysis) {
            throw new Error('AI response for tool details was incomplete.');
        }
        return result;
    } catch (error) {
        console.error(`Error getting tool details for ${input.toolName}:`, error);
        // Provide a structured mock/fallback response that matches the schema
        return {
            toolName: `${input.toolName} (Error)`,
            overview: `An error occurred while fetching details for ${input.toolName}. The information could not be retrieved. Please try again later.`,
            detailedAnalysis: `An internal error prevented the retrieval of tool-specific data. ${error instanceof Error ? error.message : ''}`
        };
    }
}

export async function estimateEffortAction(input: EstimateEffortInput): Promise<EstimateEffortOutput> {
  // Business logic check: If user provides any complexity counts and they sum to zero,
  // return a zero-effort estimate immediately without calling the AI.
  const totalTestCases =
    (input.complexityLow || 0) +
    (input.complexityMedium || 0) +
    (input.complexityHigh || 0) +
    (input.complexityHighlyComplex || 0);

  if (totalTestCases === 0) {
    return {
      estimatedEffortDays: 0,
      explanation: 'No test cases were provided for estimation (all complexity counts are zero). Effort is zero.',
      confidenceScore: 100,
    };
  }
  
  try {
    const result = await genkitEstimateEffort(input);
    if (!result) {
      throw new Error('AI effort estimation came back empty.');
    }
    return result;
  } catch (error) {
    console.error('Error estimating effort:', error);
    throw new Error(`Failed to get effort estimation. ${error instanceof Error ? error.message : ''}`);
  }
}

const getMockComparisonData = (toolNames: string[]): CompareToolsOutput => {
  const criteria = [
      'Initial Setup Time', 'Maintenance Overhead', 'Test Creation Speed', 
      'Script Reusability', 'Parallel Execution Support', 'Test Case Creation Effort',
      'Skill Requirement', 'Overall Automation Coverage', 'Total Cost of Ownership'
  ];
  const comparisonTable = criteria.map(criterionName => {
      const toolValues: Record<string, string> = {};
      toolNames.forEach(toolName => {
          toolValues[toolName] = `Data temporarily unavailable.`;
      });
      return { criterionName, toolValues };
  });
  const toolOverviews: Record<string, string> = {};
  toolNames.forEach(toolName => {
      toolOverviews[toolName] = `Overview for ${toolName} is temporarily unavailable due to a service issue. Please try again shortly.`;
  });
  return { comparisonTable, toolOverviews };
};

export async function compareToolsAction(input: CompareToolsInput): Promise<CompareToolsOutput> {
  try {
    const result = await genkitCompareTools(input);
    if (!result || !result.comparisonTable || result.comparisonTable.length === 0) {
      console.warn('AI tool comparison came back empty or malformed, providing mock data.');
      return getMockComparisonData(input.toolNames);
    }
    return result;
  } catch (error) {
    console.error('Error comparing tools:', error);
    // Instead of throwing, return mock data to prevent UI error display for transient issues.
    console.warn('Providing mock comparison data due to an API error.');
    return getMockComparisonData(input.toolNames);
  }
}

export async function supportChatAction(input: SupportChatInput): Promise<SupportChatOutput> {
  try {
    const result = await genkitSupportChat(input);
    if (!result || !result.response) {
      throw new Error('AI chatbot came back with an empty response.');
    }
    return result;
  } catch (error) {
    console.error('Error in support chat action:', error);
    // Return a user-friendly error message within the chat response
    return {
      response: `Sorry, I encountered an error and can't respond right now. Please try again later. ${error instanceof Error ? error.message : ''}`
    };
  }
}
