'use client';

import { useEffect, useState } from 'react';
import { PersonaGrid } from '@/app/components/persona-grid';
import { LiveTriage } from '@/app/components/live-triage';
import { HealthHubLoader } from '@/app/components/healthhub-loader';
import { TriageProvider, useTriage } from '@/app/providers/triage-provider';
import { seedDatabase, getPatientRecord } from '@/lib/fhir-service';
import { PatientProfile } from '@/types';

function TriageApp() {
  const { selectedPatient, setSelectedPatient, setMedicalHistory } = useTriage();
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);

  useEffect(() => {
    // Seed the local FHIR server on mount
    seedDatabase();
  }, []);

  const handlePatientSelect = async (patient: PatientProfile) => {
    setIsLoaderVisible(true);
    setSelectedPatient(patient);
    
    // Start fetching history immediately
    try {
        const history = await getPatientRecord(patient.id);
        setMedicalHistory(history);
    } catch (e) {
        console.error("Failed to fetch history", e);
        setMedicalHistory("Error retrieving medical history.");
    }
  };

  const handleLoaderComplete = () => {
    setIsLoaderVisible(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-zinc-100 p-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-5xl font-bold tracking-tighter mb-2">TriageX</h1>
        <p className="text-zinc-400 mb-12">Voice-First Accelerated Medical Triage</p>

        {!selectedPatient && (
            <PersonaGrid onSelect={handlePatientSelect} />
        )}

        {selectedPatient && isLoaderVisible && (
            <HealthHubLoader onComplete={handleLoaderComplete} />
        )}

        {selectedPatient && !isLoaderVisible && (
            <LiveTriage />
        )}
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