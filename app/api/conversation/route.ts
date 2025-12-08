import 'dotenv/config';
import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { elevenlabs } from '@ai-sdk/elevenlabs';
import { experimental_transcribe as transcribe } from 'ai';
import { generateText } from 'ai';
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { Message } from '@/types';

const elevenlabsClient = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export const dynamic = 'force-dynamic';

async function* streamToAsyncIterable<T>(stream: ReadableStream<T>): AsyncIterable<T> {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
    const chunks: Buffer[] = [];
    const reader = stream.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        chunks.push(value);
    }
    return Buffer.concat(chunks);
}


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get('audio') as Blob;
    const conversationHistoryJson = formData.get('conversationHistory') as string;
    const personaContextJson = formData.get('personaContext') as string;

    const conversationHistory: Message[] = JSON.parse(conversationHistoryJson || '[]');
    const personaContext = JSON.parse(personaContextJson || '{}');

    if (!audioBlob) {
      return NextResponse.json({ error: 'Missing audio blob' }, { status: 400 });
    }

    // Step 1: Transcribe Audio with Audio Isolation
    let isolatedAudioBuffer: Buffer;
    try {
        const isolatedAudioStream = await elevenlabsClient.audioIsolation.convert({
            audio: audioBlob,
        });
        const chunks = [];
        for await (const chunk of streamToAsyncIterable(isolatedAudioStream)) {
            chunks.push(chunk);
        }
        isolatedAudioBuffer = Buffer.concat(chunks);
    } catch (error: any) {
        if (error?.body?.detail?.status === 'invalid_audio_duration') {
            console.log('Audio duration too short for isolation, proceeding with original audio.');
            const arrayBuffer = await audioBlob.arrayBuffer();
            isolatedAudioBuffer = Buffer.from(arrayBuffer);
        } else {
            throw error;
        }
    }

    let transcript = '';
    try {
        const { text } = await transcribe({
            model: elevenlabs.transcription('scribe_v1'),
            audio: isolatedAudioBuffer,
        });
        transcript = text.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
    } catch (error: any) {
        if (error.name === 'AI_NoTranscriptGeneratedError' || (error.name === 'AI_APICallError' && error.responseBody?.includes('audio_too_short'))) {
            // Treat no speech as an empty transcript and continue, but don't respond.
            return NextResponse.json({ transcript: '', status: 'continue', aiResponseText: '', aiAudioBase64: null });
        }
        throw error;
    }

    if (!transcript) {
        // If the transcript is empty after cleaning, don't proceed to the AI.
        return NextResponse.json({ transcript: '', status: 'continue', aiResponseText: '', aiAudioBase64: null });
    }

    const newHistory: Message[] = [...conversationHistory, { role: 'user', text: transcript, id: `user-${Date.now()}`, timestamp: Date.now() }];

    // Step 2: Logic with Gemini
    const logicPrompt = `
      You are a medical triage AI. Your role is to determine if you have enough information to make a diagnosis recommendation.
      The user is describing their symptoms. You are speaking with a patient as a ${personaContext.name}, a specialist in ${personaContext.specialty}.
      Conversation History:
      ${newHistory.map(msg => `${msg.role}: ${msg.text}`).join('\n')}

      Analyze the complete conversation. Do you have sufficient information for a preliminary diagnosis?
      A minimum of one back-and-forth exchange is required.
      - If YES, and the conversation has had at least one user message and one assistant response, respond with a JSON object: {"status": "complete"}
      - If NO, generate a concise, clarifying follow-up question to gather more information. Respond with a JSON object: {"status": "continue", "text": "Your follow-up question here."}
    `;

    const { text: logicResultText } = await generateText({
      model: google('models/gemini-2.5-flash-lite'),
      prompt: logicPrompt,
    });

    const cleanedJsonString = logicResultText.replace(/```json\n|\n```/g, '').trim();
    const logicResult = JSON.parse(cleanedJsonString);

    // Step 3: TTS if conversation continues
    if (logicResult.status === 'continue') {
      const { text: aiResponseText } = logicResult;

      const audioStream = await elevenlabsClient.textToSpeech.stream('mbL34QDB5FptPamlgvX5',{
        modelId: 'eleven_multilingual_v2',
        text: aiResponseText,
        outputFormat: 'mp3_44100_128',
              voiceSettings: {
        stability: 0,
        similarityBoost: 1.0,
        useSpeakerBoost: true,
        speed: 1,
      },
      });

      const audioBuffer = await streamToBuffer(audioStream);
      const aiAudioBase64 = audioBuffer.toString('base64');

      return NextResponse.json({
        transcript,
        aiResponseText,
        aiAudioBase64,
        status: 'continue',
      });
    }

    // If status is 'complete'
    return NextResponse.json({
      transcript,
      aiResponseText: '',
      aiAudioBase64: null,
      status: 'complete',
    });

  } catch (error) {
    console.error('Error in conversation route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to process conversation: ${errorMessage}` }, { status: 500 });
  }
}
