"use server";

export async function getSystemStatus() {
  const hasKeys = !!(
    process.env.ELEVENLABS_API_KEY &&
    process.env.GOOGLE_GENERATIVE_AI_API_KEY &&
    process.env.GROQ_API_KEY
  );
  return { isSunsetMode: !hasKeys };
}
