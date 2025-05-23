
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-writing-pace.ts';
import '@/ai/flows/suggest-break-point.ts';
import '@/ai/flows/generate-writing-exercise.ts';
import '@/ai/flows/suggest-stuck-activity.ts';
