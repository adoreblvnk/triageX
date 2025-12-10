'use client';

import { motion } from 'framer-motion';
import { Bot, ShieldAlert, Calculator, ArrowDown } from 'lucide-react';

interface AcuityVisualizerProps {
  log?: {
    method: string;
    votes: { model: string; weight: number; acuity: string }[];
    final_score: number;
  };
  finalAcuity: string;
}

export function AcuityVisualizer({ log, finalAcuity }: AcuityVisualizerProps) {
  if (!log) return null;

  const isOverride = log.method.includes('Override');

  return (
    <div className="w-full mt-6 p-6 border border-zinc-800 rounded-lg bg-zinc-950/50">
      <h3 className="text-sm font-mono text-zinc-400 mb-6 flex items-center gap-2">
        <Calculator className="w-4 h-4" />
        MULTI-AGENT CONSENSUS LOGIC
      </h3>

      <div className="relative flex flex-col items-center gap-8">
        
        {/* Level 1: Models */}
        <div className="flex justify-center gap-4 w-full">
          {log.votes.map((vote, i) => (
            <motion.div
              key={vote.model}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`
                flex flex-col items-center p-3 rounded border w-1/3 max-w-[120px]
                ${vote.acuity === 'P1' ? 'border-red-500/50 bg-red-900/10' : 'border-zinc-800 bg-zinc-900'}
              `}
            >
              <Bot className="w-4 h-4 text-zinc-500 mb-2" />
              <span className="text-[10px] text-zinc-400 text-center leading-tight mb-1">{vote.model}</span>
              <span className={`font-bold font-mono ${
                  vote.acuity === 'P1' ? 'text-red-500' : 
                  vote.acuity === 'P2' ? 'text-orange-500' :
                  vote.acuity === 'P3' ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {vote.acuity}
              </span>
              <span className="text-[10px] text-zinc-600">Weight: {vote.weight}</span>
            </motion.div>
          ))}
        </div>

        {/* Connections */}
        <div className="absolute top-[80px] w-full h-8 overflow-hidden pointer-events-none">
             <svg className="w-full h-full">
                 <line x1="16%" y1="0" x2="50%" y2="100%" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 4" />
                 <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 4" />
                 <line x1="84%" y1="0" x2="50%" y2="100%" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 4" />
             </svg>
        </div>

        {/* Level 2: Engine */}
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`
                z-10 px-6 py-3 rounded-full border flex items-center gap-3
                ${isOverride ? 'border-red-500 bg-red-950/30' : 'border-blue-500 bg-blue-950/30'}
            `}
        >
            {isOverride ? <ShieldAlert className="w-5 h-5 text-red-500" /> : <Calculator className="w-5 h-5 text-blue-500" />}
            <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-zinc-200">{log.method}</span>
                {!isOverride && <span className="text-[10px] text-zinc-400">Avg Score: {log.final_score}</span>}
            </div>
        </motion.div>

        {/* Level 3: Result */}
        <motion.div
             initial={{ y: 10, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.6 }}
        >
            <ArrowDown className="w-5 h-5 text-zinc-600 mb-2 mx-auto" />
            <div className="px-8 py-4 bg-zinc-900 border border-zinc-700 rounded text-center">
                <div className="text-xs text-zinc-500 mb-1">FINAL ACUITY</div>
                <div className={`text-4xl font-bold font-mono ${
                     finalAcuity === 'P1' ? 'text-red-500' : 
                     finalAcuity === 'P2' ? 'text-orange-500' :
                     finalAcuity === 'P3' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                    {finalAcuity}
                </div>
            </div>
        </motion.div>

      </div>
    </div>
  );
}
