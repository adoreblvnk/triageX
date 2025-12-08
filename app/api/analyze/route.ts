import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import type { Persona } from '@/lib/mock-healthhub';

// -- SCHEMA --
const TriageSchema = z.object({
  score: z.number().min(0).max(10)
    .describe('A score from 0-10 indicating the urgency of the medical situation. 0 is non-urgent, 10 is critical.'),
  reasoning: z.string().min(10)
    .describe('A concise, clinical reasoning for the assigned score, based on the transcript and patient history.'),
});
type TriageResponse = z.infer<typeof TriageSchema>;


// -- PROMPT ENGINEERING --
function createTriagePrompt(transcript: string, persona: Persona): string {
  return `
    You are a world-class medical triage AI.
    Your task is to analyze a patient's transcript and medical history to determine an urgency score.
    Provide a score from 0 (non-urgent) to 10 (critical) and a brief clinical reasoning.
    Your response MUST adhere to the provided Zod schema.

    **PATIENT DATA:**
    - Name: ${persona.name}
    - Age: ${persona.age}
    - Medical History: ${persona.history.join(', ')}

    **PATIENT TRANSCRIPT:**
    """
    ${transcript}
    """

    Analyze the information and return the triage assessment.
  `;
}

// -- ENSEMBLE LOGIC --
async function runTriage(
  provider: any,
  model: string,
  prompt: string
): Promise<TriageResponse> {
  try {
    const { object } = await generateObject({
      model: provider(model),
      schema: TriageSchema,
      prompt: prompt,
    });
    return object;
  } catch (error) {
    console.error(`Error with model ${model}:`, error);
    // return a default low-urgency score on API failure
    return { score: 1, reasoning: `AI model ${model} failed to respond.` };
  }
}

// -- API ROUTE --
export async function POST(req: Request) {
  try {
    const { transcript, persona } = await req.json();

    if (!transcript || !persona) {
      return NextResponse.json({ error: 'Missing transcript or persona' }, { status: 400 });
    }

    const fullTranscript = Array.isArray(transcript) ? transcript.join(' ') : transcript;
    const prompt = createTriagePrompt(fullTranscript, persona);

    // promise.all() to hit the 3 models in parallel
    const [geminiResult, gptOssResult, llamaMaverickResult] = await Promise.all([
      runTriage(google, 'gemini-2.5-flash', prompt),
      runTriage(groq, 'openai/gpt-oss-120b', prompt),
      runTriage(groq, 'meta-llama/llama-4-maverick-17b-128e-instruct', prompt),
    ]);

    // -- SCORING ALGORITHM --
    const scores = [geminiResult.score, gptOssResult.score, llamaMaverickResult.score];
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.map(s => (s - mean) ** 2).reduce((a, b) => a + b, 0) / scores.length;

    let finalScore: number;
    let finalReasoning: string;

    // if variance > 3, models disagree significantly. take the highest score as a precaution.
    if (variance > 3) {
      finalScore = Math.max(...scores);
      finalReasoning = "High variance in AI assessment; escalating to highest determined urgency score as a precaution. " +
        [geminiResult, gptOssResult, llamaMaverickResult].find(r => r.score === finalScore)?.reasoning;
    } else {
      // calc weighted avg: gemini(0.4) + others(0.3)
      finalScore = (geminiResult.score * 0.4) + (gptOssResult.score * 0.3) + (llamaMaverickResult.score * 0.3);
      // reasoning from the primary model (Gemini)
      finalReasoning = geminiResult.reasoning;
    }


    const responsePayload = {
      gemini: geminiResult,
      gpt_oss: gptOssResult,
      llama_maverick: llamaMaverickResult,
      finalScore: parseFloat(finalScore.toFixed(2)),
      finalReasoning,
      variance: parseFloat(variance.toFixed(2)),
    };

    return NextResponse.json(responsePayload);

  } catch (error) {
    console.error('Triage analysis failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}