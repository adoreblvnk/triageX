import 'dotenv/config';
import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { Message } from '@/types';

// Mocks for models that are not directly available via a simple SDK
const mockGptOss = {
    generate: async (prompt: string) => {
        console.log('MOCK CALL to gpt-oss-120b with prompt:', prompt);
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        return JSON.stringify({
            urgency: 'high',
            specialty: 'Cardiology',
            reasoning: '[GPT-OSS-120b MOCK] Patient is exhibiting classic signs of acute coronary syndrome. The chest pain description is a major indicator.',
            suggestedActions: ['Administer aspirin', 'Perform ECG immediately', 'Prepare for cardiac catheterization'],
        });
    }
};

const mockLlama = {
    generate: async (prompt: string) => {
        console.log('MOCK CALL to llama-4-maverick with prompt:', prompt);
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        return JSON.stringify({
            urgency: 'high',
            specialty: 'Cardiology',
            reasoning: '[LLAMA-4-MAVERICK MOCK] The radiating pain and shortness of breath strongly suggest a cardiac event. Immediate workup is necessary.',
            suggestedActions: ['Check vital signs continuously', 'Administer oxygen', 'Draw blood for cardiac enzyme tests'],
        });
    }
};


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
        const [geminiResultText, gptResultText, llamaResultText] = await Promise.all([
            generateText({ model: google('models/gemini-2.5-pro'), prompt: analysisPrompt }),
            mockGptOss.generate(analysisPrompt),
            mockLlama.generate(analysisPrompt),
        ]);

        const geminiResult = JSON.parse(geminiResultText.text.replace(/```json\n|\n```/g, '').trim());
        const gptResult = JSON.parse(gptResultText);
        const llamaResult = JSON.parse(llamaResultText);

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
