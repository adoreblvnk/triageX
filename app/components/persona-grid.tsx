'use client';
import { motion } from 'framer-motion';
import { mockPersonas } from '@/lib/mock-healthhub';
import { useTriage } from '@/app/providers/triage-provider';
import { cn } from '@/lib/utils';

export function PersonaGrid() {
  const { dispatch, state } = useTriage();

  return (
    <div className="w-full">
        <h2 className="font-sans text-2xl mb-4 border-b border-zinc-800 pb-2">SELECT PATIENT PROFILE</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-zinc-800 border border-zinc-800">
        {mockPersonas.map((persona) => (
            <motion.div
            key={persona.id}
            onClick={() => dispatch({ type: 'SELECT_PERSONA', payload: persona })}
            className={cn(
                'group p-4 bg-black cursor-pointer',
                'hover:bg-zinc-100 hover:text-black transition-colors duration-200',
                 state.currentPersona?.id === persona.id && 'bg-zinc-100 text-black'
            )}
            whileTap={{ scale: 0.98 }}
            >
            <div className="text-4xl mb-4">{persona.avatar}</div>
            <h3 className="font-sans text-lg font-bold">{persona.name}</h3>
            <p className="font-mono text-sm opacity-70">{persona.age} years old</p>
            <p className="font-mono text-xs mt-2 opacity-50">{persona.history.join(', ')}</p>
            </motion.div>
        ))}
        </div>
    </div>
  );
}
