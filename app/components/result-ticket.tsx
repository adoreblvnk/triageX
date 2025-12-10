'use client';

import { useTriage } from "@/app/providers/triage-provider";
import { Printer, CheckCircle2, Info } from "lucide-react";

export function ResultTicket() {
    const { triageTicket, selectedPatient } = useTriage();
    
    if (!triageTicket || !selectedPatient) return null;

    const handlePrint = () => {
        window.print();
    };

    const timestamp = new Date().toLocaleString('en-SG', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
    }).replace(',', '');

    return (
        <div className="w-full max-w-md mx-auto animate-fade-in pb-12">
            {/* Acuity Explanation Section */}
            <div className="bg-zinc-800 text-zinc-200 p-4 rounded-t-lg mb-4 shadow-lg">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    Understanding Your Acuity Score
                </h3>
                <p className="text-sm mb-3">Your TriageX Acuity Score helps polyclinic staff prioritize care. Here's what it means:</p>
                <ul className="text-sm space-y-2">
                    <li>
                        <span className="font-bold text-red-400">P1 (Critical):</span> Immediate, life-threatening condition. You need to be seen by staff now.
                    </li>
                    <li>
                        <span className="font-bold text-orange-400">P2 (Major Emergency):</span> Severe symptoms, but stable. A short wait is anticipated.
                    </li>
                    <li>
                        <span className="font-bold text-yellow-400">P3 (Minor Emergency):</span> Acute but stable condition. Standard wait times apply.
                    </li>
                    <li>
                        <span className="font-bold text-green-400">P4 (Non-Emergency):</span> Suitable for general practitioner or pharmacy. Longest wait times expected.
                    </li>
                </ul>
                <p className="text-xs text-zinc-400 mt-3">Please show this slip to the triage nurse.</p>
            </div>

            {/* Ticket Container - ROTATION REMOVED */}
            <div className="bg-white text-black font-mono p-6 relative shadow-xl filter drop-shadow-lg">
                
                {/* Jagged Top (Hidden as per previous code, but keeping for consistency) */}
                <div 
                    className="absolute -top-2 left-0 right-0 h-4 bg-white"
                    style={{ 
                        clipPath: 'polygon(0% 100%, 2% 0%, 4% 100%, 6% 0%, 8% 100%, 10% 0%, 12% 100%, 14% 0%, 16% 100%, 18% 0%, 20% 100%, 22% 0%, 24% 100%, 26% 0%, 28% 100%, 30% 0%, 32% 100%, 34% 0%, 36% 100%, 38% 0%, 40% 100%, 42% 0%, 44% 100%, 46% 0%, 48% 100%, 50% 0%, 52% 100%, 54% 0%, 56% 100%, 58% 0%, 60% 100%, 62% 0%, 64% 100%, 66% 0%, 68% 100%, 70% 0%, 72% 100%, 74% 0%, 76% 100%, 78% 0%, 80% 100%, 82% 100%, 84% 0%, 86% 100%, 88% 0%, 90% 100%, 92% 0%, 94% 100%, 96% 0%, 98% 100%, 100% 100%)',
                        display: 'none'
                    }} 
                />

                {/* Header */}
                <div className="text-center border-b-2 border-dashed border-black pb-4 mb-4">
                    <h2 className="font-bold text-lg leading-tight">SINGAPORE HEALTH SERVICES</h2>
                    <h3 className="font-bold text-md">TRIAGE SLIP</h3>
                    <p className="text-xs mt-2">POLYCLINIC KIOSK #042</p>
                    <p className="text-xs">{timestamp}</p>
                </div>

                {/* Patient Info */}
                <div className="text-sm mb-6 font-bold">
                    <div className="flex justify-between">
                        <span>NRIC:</span>
                        <span>{selectedPatient.nric}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>NAME:</span>
                        <span className="uppercase">{selectedPatient.name}</span>
                    </div>
                </div>

                {/* Acuity Score */}
                <div className="text-center border-2 border-black p-4 mb-6">
                    <p className="text-sm font-bold uppercase mb-1">Final Acuity Score</p>
                    <div className="text-6xl font-black tracking-tighter">
                        {triageTicket.acuity_score}
                    </div>
                    <p className="text-xs mt-1 uppercase font-bold">
                        {triageTicket.acuity_score === 'P1' && "IMMEDIATE ATTENTION"}
                        {triageTicket.acuity_score === 'P2' && "MAJOR EMERGENCY"}
                        {triageTicket.acuity_score === 'P3' && "MINOR EMERGENCY"}
                        {triageTicket.acuity_score === 'P4' && "NON-EMERGENCY"}
                    </p>
                </div>

                {/* AI Verification Log */}
                <div className="mb-6 bg-zinc-100 p-3 border border-zinc-300">
                    <p className="text-xs font-bold uppercase border-b border-zinc-400 mb-2 pb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        AI Consensus Log
                    </p>
                    <div className="space-y-2 text-xs">
                        {triageTicket.model_consensus.map((opinion, idx) => (
                            <div key={idx} className="flex justify-between items-start gap-2">
                                <span className="font-bold min-w-[80px]">{opinion.model}:</span>
                                <div className="text-right">
                                    <span className="font-bold bg-black text-white px-1 mr-1">{opinion.acuity}</span>
                                    <span className="text-zinc-600 italic block mt-0.5 leading-tight text-[10px]">
                                        "{opinion.reasoning}"
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Suggested Actions */}
                {triageTicket.suggestedActions.length > 0 && (
                     <div className="mb-4">
                        <p className="text-xs font-bold uppercase border-b border-black mb-2">Immediate Actions</p>
                        <ul className="text-sm space-y-1 font-bold">
                            {triageTicket.suggestedActions.map((action, i) => (
                                <li key={i} className="leading-tight flex items-start gap-2">
                                    <span>•</span>
                                    <span>{action}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Doctor's Notes */}
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase border-b border-black mb-2">Doctor's Handoff Notes</p>
                    <ul className="text-xs space-y-1 font-medium text-zinc-800">
                        {triageTicket.clinical_handoff_notes.map((note, i) => (
                            <li key={i} className="leading-tight flex items-start gap-2">
                                <span>-</span>
                                <span>{note}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Barcode */}
                <div className="mt-8 pt-4 border-t-2 border-dashed border-black text-center">
                    <div className="h-12 w-3/4 mx-auto bg-[repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_4px)]" />
                    <p className="text-xs mt-1 tracking-[0.2em]">{selectedPatient.id.toUpperCase()}-TX</p>
                </div>

                {/* Jagged Bottom */}
                <div 
                    className="absolute -bottom-2 left-0 right-0 h-4 bg-white"
                    style={{ 
                        clipPath: 'polygon(0% 0%, 2% 100%, 4% 0%, 6% 100%, 8% 0%, 10% 100%, 12% 0%, 14% 100%, 16% 0%, 18% 100%, 20% 0%, 22% 100%, 24% 0%, 26% 100%, 28% 0%, 30% 100%, 32% 0%, 34% 100%, 36% 0%, 38% 100%, 40% 0%, 42% 100%, 44% 0%, 46% 100%, 48% 0%, 50% 100%, 52% 0%, 54% 100%, 56% 0%, 58% 100%, 60% 0%, 62% 100%, 64% 0%, 66% 100%, 68% 0%, 70% 100%, 72% 0%, 74% 100%, 76% 0%, 78% 100%, 80% 0%, 82% 100%, 84% 0%, 86% 100%, 88% 0%, 90% 100%, 92% 0%, 94% 100%, 96% 0%, 98% 100%, 100% 0%)'
                    }} 
                />
            </div>

            {/* Print Button */}
            <button 
                onClick={handlePrint}
                className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-colors print:hidden shadow-lg"
            >
                <Printer className="w-5 h-5" />
                PRINT TICKET
            </button>
        </div>
    );
}
