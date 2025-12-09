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
            You are TriageX, a world-class medical diagnosis ensemble. Your role is to analyze a patient's conversation transcript and provide a preliminary triage assessment.
            
            Patient Profile:
            Name: ${patientContext.name}
            Age: ${patientContext.age}
            NRIC: ${patientContext.nric}
            
            Known Medical History (FHIR Source):
            ${medicalHistory || 'No history available.'}

            The full conversation is as follows:
            ${conversationHistory.map((msg: Message) => `${msg.role}: ${msg.text}`).join('\n')}

            Based on this conversation and the patient's background, provide a triage ticket.
            Respond with a JSON object ONLY, with the following schema:
            {
              "urgency": "'critical' | 'high' | 'medium' | 'low'",
              "specialty": "Suggested Medical Specialty (e.g., Cardiology, Neurology)",
              "reasoning": "A concise explanation for your assessment. Reference their medical history if relevant.",
              "suggestedActions": ["Action 1", "Action 2", "Action 3"]
            }
        `;

        // Parallel API calls to the model ensemble
        const [geminiFlashResponse, gptOssResponse, llamaMaverickResponse] = await Promise.all([
            generateText({ model: google('gemini-2.5-flash'), prompt: analysisPrompt }),
            generateText({ model: groq('openai/gpt-oss-120b'), prompt: analysisPrompt }),
            generateText({ model: groq('meta-llama/llama-4-maverick-17b-128e-instruct'), prompt: analysisPrompt }),
        ]);

        const geminiFlashParsedResult = JSON.parse(geminiFlashResponse.text.replace(/```json\n|\n```/g, '').trim());
        const gptOssParsedResult = JSON.parse(gptOssResponse.text.replace(/```json\n|\n```/g, '').trim());
        const llamaMaverickParsedResult = JSON.parse(llamaMaverickResponse.text.replace(/```json\n|\n```/g, '').trim());

        // Simple majority vote for 'urgency' and 'specialty'
        const urgencies = [geminiFlashParsedResult.urgency, gptOssParsedResult.urgency, llamaMaverickParsedResult.urgency];
        const specialties = [geminiFlashParsedResult.specialty, gptOssParsedResult.specialty, llamaMaverickParsedResult.specialty];

        const finalUrgency = urgencies.sort((a,b) => urgencies.filter(v => v===a).length - urgencies.filter(v => v===b).length).pop();
        const finalSpecialty = specialties.sort((a,b) => specialties.filter(v => v===a).length - specialties.filter(v => v===b).length).pop();


        // Combine reasoning and actions from all models
        const finalReasoning = `
            Gemini-2.5-Flash (Google): ${geminiFlashParsedResult.reasoning}\n
GPT-OSS-120B (Groq): ${gptOssParsedResult.reasoning}\n
Llama 4 Maverick (Groq): ${llamaMaverickParsedResult.reasoning}
        `;

        const finalSuggestedActions = [
            ...new Set ([ // Use a Set to remove duplicate actions
                ...geminiFlashParsedResult.suggestedActions,
                ...gptOssParsedResult.suggestedActions,
                ...llamaMaverickParsedResult.suggestedActions
            ])
        ];

        const finalTriageTicket = {
            urgency: finalUrgency,
            specialty: finalSpecialty,
            reasoning: finalReasoning.trim(),
            suggestedActions: Array.from(finalSuggestedActions).slice(0, 4), // Limit to top 4 unique actions
        };

        return NextResponse.json(finalTriageTicket);

    } catch (error) {
        console.error('Error in analyze route:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: `Failed to analyze conversation: ${errorMessage}` }, { status: 500 });
    }
}
