import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
        return NextResponse.json({ keywords: [] });
    }
  
    const { object } = await generateObject({
        model: google('gemini-2.5-flash-lite'), 
        schema: z.object({
            keywords: z.array(z.string())
        }),
        prompt: `Extract all medical keywords (symptoms, medications, anatomy, conditions, severity indicators) from the following text. Return them as a list of strings exactly as they appear in the text. 
        
        Text: "${text}"`
    });
  
    return NextResponse.json(object);
  } catch (error) {
    console.error("Highlight error:", error);
    return NextResponse.json({ keywords: [] });
  }
}
