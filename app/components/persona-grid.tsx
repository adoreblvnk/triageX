'use client';

import { mockPatients } from '@/lib/mock-healthhub';
import { useTriage } from '@/app/providers/triage-provider';
import { PatientProfile } from '@/types';
import { ChevronRight, User, AlertCircle } from 'lucide-react';

export function PersonaGrid({ onSelect }: { onSelect?: (patient: PatientProfile) => void }) {
  const { setSelectedPatient } = useTriage();

  const handleSelect = (patient: PatientProfile) => {
    if (onSelect) {
      onSelect(patient);
    } else {
      setSelectedPatient(patient);
    }
  };

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-bold">Select a Patient</h2>
        <p className="text-zinc-400 text-sm">
          Select a patient profile to simulate the triage process.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-zinc-800">
        {mockPatients.map((patient, index) => (
          <button
            key={patient.id}
            onClick={() => handleSelect(patient)}
            className={`p-6 text-left hover:bg-zinc-900 transition-colors duration-200 flex justify-between items-start group
              ${index >= 2 ? 'border-t md:border-t-0' : ''} 
            `}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">{patient.name}</h3>
                <span className="px-2 py-0.5 text-xs rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {patient.age} y/o
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-zinc-500 text-sm mb-3">
                 <User size={14} />
                 <span>{patient.nric}</span>
              </div>

              {patient.chronicConditions && patient.chronicConditions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                   {patient.chronicConditions.map(condition => (
                       <span key={condition} className="px-2 py-1 text-xs rounded bg-red-900/20 text-red-400 border border-red-900/30 flex items-center gap-1">
                           <AlertCircle size={10} />
                           {condition}
                       </span>
                   ))}
                </div>
              )}
            </div>
            <div className="flex h-full items-center pl-4">
                 <ChevronRight className="w-6 h-6 text-zinc-600 group-hover:text-zinc-300" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
