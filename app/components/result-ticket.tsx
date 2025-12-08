'use client';

import { FileText, TriangleAlert } from 'lucide-react';
import { useTriage } from '../providers/triage-provider';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function ResultTicket() {
  const { state, dispatch } = useTriage();
  const { triageResult, currentPersona } = state;

  if (!triageResult || !currentPersona) return null;

  // if critical, force red theme
  const isCritical = triageResult.finalScore > 7;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className={cn(
          'w-full bg-zinc-100 text-black font-mono p-6 border-2 mt-px',
          isCritical ? 'border-red-600' : 'border-black'
        )}
      >
        <header className="text-center pb-4 border-b-2 border-dashed border-zinc-400">
          <h2 className="text-2xl font-sans font-bold tracking-widest">TRIAGEX ASSESSMENT</h2>
          <p className="text-sm">URGENCY REPORT</p>
        </header>

        <section className="py-4 border-b-2 border-dashed border-zinc-400">
          <div className="flex justify-between">
            <span>PATIENT:</span>
            <span>{currentPersona.name}, {currentPersona.age}YRS</span>
          </div>
          <div className="flex justify-between">
            <span>TIMESTAMP:</span>
            <span>{new Date().toISOString()}</span>
          </div>
        </section>

        <section className="py-6 text-center">
          <p className="text-lg">FINAL URGENCY SCORE</p>
          <div className={cn('text-8xl font-sans font-bold my-2', isCritical && 'text-red-600')}>
            {triageResult.finalScore.toFixed(1)}
            <span className="text-4xl">/10</span>
          </div>
          {isCritical && (
            <div className="flex items-center justify-center gap-2 text-red-600 font-bold animate-pulse">
                <TriangleAlert size={16}/>
                <span>IMMEDIATE ATTENTION REQUIRED</span>
            </div>
          )}
        </section>

        <section className="py-4 border-t-2 border-dashed border-zinc-400">
            <h3 className="font-sans font-bold text-lg mb-2 flex items-center gap-2"><FileText size={16}/> CLINICAL RATIONALE</h3>
            <p className="text-sm">
                {triageResult.finalReasoning}
            </p>
        </section>

        <footer className="mt-6 text-center text-xs text-zinc-500">
            <p>
              AI SCORE VARIANCE: {triageResult.variance}
              (GEMINI: {triageResult.gemini.score},
              GPT_OSS: {triageResult.gpt_oss.score},
              LLAMA_MAVERICK: {triageResult.llama_maverick.score})
            </p>
            <p className="mt-2">*** THIS IS AN AI-GENERATED TRIAGE SUGGESTION. NOT A MEDICAL DIAGNOSIS. ***</p>
        </footer>

        <button
            onClick={() => dispatch({ type: 'RESET_SESSION' })}
            className="w-full mt-6 bg-black text-white p-3 font-sans text-base hover:bg-zinc-800 transition-colors"
        >
            START NEW TRIAGE SESSION
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
