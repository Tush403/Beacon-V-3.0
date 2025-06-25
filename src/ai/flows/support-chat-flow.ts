
'use server';
/**
 * @fileOverview A support chatbot powered by Gemini.
 *
 * - supportChat - A function that handles a single turn in a chat conversation.
 * - SupportChatInput - The input type for the supportChat function.
 * - SupportChatOutput - The return type for the supportChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  SupportChatInputSchema,
  SupportChatOutputSchema,
  type SupportChatInput,
  type SupportChatOutput,
} from '@/types';

export type {SupportChatInput, SupportChatOutput};

export async function supportChat(
  input: SupportChatInput
): Promise<SupportChatOutput> {
  const history = input.messages.map((msg) => ({
    role: msg.role,
    content: [{text: msg.content}],
  }));
  
  // The last message is the new user prompt
  const lastMessage = history.pop();

  if (!lastMessage || lastMessage.role !== 'user') {
    throw new Error('The last message in the history must be from the user.');
  }

  const { text } = await ai.generate({
    system: `You are an expert Test Automation Analyst and assistant for the TAO Digital Beacon application.
Your goal is to help users select the best test automation tools for their needs.
You can answer questions about tools, explain testing concepts, and guide users on how to use the Beacon application filters.
Be friendly, concise, and helpful.
Use the tool information provided in other system prompts as your primary knowledge base for "ZeTA Automation" and "Functionize".
If you don't know the answer, say so politely.`,
    prompt: lastMessage.content[0].text,
    history: history, // The rest of the messages are history
    config: {
      temperature: 0.5,
    },
  });

  if (!text) {
    throw new Error('AI failed to generate a response.');
  }
  
  return {response: text};
}
