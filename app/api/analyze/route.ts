import 'dotenv/config';
import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';
import { Message } from '@/types';

// Define the schema for structured output
const TriageSchema = z.object({
  acuity_score: z.enum(['P1', 'P2', 'P3', 'P4']),
  specialty: z.string(),
  reasoning: z.string(),
  suggested_actions: z.array(z.string()),
  clinical_handoff_notes: z.array(z.string())
});

export async function POST(req: NextRequest) {
    try {
        const { conversationHistory, patientContext, medicalHistory } = await req.json();

        if (!conversationHistory || !patientContext) {
            return NextResponse.json({ error: 'Missing conversation history or patient context' }, { status: 400 });
        }

        const analysisPrompt = `
            CONTEXT: The user is a patient CURRENTLY ONSITE at a Singapore Polyclinic.
            
            YOUR ROLE: Act as an advanced clinical triage AI.
            
            TASK:
            1. Assign a PAC (Patient Acuity Category) Score: P1 (Critical), P2 (Major Emergency), P3 (Minor Emergency), P4 (Non-Emergency).
            2. Suggest immediate actions (Suggested Actions).
            3. Write concise clinical notes for the doctor (Handoff Notes).

            INPUT DATA:
            Patient: ${patientContext.name} (${patientContext.age} yo, NRIC: ${patientContext.nric})
            Medical History: ${medicalHistory || 'None available.'}
            Transcript:
            ${conversationHistory.map((msg: Message) => `${msg.role}: ${msg.text}`).join('\n')}
        `;

        // Helper for safe generation
        const safeGenerate = async (model: any, prompt: string) => {
            try {
                const { object } = await generateObject({
                    model,
                    schema: TriageSchema,
                    prompt,
                });
                return object;
            } catch (e) {
                console.error(`Model failed:`, e);
                return null;
            }
        };

        // Parallel API calls with structured output
        const [geminiResult, gptResult, llamaResult] = await Promise.all([
            safeGenerate(google('gemini-2.5-flash'), analysisPrompt),
            safeGenerate(groq('openai/gpt-oss-120b'), analysisPrompt),
            safeGenerate(groq('meta-llama/llama-4-maverick-17b-128e-instruct'), analysisPrompt),
        ]);

        if (!geminiResult) throw new Error("Primary model (Gemini) failed.");

        // Construct Consensus
        const modelConsensus = [
            { model: 'Gemini 2.5 Flash', acuity: geminiResult.acuity_score, reasoning: geminiResult.reasoning },
            { model: 'GPT-OSS 120B', acuity: gptResult?.acuity_score || 'N/A', reasoning: gptResult?.reasoning || 'No response' },
            { model: 'Llama 4 Maverick', acuity: llamaResult?.acuity_score || 'N/A', reasoning: llamaResult?.reasoning || 'No response' },
        ];

        // Voting Logic (Safety-First Consensus)
        const acuityWeights = { "P1": 4, "P2": 3, "P3": 2, "P4": 1, "N/A": 0 };
        const validResults = [geminiResult, gptResult, llamaResult].filter(r => r && r.acuity_score);
        
        // 1. Safety Override Check
        const criticalVote = validResults.find(r => r?.acuity_score === 'P1');
        
        let finalAcuity = 'P3';
        let consensusMethod = 'Standard Weighted Average';
        let finalScore = 0;

        const votes = [
            { model: 'Gemini 2.5 Flash', acuity: geminiResult.acuity_score, weight: acuityWeights[geminiResult.acuity_score as keyof typeof acuityWeights] || 0 },
            { model: 'GPT-OSS 120B', acuity: gptResult?.acuity_score || 'N/A', weight: acuityWeights[gptResult?.acuity_score as keyof typeof acuityWeights] || 0 },
            { model: 'Llama 4 Maverick', acuity: llamaResult?.acuity_score || 'N/A', weight: acuityWeights[llamaResult?.acuity_score as keyof typeof acuityWeights] || 0 },
        ];

        if (criticalVote) {
            finalAcuity = 'P1';
            consensusMethod = 'Safety Protocol Override (P1 Detected)';
            finalScore = 4;
        } else {
            // 2. Weighted Average
            const totalWeight = votes.reduce((sum, v) => sum + v.weight, 0);
            const validVoteCount = votes.filter(v => v.weight > 0).length;
            const averageScore = validVoteCount > 0 ? totalWeight / validVoteCount : 0;
            
            // Ceiling of average (e.g., 2.3 -> 3 (P2))
            const roundedScore = Math.ceil(averageScore);
            finalScore = roundedScore;
            
            // Map back to P-score
            const scoreToAcuity = { 4: 'P1', 3: 'P2', 2: 'P3', 1: 'P4', 0: 'P4' };
            finalAcuity = scoreToAcuity[roundedScore as keyof typeof scoreToAcuity] || 'P3';
        }

        const calculationLog = {
            method: consensusMethod,
            votes: votes,
            final_score: finalScore
        };

        // Aggregate Actions
        const finalSuggestedActions = [
            ...new Set([
                ...(geminiResult.suggested_actions || []),
                ...(gptResult?.suggested_actions || []),
                ...(llamaResult?.suggested_actions || [])
            ])
        ].slice(0, 4);

        const finalHandoffNotes = [
            ...new Set([
                ...(geminiResult.clinical_handoff_notes || []),
                ...(gptResult?.clinical_handoff_notes || []),
                ...(llamaResult?.clinical_handoff_notes || [])
            ])
        ].slice(0, 5);

        // Concatenate reasonings for frontend display
        const finalReasoning = modelConsensus.map(
            opinion => `${opinion.model}: ${opinion.reasoning}`
        ).join('\n\n');

        const finalTriageTicket = {
            acuity_score: finalAcuity,
            specialty: geminiResult.specialty, // Default to Gemini's specialty for simplicity
            reasoning: finalReasoning,
            suggestedActions: finalSuggestedActions, // Map snake_case to camelCase
            clinical_handoff_notes: finalHandoffNotes,
            model_consensus: modelConsensus,
            calculation_log: calculationLog
        };

        return NextResponse.json(finalTriageTicket);

    } catch (error) {
        console.error('Error in analyze route:', error);
        return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
    }
}