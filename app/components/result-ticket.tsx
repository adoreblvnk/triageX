'use client';

import { useTriage } from "@/app/providers/triage-provider";
import { Printer, CheckCircle2, Info, ScanLine, ArrowRight } from "lucide-react";
import { AcuityVisualizer } from "./acuity-visualizer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ResultTicket() {
    const { triageTicket, selectedPatient } = useTriage();
    const [keywords, setKeywords] = useState<string[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    
    useEffect(() => {
        if (triageTicket?.reasoning) {
            setIsScanning(true);
            fetch('/api/highlight', {
                method: 'POST',
                body: JSON.stringify({ text: triageTicket.reasoning })
            })
            .then(res => res.json())
            .then(data => {
                setKeywords(data.keywords || []);
                setIsScanning(false);
            })
            .catch(() => setIsScanning(false));
        }
    }, [triageTicket]);

    if (!triageTicket || !selectedPatient) return null;

    const handlePrint = () => {
        window.print();
    };

    const timestamp = new Date().toLocaleString('en-SG', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
    }).replace(',', '');

    const renderReasoning = () => {
        const fullText = triageTicket.reasoning;
        const paragraphs = fullText.split('\n\n');

        return paragraphs.map((paragraph, pIdx) => {
            if (keywords.length === 0) {
                return <p key={pIdx} className="mb-2 last:mb-0">{paragraph}</p>;
            }
            
            const escapedKeywords = keywords.map(k => k.replace(/[.*+?^${}()|[\\]/g, '\\{new_string}'));
            escapedKeywords.sort((a, b) => b.length - a.length);
            
            const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');
            const parts = paragraph.split(regex);
            
            const highlightedParagraph = parts.map((part, i) => {
                const isMatch = keywords.some(k => k.toLowerCase() === part.toLowerCase());
                return isMatch 
                    ? <mark key={i} className="bg-yellow-200/50 font-bold px-0.5 rounded-sm">{part}</mark>
                    : part;
            });

            return <p key={pIdx} className="mb-2 last:mb-0">{highlightedParagraph}</p>;
        });
    };

    return (
        <div className="w-full max-w-md mx-auto animate-fade-in pb-12">
            
            {/* Ticket Container */}
            <div className="bg-white text-black font-mono p-6 relative shadow-xl filter drop-shadow-lg transform transition-all hover:scale-[1.01]">
                
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
                <div className="text-center border-2 border-black p-4 mb-6 relative overflow-hidden">
                    <p className="text-sm font-bold uppercase mb-1">Final Acuity Score</p>
                    <div className={`text-6xl font-black tracking-tighter ${ triageTicket.acuity_score === 'P1' ? 'text-red-600' :
                        triageTicket.acuity_score === 'P2' ? 'text-orange-600' :
                        triageTicket.acuity_score === 'P3' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                        {triageTicket.acuity_score}
                    </div>
                    <p className="text-xs mt-1 uppercase font-bold">
                        {triageTicket.acuity_score === 'P1' && "IMMEDIATE ATTENTION"}
                        {triageTicket.acuity_score === 'P2' && "MAJOR EMERGENCY"}
                        {triageTicket.acuity_score === 'P3' && "MINOR EMERGENCY"}
                        {triageTicket.acuity_score === 'P4' && "NON-EMERGENCY"}
                    </p>
                </div>

                {/* Clinical Reasoning (Progressive Highlight) */}
                <div className="mb-6 relative">
                     <p className="text-xs font-bold uppercase border-b border-black mb-2">Clinical Assessment</p>
                     <div className="text-sm leading-relaxed relative">
                        {renderReasoning()}
                        
                        {/* Scanning Effect */}
                        {isScanning && (
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/20 to-transparent pointer-events-none"
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                            />
                        )}
                     </div>
                     {isScanning && (
                         <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                             <ScanLine className="w-3 h-3 animate-spin" />
                             Scanning medical entities...
                         </div>
                     )}
                </div>

                {/* Suggested Actions */}
                {triageTicket.suggestedActions.length > 0 && (
                     <div className="mb-4">
                        <p className="text-xs font-bold uppercase border-b border-black mb-2">Immediate Actions</p>
                        <ul className="text-sm space-y-1 font-bold">
                            {triageTicket.suggestedActions.map((action, i) => (
                                <li key={i} className="leading-tight flex items-start gap-2">
                                    <ArrowRight className="w-3 h-3 mt-0.5 shrink-0" />
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
                className="mt-8 w-full bg-zinc-100 hover:bg-white text-black border border-black font-bold py-3 px-6 flex items-center justify-center gap-2 transition-colors print:hidden shadow-sm"
            >
                <Printer className="w-5 h-5" />
                PRINT TICKET
            </button>

             {/* Algorithm Visualizer (New) */}
            <AcuityVisualizer log={triageTicket.calculation_log} finalAcuity={triageTicket.acuity_score} />

             {/* Acuity Legend */}
             <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 p-4 rounded-lg mt-6 shadow-lg">
                <h3 className="text-xs font-bold mb-3 uppercase text-zinc-500">Legend</h3>
                <ul className="text-xs space-y-2 font-mono">
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="text-zinc-300">P1: Critical/Life Threatening</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        <span className="text-zinc-300">P2: Major Emergency</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        <span className="text-zinc-300">P3: Minor Emergency</span>
                    </li>
                     <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-zinc-300">P4: Non-Emergency</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}