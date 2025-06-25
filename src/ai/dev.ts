
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-tool-analysis.ts';
import '@/ai/flows/recommend-tools.ts';
import '@/ai/flows/estimate-effort-flow.ts';
import '@/ai/flows/compare-tools-flow.ts';
import '@/ai/flows/get-tool-details.ts';
import '@/ai/flows/support-chat-flow.ts';
