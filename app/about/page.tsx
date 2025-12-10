import { 
  Activity, 
  Clock, 
  Database, 
  Cpu, 
  Network, 
  ShieldCheck 
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black pt-24 pb-12 px-6 md:px-12 lg:px-24 text-zinc-100">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="space-y-4 border-b border-zinc-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Mission & Tech
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl">
            Redefining polyclinic triage with onsite AI kiosks and FHIR integration. 
            Built for <span className="text-red-500 font-bold">HackRift 2025</span>.
          </p>
        </div>

        {/* The Problem */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-red-500">
            <Clock className="w-6 h-6" />
            <h2 className="text-2xl font-bold uppercase tracking-wider">The Problem</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-2">Wait Times &gt; 3 Hours</h3>
              <p className="text-zinc-400 leading-relaxed">
                Polyclinic wait times in Singapore often exceed 3 hours. 
                Critical resources are drained by minor ailments that could be self-managed or routed differently.
                The manual triage process is a significant bottleneck.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-2">Data Fragmentation</h3>
              <p className="text-zinc-400 leading-relaxed">
                Triage nurses often lack immediate context on a patient's history, 
                relying on verbal confirmation which is slow and prone to error.
              </p>
            </div>
          </div>
        </section>

        {/* The Solution */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-green-500">
            <Activity className="w-6 h-6" />
            <h2 className="text-2xl font-bold uppercase tracking-wider">The Solution</h2>
          </div>
          <div className="p-8 rounded-xl bg-zinc-900 border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <h3 className="text-2xl font-bold text-white mb-4">Autonomous Pre-Triage Kiosk</h3>
            <p className="text-zinc-300 text-lg leading-relaxed mb-6">
              An AI-powered kiosk that interviews patients <i>while they wait</i>. 
              By integrating real-time reported symptoms with historical HealthHub (FHIR) data, 
              TriageX generates a clinical acuity score and handoff notes before the patient even sees a nurse.
            </p>
            <ul className="grid md:grid-cols-3 gap-4">
              <li className="bg-black/50 p-4 rounded-lg border border-zinc-800">
                <span className="block text-sm text-zinc-500 uppercase font-bold mb-1">Input</span>
                <span className="text-white">Voice & FHIR History</span>
              </li>
              <li className="bg-black/50 p-4 rounded-lg border border-zinc-800">
                <span className="block text-sm text-zinc-500 uppercase font-bold mb-1">Process</span>
                <span className="text-white">Multi-Model Ensemble</span>
              </li>
              <li className="bg-black/50 p-4 rounded-lg border border-zinc-800">
                <span className="block text-sm text-zinc-500 uppercase font-bold mb-1">Output</span>
                <span className="text-white">PAC Score & Handoff</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Smart Nation Integration */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-blue-500">
            <Database className="w-6 h-6" />
            <h2 className="text-2xl font-bold uppercase tracking-wider">Smart Nation Integration</h2>
          </div>
          <div className="bg-zinc-900/30 border border-blue-900/30 p-6 rounded-lg">
             <p className="text-zinc-300 leading-relaxed">
                Direct simulated integration with <span className="text-blue-400 font-semibold">National Electronic Health Records (NEHR)</span> via <span className="text-blue-400 font-semibold">FHIR</span> standards. 
                TriageX pulls chronic conditions (e.g., Hypertension) to context-weight the AI's analysis, ensuring high-risk patients are flagged even if their current complaint seems minor.
             </p>
          </div>
        </section>

        {/* The Tech Stack */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 text-purple-500">
            <Cpu className="w-6 h-6" />
            <h2 className="text-2xl font-bold uppercase tracking-wider">The Tech Stack</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
               <div className="p-2 bg-zinc-800 rounded-md">
                 <Network className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h4 className="font-bold text-white">Next.js 14</h4>
                 <p className="text-sm text-zinc-400">App Router, Server Actions, React Server Components.</p>
               </div>
            </div>

            <div className="flex items-start gap-4">
               <div className="p-2 bg-zinc-800 rounded-md">
                 <ShieldCheck className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h4 className="font-bold text-white">Multi-LLM Ensemble</h4>
                 <p className="text-sm text-zinc-400">Gemini 2.5 Flash + Llama 3 + GPT-OSS for consensus-based accuracy.</p>
               </div>
            </div>

            <div className="flex items-start gap-4">
               <div className="p-2 bg-zinc-800 rounded-md">
                 <Activity className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h4 className="font-bold text-white">FHIR Integration</h4>
                 <p className="text-sm text-zinc-400">HAPI FHIR standard for interoperable medical data.</p>
               </div>
            </div>

            <div className="flex items-start gap-4">
               <div className="p-2 bg-zinc-800 rounded-md">
                 <Database className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h4 className="font-bold text-white">Dockerized Services</h4>
                 <p className="text-sm text-zinc-400">Containerized deployment for kiosk stability.</p>
               </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
