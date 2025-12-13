import "dotenv/config";
import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { elevenlabs } from "@ai-sdk/elevenlabs";
import { experimental_transcribe as transcribe } from "ai";
import { generateText } from "ai";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { Message } from "@/types";
import { Buffer } from "buffer";

export const dynamic = "force-dynamic";

// --- MOCK DATA FOR SUNSET MODE ---
const MOCK_TRANSCRIPT_1 = "I was running for the bus and I fell. My ankle is very swollen and I can't put any weight on it. It hurts a lot.";

async function* streamToAsyncIterable<T>(
  stream: ReadableStream<T>,
): AsyncIterable<T> {
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

async function streamToBuffer(
  stream: ReadableStream<Uint8Array>,
): Promise<Buffer> {
  const chunks: Buffer[] = [];
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(Buffer.from(value)); // Ensure each chunk is a Buffer
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get("audio") as Blob;
    const conversationHistoryJson = formData.get(
      "conversationHistory",
    ) as string;

    // Updated data retrieval
    const patientContextJson = formData.get("patientContext") as string;
    const medicalHistory = formData.get("medicalHistory") as string;

    const conversationHistory: Message[] = JSON.parse(conversationHistoryJson || "[]");
    const patientContext = JSON.parse(patientContextJson || "{}");

    // SUNSET MODE CHECK
    // If API keys are missing, run the Simulation
    if (!process.env.ELEVENLABS_API_KEY || !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.log("⚠️ API Keys missing. Running in Mockup/Sunset Mode.");

        // Simulate Processing Delay (1.5s)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // immediately return MOCK_TRANSCRIPT_1 and MOCK_REPLY_1 for first user message
        return NextResponse.json({
            transcript: MOCK_TRANSCRIPT_1,
            aiResponseText: "",
            aiAudioBase64: null,
            status: "complete",
        });
    }

    const elevenlabsClient = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY,
    });

    if (!audioBlob) {
      return NextResponse.json(
        { error: "Missing audio blob" },
        { status: 400 },
      );
    }

    // Step 1: Transcribe Audio with Audio Isolation
    let isolatedAudioBuffer: Buffer;
    try {
      const isolatedAudioStream = await elevenlabsClient.audioIsolation.convert(
        {
          audio: audioBlob,
        },
      );
      const uint8Chunks: Uint8Array[] = [];
      for await (const chunk of streamToAsyncIterable(isolatedAudioStream)) {
        uint8Chunks.push(chunk);
      }
      isolatedAudioBuffer = Buffer.concat(
        uint8Chunks.map((c) => Buffer.from(c)),
      ); // Map to Buffer
    } catch (error: any) {
      if (error?.body?.detail?.status === "invalid_audio_duration") {
        console.log(
          "Audio duration too short for isolation, proceeding with original audio.",
        );
        const arrayBuffer = await audioBlob.arrayBuffer();
        isolatedAudioBuffer = Buffer.from(arrayBuffer);
      } else {
        throw error;
      }
    }

    let transcript = "";
    try {
      const { text } = await transcribe({
        model: elevenlabs.transcription("scribe_v1"),
        audio: isolatedAudioBuffer,
      });
      transcript = text.replace(/\s*\([^)]*\)\s*/g, " ").trim();
    } catch (error: any) {
      if (
        error.name === "AI_NoTranscriptGeneratedError" ||
        (error.name === "AI_APICallError" &&
          error.responseBody?.includes("audio_too_short"))
      ) {
        // Treat no speech as an empty transcript and continue, but don't respond.
        return NextResponse.json({
          transcript: "",
          status: "continue",
          aiResponseText: "",
          aiAudioBase64: null,
        });
      }
      throw error;
    }

    if (!transcript) {
      // If the transcript is empty after cleaning, don't proceed to the AI.
      return NextResponse.json({
        transcript: "",
        status: "continue",
        aiResponseText: "",
        aiAudioBase64: null,
      });
    }

    const newHistory: Message[] = [
      ...conversationHistory,
      {
        role: "user",
        text: transcript,
        id: `user-${Date.now()}`,
        timestamp: Date.now(),
      },
    ];

    // Step 2: Logic with Gemini (Updated System Prompt)
    const logicPrompt = `
      You are TriageX, an AI medical triage assistant.
      You are speaking with ${patientContext.name} (Age: ${patientContext.age}).

      *** MEDICAL HISTORY (FHIR) ***
      ${medicalHistory}
      ******************************

      Determine if their current symptoms are related to their history.
      Your goal is to gather enough information to form a preliminary assessment.

      Conversation History:
      ${newHistory.map((msg) => `${msg.role}: ${msg.text}`).join("\n")}

      Analyze the complete conversation. Do you have sufficient information for a preliminary diagnosis/triage?
      A minimum of one back-and-forth exchange is required.
      - If YES, and the conversation has had at least one user message and one assistant response, respond with a JSON object: {"status": "complete"}
      - If NO, generate a concise, clarifying follow-up question to gather more information. Respond with a JSON object: {"status": "continue", "text": "Your follow-up question here."}
    `;

    const { text: logicResultText } = await generateText({
      model: google("gemini-2.5-flash-lite"),
      prompt: logicPrompt,
    });

    const cleanedJsonString = logicResultText
      .replace(/```json\n|\n```/g, "")
      .trim();
    const logicResult = JSON.parse(cleanedJsonString);

    // Step 3: TTS if conversation continues
    if (logicResult.status === "continue") {
      const { text: aiResponseText } = logicResult;

      const audioStream = await elevenlabsClient.textToSpeech.stream(
        "mbL34QDB5FptPamlgvX5",
        {
          modelId: "eleven_multilingual_v2",
          text: aiResponseText,
          outputFormat: "mp3_44100_128",
          voiceSettings: {
            stability: 0,
            similarityBoost: 1.0,
            useSpeakerBoost: true,
            speed: 1,
          },
        },
      );

      const audioBuffer = await streamToBuffer(audioStream);
      const aiAudioBase64 = audioBuffer.toString("base64");

      return NextResponse.json({
        transcript,
        aiResponseText,
        aiAudioBase64,
        status: "continue",
      });
    }

    // If status is 'complete'
    return NextResponse.json({
      transcript,
      aiResponseText: "",
      aiAudioBase64: null,
      status: "complete",
    });
  } catch (error) {
    console.error("Error in conversation route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: `Failed to process conversation: ${errorMessage}` },
      { status: 500 },
    );
  }
}
