'use client';

import { mockPersonas } from '@/lib/mock-healthhub';
import { useTriage } from '@/app/providers/triage-provider';
import { Persona } from '@/types';
import { ChevronRight } from 'lucide-react';

export function PersonaGrid() {
  const { setSelectedPersona } = useTriage();

  const handleSelect = (persona: Persona) => {
    setSelectedPersona(persona);
  };

  return (
    <div className="border border-zinc-800">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-xl font-bold">Select a Triage Persona</h2>
        <p className="text-zinc-400 text-sm">
          Choose a specialist to begin your consultation.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {mockPersonas.map((persona, index) => (
          <button
            key={persona.id}
            onClick={() => handleSelect(persona)}
            className={`p-6 text-left hover:bg-zinc-900 transition-colors duration-200 flex justify-between items-center
              ${index % 2 === 0 ? 'border-r border-zinc-800' : ''}
              ${index < mockPersonas.length - 2 ? 'border-b border-zinc-800' : ''}
            `}
          >
            <div>
              <p className="text-lg font-semibold">{persona.name}</p>
              <p className="text-sm text-zinc-400">{persona.title}</p>
              <p className="text-sm text-red-600 mt-1">{persona.specialty}</p>
            </div>
            <ChevronRight className="w-6 h-6 text-zinc-600" />
          </button>
        ))}
      </div>
    </div>
  );
}