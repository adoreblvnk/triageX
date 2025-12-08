'use client';

import { useTriage } from "@/providers/triage-provider";
import { TriageTicket } from "@/types";

// NOTE: This is a placeholder. In a real app, you'd fetch this from the TriageContext.
const mockTicket: TriageTicket = {
    urgency: 'high',
    specialty: 'Cardiology',
    reasoning: `
        Gemini-2.5-Pro: The patient's description of chest pain radiating to the left arm, combined with shortness of breath, is highly indicative of a potential cardiac event, such as angina or myocardial infarction. Immediate evaluation is critical.
        GPT-OSS-120b: [GPT-OSS-120b MOCK] Patient is exhibiting classic signs of acute coronary syndrome. The chest pain description is a major indicator.
        Llama-4-Maverick: [LLAMA-4-MAVERICK MOCK] The radiating pain and shortness of breath strongly suggest a cardiac event. Immediate workup is necessary.
    `.trim(),
    suggestedActions: [
        'Administer aspirin',
        'Perform ECG immediately',
        'Prepare for cardiac catheterization',
        'Check vital signs continuously',
        'Administer oxygen',
        'Draw blood for cardiac enzyme tests'
    ],
};


const UrgencyPill = ({ urgency }: { urgency: TriageTicket['urgency'] }) => {
    const urgencyMap = {
        critical: 'bg-red-900 border-red-600 text-red-300',
        high: 'bg-red-800 border-red-500 text-red-200',
        medium: 'bg-yellow-800 border-yellow-500 text-yellow-200',
        low: 'bg-green-800 border-green-500 text-green-200',
    };

    return (
        <span className={`px-3 py-1 text-sm font-bold uppercase border rounded-full ${urgencyMap[urgency]}`}>
            {urgency}
        </span>
    )
}

export function ResultTicket() {
    // const { triageTicket } = useTriage();
    // if (!triageTicket) return null;
    const triageTicket = mockTicket; // Replace with context

    return (
        <div className="w-full border border-zinc-700 bg-zinc-950 p-6 text-left animate-fade-in">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-3xl font-bold">Triage Result</h2>
                    <p className="text-zinc-400">Ensemble analysis complete.</p>
                </div>
                <UrgencyPill urgency={triageTicket.urgency} />
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="font-bold text-red-500 mb-2">Suggested Specialty</h3>
                    <p className="text-xl text-zinc-200">{triageTicket.specialty}</p>
                </div>
                <div>
                    <h3 className="font-bold text-zinc-400 mb-2">Reasoning</h3>
                    <div className="text-zinc-300 text-sm space-y-2 whitespace-pre-wrap bg-black p-4 border border-zinc-800">
                        {triageTicket.reasoning}
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-zinc-400 mb-2">Suggested Actions</h3>
                    <ul className="grid grid-cols-2 gap-2">
                       {triageTicket.suggestedActions.map((action, i) => (
                           <li key={i} className="bg-zinc-900 border border-zinc-800 p-3 text-sm text-zinc-300">
                               - {action}
                           </li>
                       ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

// Add this to your globals.css for the animation
/*
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
*/