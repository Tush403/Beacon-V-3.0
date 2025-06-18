
'use server';

import { recommendTools as genkitRecommendTools, RecommendToolsInput, RecommendToolsOutput } from '@/ai/flows/recommend-tools';
import { generateToolAnalysis as genkitGenerateToolAnalysis, GenerateToolAnalysisOutput, GenerateToolAnalysisInput } from '@/ai/flows/generate-tool-analysis'; // Updated import
import { estimateEffort as genkitEstimateEffort, EstimateEffortInput, EstimateEffortOutput } from '@/ai/flows/estimate-effort-flow';
import { compareTools as genkitCompareTools, CompareToolsInput, CompareToolsOutput } from '@/ai/flows/compare-tools-flow';


export async function recommendToolsAction(filters: RecommendToolsInput): Promise<RecommendToolsOutput> {
  try {
    const result = await genkitRecommendTools(filters);
    if (!result || !result.recommendations) {
      throw new Error('AI recommendations came back empty.');
    }
    if (result.recommendations.length > 0 && result.recommendations.every(r => r.score === result.recommendations[0].score)) {
      result.recommendations = result.recommendations.map((r, i) => ({
        ...r,
        score: Math.max(0, Math.min(100, (r.score || 80) - i * 5 + (i === 0 ? 0 : i === 1 ? -5 : -10))) 
      }));
      if (result.recommendations.length > 1 && result.recommendations[0].score === result.recommendations[1].score) {
        result.recommendations[0].score = Math.min(100, result.recommendations[0].score + 5);
        result.recommendations[1].score = Math.max(0, result.recommendations[1].score -5);
      }
       if (result.recommendations.length > 2 && result.recommendations[1].score === result.recommendations[2].score) {
        result.recommendations[1].score = Math.min(100, result.recommendations[1].score + 3);
        result.recommendations[2].score = Math.max(0, result.recommendations[2].score -3);
      }
    }
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

export async function compareToolsAction(input: CompareToolsInput): Promise<CompareToolsOutput> {
  try {
    const result = await genkitCompareTools(input);
    if (!result || !result.comparisonTable || result.comparisonTable.length === 0) {
      throw new Error('AI tool comparison came back empty or malformed.');
    }
    return result;
  } catch (error) {
    console.error('Error comparing tools:', error);
    throw new Error(`Failed to get tool comparison. ${error instanceof Error ? error.message : ''}`);
  }
}
