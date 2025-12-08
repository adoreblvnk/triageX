'use client';
import { PersonaGrid } from './components/persona-grid';
import { LiveTriage } from './components/live-triage';
import { ResultTicket } from './components/result-ticket';
import { useTriage } from './providers/triage-provider';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const { state } = useTriage();
  const { currentPersona, analysisStatus } = state;

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-start p-4 md:p-8">
      <header className="w-full mb-8 text-center border-b border-zinc-800 pb-4">
        <h1 className="font-sans text-5xl font-bold tracking-tighter">Triage<span className="text-accent">X</span></h1>
        <p className="font-mono text-zinc-500">Multi-AI Medical Triage System</p>
      </header>

      <div className="w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!currentPersona ? (
            <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
              <PersonaGrid />
            </motion.div>
          ) : analysisStatus === 'complete' ? (
             <motion.div
                key="ticket"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                <ResultTicket />
            </motion.div>
          ) : (
            <motion.div
                key="triage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
              <LiveTriage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}