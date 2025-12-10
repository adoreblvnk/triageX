'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bot, FileAudio, Stethoscope, Activity, CheckCircle, Brain, Server } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProcessingHUDProps {
  status: 'processing' | 'analyzing';
}

export function ProcessingHUD({ status }: ProcessingHUDProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Reset stage when status changes
    setStage(0);
    
    if (status === 'processing') {
      const timer1 = setTimeout(() => setStage(1), 1500);
      return () => clearTimeout(timer1);
    } 
    
    if (status === 'analyzing') {
      // Sequence: 0: Init models, 1: Running, 2: Consensus
      const timer1 = setTimeout(() => setStage(1), 800);
      const timer2 = setTimeout(() => setStage(2), 2500);
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }

  }, [status]);

  if (status === 'processing') {
    return (
      <div className="w-full max-w-md mx-auto font-mono text-sm">
        <div className="space-y-4">
          <HUDItem 
            icon={<FileAudio className="w-4 h-4" />}
            label="Isolating voice stream..."
            state={stage >= 0 ? 'completed' : 'pending'}
          />
           <HUDItem 
            icon={<Activity className="w-4 h-4" />}
            label="Buffering audio buffer (16kHz)..."
            state={stage >= 0 ? 'completed' : 'pending'}
            delay={0.2}
          />
          <AnimatePresence>
            {stage >= 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <HUDItem 
                  icon={<Server className="w-4 h-4" />}
                  label="Sending to ElevenLabs Scribe v1..."
                  state="active"
                />
                 <HUDItem 
                  icon={<Brain className="w-4 h-4" />}
                  label="Verifying medical terminology..."
                  state="pending"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Analyzing Status
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-3 gap-4 mb-8">
        <ModelCard 
            name="Gemini 2.5" 
            role="Primary Diagnostic"
            state={stage >= 2 ? 'complete' : stage >= 1 ? 'analyzing' : 'pending'}
            delay={0}
        />
        <ModelCard 
            name="GPT-OSS" 
            role="Second Opinion"
            state={stage >= 2 ? 'complete' : stage >= 1 ? 'analyzing' : 'pending'}
            delay={0.2}
        />
        <ModelCard 
            name="Llama 4" 
            role="Safety Guardrail"
            state={stage >= 2 ? 'complete' : stage >= 1 ? 'analyzing' : 'pending'}
            delay={0.4}
        />
      </div>
      
      <div className="flex justify-center">
        <AnimatePresence mode='wait'>
            {stage < 2 ? (
                 <motion.div 
                    key="collating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-zinc-400 font-mono"
                 >
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>Running multi-agent consensus protocol...</span>
                 </motion.div>
            ) : (
                <motion.div 
                    key="done"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-green-400 font-mono"
                 >
                    <CheckCircle className="w-4 h-4" />
                    <span>Consensus Reached. Formatting Receipt.</span>
                 </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function HUDItem({ icon, label, state, delay = 0 }: { icon: any, label: string, state: 'pending' | 'active' | 'completed', delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`flex items-center gap-3 ${
        state === 'active' ? 'text-blue-400' : 
        state === 'completed' ? 'text-zinc-500 line-through' : 'text-zinc-600'
      }`}
    >
      <div className={`${state === 'active' ? 'animate-pulse' : ''}`}>
        {state === 'completed' ? <CheckCircle className="w-4 h-4" /> : icon}
      </div>
      <span>{label}</span>
      {state === 'active' && <span className="ml-auto text-xs animate-pulse">PROCESSING</span>}
    </motion.div>
  )
}

function ModelCard({ name, role, state, delay }: { name: string, role: string, state: 'pending' | 'analyzing' | 'complete', delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className={`
                relative p-4 border rounded-lg transition-colors duration-500
                ${state === 'complete' ? 'border-green-500/50 bg-green-500/5' : 
                  state === 'analyzing' ? 'border-blue-500/50 bg-blue-500/5' : 
                  'border-zinc-800 bg-zinc-900'}
            `}
        >
            <div className="flex justify-between items-start mb-2">
                <Bot className={`w-5 h-5 ${
                    state === 'complete' ? 'text-green-500' : 
                    state === 'analyzing' ? 'text-blue-500' : 'text-zinc-600'
                }`} />
                {state === 'analyzing' && <Activity className="w-4 h-4 text-blue-500 animate-pulse" />}
                {state === 'complete' && <span className="text-xs font-bold text-green-500">P3</span>} 
            </div>
            <div className="font-mono text-sm font-bold mb-1">{name}</div>
            <div className="text-xs text-zinc-500">{role}</div>
            
            {/* Scanline effect */}
            {state === 'analyzing' && (
                <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                     <motion.div
                        className="w-full h-1 bg-blue-500/30"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        style={{ position: 'absolute' }}
                     />
                </div>
            )}
        </motion.div>
    )
}
