
'use server';

import { recommendTools as genkitRecommendTools, RecommendToolsInput, RecommendToolsOutput } from '@/ai/flows/recommend-tools';
import { generateToolAnalysis as genkitGenerateToolAnalysis, GenerateToolAnalysisOutput, GenerateToolAnalysisInput } from '@/ai/flows/generate-tool-analysis'; // Updated import
import { estimateEffort as genkitEstimateEffort, EstimateEffortInput, EstimateEffortOutput } from '@/ai/flows/estimate-effort-flow';
import { compareTools as genkitCompareTools, CompareToolsInput, CompareToolsOutput } from '@/ai/flows/compare-tools-flow';


export async function recommendToolsAction(filters: RecommendToolsInput): Promise<RecommendToolsOutput> {
  // Hardcode specific results for Web or UI testing
  if (filters.applicationUnderTest === 'web' || filters.testType === 'ui') {
    return {
      recommendations: [
        {
          toolName: 'Functionize',
          score: 90,
          justification: 'Excellent for web UI testing with its AI-powered, low-code platform for rapid creation and maintenance.',
        },
        {
          toolName: 'ZeTA Automation',
          score: 85,
          justification: 'Provides robust, reusable components for comprehensive web UI test automation across enterprise applications.',
        },
        {
          toolName: 'Selenium',
          score: 80,
          justification: 'The industry standard for web browser automation, offering unparalleled flexibility and cross-browser support.',
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
  try {
    const result = await genkitGenerateToolAnalysis(input);
     if (!result || !result.strengths || !result.weaknesses) {
      console.warn('AI analysis came back empty or failed, providing mock data for:', input.toolName);
      return {
        toolName: input.toolName, // Include toolName in mock response
        strengths: `Mock Strength: ${input.toolName} is highly adaptable and supports various plugins. It has a strong community and performs well under load.`,
        weaknesses: `Mock Weakness: ${input.toolName} can have a steep learning curve for beginners and may require significant setup for complex projects. Documentation could be improved.`
      };
    }
    return result;
  } catch (error) {
    console.error('Error generating tool analysis:', error);
    // Ensure the error fallback also adheres to the GenerateToolAnalysisOutput structure
    return {
        toolName: input.toolName, // Include toolName in error fallback
        strengths: `Mock Strength (Error Fallback): ${input.toolName} is known for its extensive documentation and ease of integration. It is praised for cross-platform compatibility.`,
        weaknesses: `Mock Weakness (Error Fallback): ${input.toolName} might be resource-intensive for very large test suites on limited hardware. Some advanced features require paid licenses.`
      };
  }
}

export async function estimateEffortAction(input: EstimateEffortInput): Promise<EstimateEffortOutput> {
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
