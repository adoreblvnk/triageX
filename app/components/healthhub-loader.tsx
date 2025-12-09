'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Database, FileKey, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HealthHubLoaderProps {
  onComplete: () => void;
}

const steps = [
  { text: 'Authenticating SingPass...', icon: ShieldCheck },
  { text: 'Retrieving FHIR Resources...', icon: Database },
  { text: 'Decrypting PHI...', icon: FileKey },
  { text: 'Access Granted', icon: CheckCircle },
];

export function HealthHubLoader({ onComplete }: HealthHubLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timeout = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 800); // 800ms per step -> ~3.2s total
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentStep, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
        <div className="flex items-center justify-center mb-8">
           {/* Simple text logo to mimic GovTech/HealthHub branding */}
           <div className="text-2xl font-bold tracking-tight text-white">
             <span className="text-red-500">Health</span>Hub
             <span className="ml-2 text-xs uppercase tracking-widest text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded">Secure Connect</span>
           </div>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isPending = index > currentStep;

            return (
              <div
                key={index}
                className={`flex items-center gap-4 transition-all duration-300 ${
                  isPending ? 'opacity-30' : 'opacity-100'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border ${
                    isActive
                      ? 'border-blue-500 bg-blue-500/10 text-blue-500 animate-pulse'
                      : isCompleted
                      ? 'border-green-500 bg-green-500/10 text-green-500'
                      : 'border-zinc-700 bg-zinc-800 text-zinc-500'
                  }`}
                >
                  <Icon size={16} />
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-zinc-500'
                  }`}
                >
                  {step.text}
                </span>
                {isActive && (
                    <motion.div 
                        layoutId="active-indicator"
                        className="ml-auto w-2 h-2 rounded-full bg-blue-500" 
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min(((currentStep) / (steps.length - 1)) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>
      </div>
    </div>
  );
}
