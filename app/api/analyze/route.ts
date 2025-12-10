import 'dotenv/config';
import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { Message } from '@/types';


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

            OUTPUT SCHEMA (JSON ONLY):
            {
              "acuity_score": "P1" | "P2" | "P3" | "P4",
              "specialty": "Suggested Medical Specialty",
              "reasoning": "ONE sentence clinical justification.",
              "suggested_actions": ["Immediate action 1", "Immediate action 2"],
              "clinical_handoff_notes": ["Observation 1", "History Flag 1"]
            }
        `;

        // Parallel API calls
        const [geminiResponse, gptResponse, llamaResponse] = await Promise.all([
            generateText({ model: google('gemini-2.5-flash'), prompt: analysisPrompt }),
            generateText({ model: groq('openai/gpt-oss-120b'), prompt: analysisPrompt }),
            generateText({ model: groq('meta-llama/llama-4-maverick-17b-128e-instruct'), prompt: analysisPrompt }),
        ]);

        const parseResponse = (text: string) => {
            try {
                return JSON.parse(text.replace(/```json\n|\n```/g, '').trim());
            } catch (e) {
                return null;
            }
        };

        const geminiResult = parseResponse(geminiResponse.text);
        const gptResult = parseResponse(gptResponse.text);
        const llamaResult = parseResponse(llamaResponse.text);

        if (!geminiResult) throw new Error("Primary model (Gemini) failed.");

        // Construct Consensus
        const modelConsensus = [
            { model: 'Gemini 2.5 Flash', acuity: geminiResult.acuity_score, reasoning: geminiResult.reasoning },
            { model: 'GPT-OSS 120B', acuity: gptResult?.acuity_score || 'N/A', reasoning: gptResult?.reasoning || 'No response' },
            { model: 'Llama 4 Maverick', acuity: llamaResult?.acuity_score || 'N/A', reasoning: llamaResult?.reasoning || 'No response' },
        ];

        // Voting Logic (Conservative: Pick highest severity)
        const acuityPriority = { "P1": 4, "P2": 3, "P3": 2, "P4": 1, "N/A": 0 };
        const validAcuities = [geminiResult.acuity_score, gptResult?.acuity_score, llamaResult?.acuity_score].filter(Boolean);
        validAcuities.sort((a, b) => acuityPriority[b as keyof typeof acuityPriority] - acuityPriority[a as keyof typeof acuityPriority]);
        const finalAcuity = validAcuities[0] || "P3";

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

        const finalReasoning = `Ensemble consensus led by ${finalAcuity} severity trigger.`;

        const finalTriageTicket = {
            acuity_score: finalAcuity,
            specialty: geminiResult.specialty, // Default to Gemini's specialty for simplicity
            reasoning: finalReasoning,
            suggestedActions: finalSuggestedActions,
            clinical_handoff_notes: finalHandoffNotes,
            model_consensus: modelConsensus
        };

        return NextResponse.json(finalTriageTicket);

    } catch (error) {
        console.error('Error in analyze route:', error);
        return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
    }
}
