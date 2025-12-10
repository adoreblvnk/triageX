import { 
  Activity, 
  Cpu, 
  Database, 
  Network, 
  ShieldAlert, 
  Mic, 
  FileText, 
  ArrowRight, 
  Clock,
  UserX,
  CheckCircle2,
  Code,
  Server,
  Users
} from "lucide-react";

export default function AboutPage() {
  return (
    // UPDATED: Removed min-h-screen, added flex-1
    <main className="flex-1 bg-black pt-24 pb-12 px-6 md:px-12 lg:px-24 text-zinc-100 font-sans w-full">
      <div className="max-w-5xl mx-auto space-y-24">
        
        {/* 1. Hero: Hackathon Context */}
        <div className="border-b border-zinc-800 pb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-blue-900/30 border border-blue-800 text-blue-400 text-xs font-mono rounded-full uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3 h-3" />
              Participation Mark
            </span>
            <span className="px-3 py-1 bg-red-900/30 border border-red-800 text-red-400 text-xs font-mono rounded-full uppercase tracking-wider">
              HackRift 2025
            </span>
            <span className="px-3 py-1 bg-zinc-800/50 border border-zinc-700 text-zinc-400 text-xs font-mono rounded-full uppercase tracking-wider">
              Track: Smart Nation
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8">
            The Future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              Autonomous Triage
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl leading-relaxed">
            Addressing the challenge: <i className="text-zinc-200">"How might we design user-centric solutions that improve the quality of life in Singapore?"</i>
          </p>
        </div>

        {/* 2. The Problem: Deep Dive */}
        <section className="grid md:grid-cols-2 gap-12 items-start">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-6 h-6 text-red-500" />
                    <h2 className="text-2xl font-bold uppercase tracking-wider">The Problem</h2>
                </div>
                <h3 className="text-3xl font-bold mb-4">The "3-Hour" Bottleneck</h3>
                <p className="text-zinc-400 leading-relaxed mb-6">
                    As Singapore ages, our polyclinics are overwhelmed. The average wait time for a consultation often exceeds 3 hours. 
                    <br/><br/>
                    Currently, highly trained nurses spend thousands of hours manually asking: 
                    <span className="italic text-white">"What are your symptoms?"</span> and <span className="italic text-white">"Do you have any drug allergies?"</span>.
                </p>
                <div className="space-y-4">
                    <div className="p-4 bg-zinc-900/50 border-l-4 border-red-900 rounded-r-lg">
                        <div className="flex items-center gap-2 font-bold text-red-400 mb-1">
                            <UserX className="w-4 h-4" />
                            Data Fragmentation
                        </div>
                        <p className="text-sm text-zinc-500">
                            Doctors often lack immediate context on a patient's history, relying on verbal confirmation which is slow, unreliable, and prone to memory error.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative">
                 <h3 className="text-lg font-bold text-zinc-200 mb-6 text-center">Why TriageX is Better</h3>
                 
                 <div className="space-y-4">
                    {/* Comparison Row 1 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-lg opacity-60">
                            <div className="text-xs uppercase text-red-500 font-bold mb-1">Traditional Triage</div>
                            <div className="text-sm text-zinc-300">Sequential, Manual, Slow (5-10 mins/pax)</div>
                        </div>
                        <div className="p-4 bg-green-950/20 border border-green-900/30 rounded-lg">
                            <div className="text-xs uppercase text-green-500 font-bold mb-1">TriageX Kiosk</div>
                            <div className="text-sm text-zinc-100 font-bold">Parallel, Instant, Scalable (Avg 45s)</div>
                        </div>
                    </div>

                    {/* Comparison Row 2 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-lg opacity-60">
                            <div className="text-xs uppercase text-red-500 font-bold mb-1">Human Judgment</div>
                            <div className="text-sm text-zinc-300">Prone to fatigue & cognitive bias after long shifts.</div>
                        </div>
                        <div className="p-4 bg-green-950/20 border border-green-900/30 rounded-lg">
                            <div className="text-xs uppercase text-green-500 font-bold mb-1">Ensemble AI</div>
                            <div className="text-sm text-zinc-100 font-bold">3 Models (Gemini + GPT + Llama) cross-validating every decision.</div>
                        </div>
                    </div>
                 </div>
            </div>
        </section>

        {/* 3. Technical Architecture (Visual Flow) */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Cpu className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold uppercase tracking-wider">Technical Execution</h2>
          </div>
          
          {/* Visual Diagram */}
          <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-xl relative overflow-hidden mb-8">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

             <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="bg-black border border-zinc-700 p-4 rounded-lg flex flex-col items-center hover:border-zinc-500 transition-colors">
                    <Mic className="w-8 h-8 text-white mb-3" />
                    <h3 className="font-bold text-sm uppercase mb-1">Voice Input</h3>
                    <p className="text-xs text-zinc-400">ElevenLabs Scribe v1</p>
                </div>
                <div className="hidden md:flex items-center justify-center text-zinc-600"><ArrowRight /></div>
                <div className="bg-black border border-blue-900/50 p-4 rounded-lg flex flex-col items-center shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:scale-105 transition-transform">
                    <Network className="w-8 h-8 text-blue-400 mb-3" />
                    <h3 className="font-bold text-sm uppercase mb-1">Consensus Engine</h3>
                    <p className="text-xs text-zinc-400">Gemini 2.5 + GPT-OSS + Llama 4</p>
                </div>
                <div className="hidden md:flex items-center justify-center text-zinc-600"><ArrowRight /></div>
                <div className="bg-black border border-green-900/50 p-4 rounded-lg flex flex-col items-center shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:border-green-500 transition-colors">
                    <FileText className="w-8 h-8 text-green-400 mb-3" />
                    <h3 className="font-bold text-sm uppercase mb-1">Triage Ticket</h3>
                    <p className="text-xs text-zinc-400">P-Score & Notes</p>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-zinc-800">
                <h4 className="text-sm font-bold text-zinc-300 mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    Safety-First Consensus Algorithm
                </h4>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
                    Instead of relying on a single AI, we poll three state-of-the-art models via <strong>Vercel AI SDK</strong>. 
                    <span className="block mt-2 font-mono text-xs bg-black/50 p-3 rounded border border-zinc-800 text-green-400">
                        IF any_model_vote == "P1_CRITICAL" THEN final_score = "P1" (Safety Override)<br/>
                        ELSE final_score = CEIL(AVG(weighted_votes))
                    </span>
                </p>
             </div>
          </div>

          {/* Concise Tech Stack Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold text-sm">
                    <Code className="w-4 h-4" /> Frontend
                </div>
                <ul className="text-xs text-zinc-400 space-y-1 font-mono">
                    <li><a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 hover:underline transition-colors">Next.js 14</a> & TypeScript</li>
                    <li><a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 hover:underline transition-colors">Tailwind CSS</a></li>
                    <li><a href="https://motion.dev" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 hover:underline transition-colors">Framer Motion</a></li>
                </ul>
             </div>
             
             <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-sm">
                    <Network className="w-4 h-4" /> AI Ensemble
                </div>
                <ul className="text-xs text-zinc-400 space-y-1 font-mono">
                    <li><a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 hover:underline transition-colors">Google Gemini 2.5</a></li>
                    <li><a href="https://groq.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 hover:underline transition-colors">GPT-OSS (Groq)</a></li>
                    <li><a href="https://www.llama.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 hover:underline transition-colors">Llama 4 (Groq)</a></li>
                </ul>
             </div>

             <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-green-400 font-bold text-sm">
                    <Mic className="w-4 h-4" /> Voice Logic
                </div>
                <ul className="text-xs text-zinc-400 space-y-1 font-mono">
                    <li><a href="https://elevenlabs.io/speech-to-text" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 hover:underline transition-colors">ElevenLabs Scribe v1</a></li>
                    <li><a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 hover:underline transition-colors">Eleven Multilingual v2</a></li>
                    <li>Audio Isolation Engine</li>
                </ul>
             </div>

             <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-orange-400 font-bold text-sm">
                    <Database className="w-4 h-4" /> Smart Nation
                </div>
                <ul className="text-xs text-zinc-400 space-y-1 font-mono">
                    <li><a href="https://hapifhir.io" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 hover:underline transition-colors">HAPI FHIR Server</a></li>
                    <li><a href="https://hl7.org/fhir" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 hover:underline transition-colors">HL7 Interoperability</a></li>
                    <li>Docker Container</li>
                </ul>
             </div>
          </div>
        </section>

        {/* 4. User Guide */}
        <section className="grid md:grid-cols-2 gap-12">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-green-500" />
                    <h2 className="text-2xl font-bold uppercase tracking-wider">Kiosk User Guide</h2>
                </div>
                <div className="space-y-6 border-l-2 border-zinc-800 pl-6">
                    <div className="relative">
                        <span className="absolute -left-[33px] bg-zinc-900 border border-zinc-700 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white">1</span>
                        <h3 className="text-lg font-bold text-white">Select Profile</h3>
                        <p className="text-zinc-400 text-sm mt-1">Simulate scanning an NRIC. The system pulls relevant history (e.g., Diabetes) from the local FHIR database.</p>
                    </div>
                    <div className="relative">
                        <span className="absolute -left-[33px] bg-zinc-900 border border-zinc-700 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white">2</span>
                        <h3 className="text-lg font-bold text-white">Click-to-Speak</h3>
                        <p className="text-zinc-400 text-sm mt-1">Tap the microphone once to start describing symptoms. Tap again to stop. No need to hold the button.</p>
                    </div>
                    <div className="relative">
                        <span className="absolute -left-[33px] bg-zinc-900 border border-zinc-700 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white">3</span>
                        <h3 className="text-lg font-bold text-white">Receive Ticket</h3>
                        <p className="text-zinc-400 text-sm mt-1">Review the AI's consensus log and "Print" your Triage Slip for the doctor.</p>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900/20 border border-zinc-800 p-6 rounded-xl flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Server className="w-5 h-5 text-purple-500" />
                        FHIR Simulation
                    </h3>
                    <p className="text-sm text-zinc-400 mb-4">
                        We run a local Docker instance of <code>hapiproject/hapi</code> to simulate the National Electronic Health Record (NEHR).
                    </p>
                    <div className="bg-black p-4 rounded border border-zinc-800 text-xs font-mono text-zinc-500 mb-2">
                        <span className="text-blue-400">GET</span> /Patient/P001 <br/>
                        <span className="text-green-400">&gt; 200 OK</span> <br/>
                        &gt; Conditions: [Hypertension, Asthma]
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        <span>Real-time Context Injection</span>
                    </div>
                </div>
            </div>
        </section>

      </div>
    </main>
  );
}
