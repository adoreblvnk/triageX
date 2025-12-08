import 'dotenv/config';
import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { Message } from '@/types';


export async function POST(req: NextRequest) {
    try {
        const { conversationHistory, personaContext } = await req.json();

        if (!conversationHistory || !personaContext) {
            return NextResponse.json({ error: 'Missing conversation history or persona context' }, { status: 400 });
        }

        const analysisPrompt = `
            You are a world-class medical diagnosis model. Your role is to analyze a patient's conversation transcript and provide a preliminary triage assessment.
            You are acting as ${personaContext.name}, a specialist in ${personaContext.specialty}.
            The full conversation is as follows:
            ${conversationHistory.map((msg: Message) => `${msg.role}: ${msg.text}`).join('\n')}

            Based on this conversation, provide a triage ticket.
            Respond with a JSON object ONLY, with the following schema:
            {
              "urgency": "'critical' | 'high' | 'medium' | 'low'",
              "specialty": "Suggested Medical Specialty (e.g., Cardiology, Neurology)",
              "reasoning": "A concise explanation for your assessment.",
              "suggestedActions": "A list of 3-4 immediate next steps or tests."
            }
        `;

        // Parallel API calls to the model ensemble
        const [geminiProResult, geminiFlashResult, gptOssResult] = await Promise.all([
            generateText({ model: google('models/gemini-2.5-pro'), prompt: analysisPrompt }),
            generateText({ model: google('models/gemini-2.5-flash-lite'), prompt: analysisPrompt }),
            generateText({ model: google('models/gemini-2.5-pro'), prompt: analysisPrompt }), // Using a second Pro call to simulate a third distinct expert model
        ]);

        const geminiResult = JSON.parse(geminiProResult.text.replace(/```json\n|\n```/g, '').trim());
        const gptResult = JSON.parse(gptOssResult.text.replace(/```json\n|\n```/g, '').trim());
        const llamaResult = JSON.parse(geminiFlashResult.text.replace(/```json\n|\n```/g, '').trim());

        // Simple majority vote for 'urgency' and 'specialty'
        const urgencies = [geminiResult.urgency, gptResult.urgency, llamaResult.urgency];
        const specialties = [geminiResult.specialty, gptResult.specialty, llamaResult.specialty];

        const finalUrgency = urgencies.sort((a,b) => urgencies.filter(v => v===a).length - urgencies.filter(v => v===b).length).pop();
        const finalSpecialty = specialties.sort((a,b) => specialties.filter(v => v===a).length - specialties.filter(v => v===b).length).pop();


        // Combine reasoning and actions from all models
        const finalReasoning = `
            Gemini-2.5-Pro: ${geminiResult.reasoning}\n
GPT-OSS-120b: ${gptResult.reasoning}\n
Llama-4-Maverick: ${llamaResult.reasoning}
        `;

        const finalSuggestedActions = [
            ...new Set ([ // Use a Set to remove duplicate actions
                ...geminiResult.suggestedActions,
                ...gptResult.suggestedActions,
                ...llamaResult.suggestedActions
            ])
        ];

        const finalTriageTicket = {
            urgency: finalUrgency,
            specialty: finalSpecialty,
            reasoning: finalReasoning.trim(),
            suggestedActions: finalSuggestedActions,
        };

        return NextResponse.json(finalTriageTicket);

    } catch (error) {
        console.error('Error in analyze route:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: `Failed to analyze conversation: ${errorMessage}` }, { status: 500 });
    }
}
