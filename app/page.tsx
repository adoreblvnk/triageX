'use client';

import { PersonaGrid } from '@/app/components/persona-grid';
import { LiveTriage } from '@/app/components/live-triage';
import { TriageProvider, useTriage } from '@/app/providers/triage-provider';

function TriageApp() {
  const { selectedPersona } = useTriage();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-zinc-100 p-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-5xl font-bold tracking-tighter mb-2">TriageX</h1>
        <p className="text-zinc-400 mb-12">Voice-First Accelerated Medical Triage</p>

        {selectedPersona ? <LiveTriage /> : <PersonaGrid />}
      </div>
    </main>
  );
}


export default function Page() {
    return (
        <TriageProvider>
            <TriageApp />
        </TriageProvider>
    )
}
