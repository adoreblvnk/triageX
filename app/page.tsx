"use client";

import { useEffect, useState } from "react";
import { PersonaGrid } from "@/app/components/persona-grid";
import { LiveTriage } from "@/app/components/live-triage";
import { HealthHubLoader } from "@/app/components/healthhub-loader";
import { TriageProvider, useTriage } from "@/app/providers/triage-provider";
import { seedDatabase, getPatientRecord } from "@/lib/fhir-service";
import { getSystemStatus } from "@/app/actions/system-status";
import { PatientProfile } from "@/types";
import { Trophy, ExternalLink, AlertTriangle, Info } from "lucide-react";
import Image from "next/image";

function TriageApp() {
  const { selectedPatient, setSelectedPatient, setMedicalHistory } =
    useTriage();
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [isSunsetMode, setIsSunsetMode] = useState(false);

  useEffect(() => {
    // Seed the local FHIR server on mount
    seedDatabase();

    // Check system status (API keys)
    getSystemStatus().then((status) => {
      setIsSunsetMode(status.isSunsetMode);
    });
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
    // Added pb-12 to bottom for spacing
    <main className="flex flex-1 flex-col items-center justify-center bg-black text-zinc-100 p-8 pt-24 pb-12 w-full">
      <div className="w-full max-w-4xl text-center">
        {/* Main Title */}
        <h1 className="text-5xl font-bold tracking-tighter mb-2">TriageX</h1>

        {/* Subtitle with Sunset Badge */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <p className="text-zinc-400">
            Voice-First Accelerated Medical Triage
          </p>
          {isSunsetMode && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-950/40 border border-orange-900/50 text-[10px] font-bold uppercase tracking-wider text-orange-500">
              <AlertTriangle className="w-3 h-3" />
              Sunset Mode
            </span>
          )}
        </div>

        {/* Sunset Explanation Notice */}
        {isSunsetMode && !selectedPatient && (
          <div className="max-w-2xl mx-auto mb-10 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-left flex gap-3 animate-fade-in">
            <Info className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-zinc-500 leading-relaxed">
                Live API keys have been removed post-hackathon. TriageX now runs in simulation mode with mock data.
              </p>
            </div>
          </div>
        )}

        {/* --- Hackathon Winner Banner --- */}
        {!selectedPatient && (
          <div className="mb-12 p-6 rounded-xl animate-fade-in">
            <div className="flex flex-col items-center gap-4">
              {/* Prize Header */}
              <div className="flex items-center gap-2 text-yellow-500 bg-yellow-950/30 px-4 py-1.5 rounded-full border border-yellow-900/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  1st Place Winner ($4,000 Prize)
                </span>
              </div>

              {/* Logos Grid */}
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-2">
                {/* Hackathon Name */}
                <a
                  href="https://hackrift2025.devpost.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl font-bold text-white hover:text-yellow-400 transition-colors flex items-center gap-2"
                >
                  HackRift 2025
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </a>

                {/* Organizer */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                    Organized By
                  </span>
                  <div className="flex items-center gap-4">

                  <a
                    href="https://www.singaporetech.edu.sg"
                    target="_blank"
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <Image src="/logos/sit.jpg" alt="SIT" width={30} height={30} className="object-contain" />
                  </a>
                  <a
                    href="https://www.instagram.com/sitech.developersclub"
                    target="_blank"
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <Image src="/logos/dev_club.jpg" alt="SIT Dev Club" width={30} height={30} className="object-contain" />
                  </a>
                  </div>
                </div>

                <div className="w-px h-8 bg-zinc-800 hidden sm:block"></div>

                {/* Sponsors */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                    Sponsored By
                  </span>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://www.ncs.co"
                      target="_blank"
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <Image src="/logos/ncs.png" alt="NCS" width={60} height={30} className="object-contain" />
                    </a>
                    <a
                      href="https://www.workato.com"
                      target="_blank"
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <Image src="/logos/workato.png" alt="Workato" width={60} height={30} className="object-contain" />
                    </a>
                  </div>
                </div>

                <div className="w-px h-8 bg-zinc-800 hidden sm:block"></div>

                {/* Supported By */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                    Supported By
                  </span>
                  <a
                    href="https://lovable.dev/"
                    target="_blank"
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <Image src="/logos/lovable.png" alt="Lovable" width={60} height={30} className="object-contain" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ----------------------------------- */}

        {!selectedPatient && <PersonaGrid onSelect={handlePatientSelect} />}

        {selectedPatient && isLoaderVisible && (
          <HealthHubLoader onComplete={handleLoaderComplete} />
        )}

        {selectedPatient && !isLoaderVisible && <LiveTriage />}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <TriageProvider>
      <TriageApp />
    </TriageProvider>
  );
}
