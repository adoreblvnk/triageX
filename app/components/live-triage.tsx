'use client';
import { Bot, Mic, Square } from 'lucide-react';
import { useTriage } from '../providers/triage-provider';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// a mock hook for voice transcription - in a real app this would be a websocket connection
const useMockTranscription = () => {
    // a simple mock of a user talking for 10 seconds
    const mockTranscript = [
        "Okay, I don't feel so good.",
        "My chest feels... tight.",
        "It's been like this for maybe 20 minutes?",
        "I'm also a bit dizzy.",
        "And my left arm feels numb.",
        "I have a history of high blood pressure.",
        "Should I be worried?",
    ];

    const start = (dispatch: any) => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < mockTranscript.length) {
                dispatch({ type: 'ADD_TRANSCRIPT_CHUNK', payload: mockTranscript[i] });
                i++;
            } else {
                clearInterval(interval);
            }
        }, 1000);
    };

    return { start };
};


export function LiveTriage() {
  const { state, dispatch } = useTriage();
  const { start } = useMockTranscription();
  const { transcript, analysisStatus } = state;
  const isRecording = false; // This would be state from a voice service
  const isLoading = analysisStatus === 'loading';

  const handleStartTriage = async () => {
      dispatch({ type: 'START_ANALYSIS' });
      try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                transcript: state.transcript,
                persona: state.currentPersona
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Analysis failed');
        }
        const result = await response.json();
        dispatch({ type: 'SET_ANALYSIS_SUCCESS', payload: result });
      } catch (error: any) {
        dispatch({ type: 'SET_ANALYSIS_ERROR', payload: error.message });
      }
  }

  return (
    <div className="w-full border border-zinc-800 bg-black p-4 mt-px">
        <h2 className="font-sans text-2xl mb-4 border-b border-zinc-800 pb-2 flex items-center justify-between">
            LIVE TRIAGE
            <div className="flex items-center gap-2">
                <button
                    onClick={() => start(dispatch)}
                    className="p-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-colors"
                    title="Start Recording"
                >
                    <Mic size={18} />
                </button>
                 <button className="p-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-colors" title="Stop Recording">
                    <Square size={18} />
                </button>
            </div>
        </h2>

        <div className="font-mono text-base min-h-[160px] p-4 bg-zinc-950 border border-zinc-800">
            <AnimatePresence>
            {transcript.map((line, i) => (
                <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <span className="text-zinc-500 mr-2">{`> `}</span>{line}
                </motion.p>
            ))}
            </AnimatePresence>
            {isLoading && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-accent mt-4">
                     <Bot size={16} className="animate-pulse" />
                     <span>Analyzing patient data...</span>
                 </motion.div>
            )}
        </div>

         <button
            onClick={handleStartTriage}
            disabled={isLoading || transcript.length === 0}
            className={cn(
                "w-full mt-4 p-4 font-sans text-lg bg-accent text-accent-foreground transition-colors",
                "disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed",
                "hover:bg-red-700"
            )}
        >
            {isLoading ? 'ANALYZING...' : 'INITIATE TRIAGE ANALYSIS'}
        </button>
    </div>
  );
}
