'use client';

import { useState, useRef, useEffect } from 'react';
import { useTriage } from '@/app/providers/triage-provider';
import { Mic, Square, LoaderCircle } from 'lucide-react';
import { ResultTicket } from './result-ticket';
import { AnimatedTranscript } from './animated-transcript';

const AudioWaveform = () => {
  // A simple placeholder for a waveform visualization
  return (
    <div className="flex items-center justify-center space-x-1 h-12">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-red-600 animate-pulse"
          style={{
            height: `${Math.random() * 40 + 10}px`,
            animationDelay: `${i * 100}ms`,
            animationDuration: '1.5s',
          }}
        />
      ))}
    </div>
  );
};

export function LiveTriage() {
  const {
    status,
    setStatus,
    addMessage,
    playAudio,
    conversation,
    selectedPersona,
    resetTriage,
    setTriageTicket, // This is imported here
  } = useTriage();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [aiSpeakingText, setAiSpeakingText] = useState('');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = handleStopRecording;
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setStatus('recording');
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleStopRecording = async () => {
    setStatus('processing');
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('conversationHistory', JSON.stringify(conversation));
    formData.append('personaContext', JSON.stringify(selectedPersona));

    try {
      const response = await fetch('/api/conversation', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.transcript) {
        addMessage({ role: 'user', text: result.transcript });
      }

      if (result.status === 'continue' && result.aiResponseText) {
        addMessage({ role: 'assistant', text: result.aiResponseText });
        setAiSpeakingText(result.aiResponseText);
        if(result.aiAudioBase64){
            playAudio(result.aiAudioBase64); 
        } else {
            setStatus('idle');
        }
      } else if (result.status === 'complete') {
        setStatus('analyzing');
        // Trigger analysis
        analyzeConversation();
      } else {
        setStatus('idle');
      }
    } catch (error) {
      console.error('Error sending audio:', error);
      setStatus('idle');
    }
  };

    const analyzeConversation = async () => {
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationHistory: conversation, personaContext: selectedPersona }),
            });
            if (!res.ok) throw new Error('Analysis failed');
            
            const ticket = await res.json();
            
            // --- FIX IS HERE ---
            setTriageTicket(ticket); // Actually update state
            setStatus('complete');
            // -------------------

        } catch (error) {
            console.error('Error during analysis:', error);
            setStatus('idle'); 
        }
    };


  const renderContent = () => {
    switch (status) {
      case 'recording':
        return (
          <div className="flex flex-col items-center justify-center h-48">
            <div className="w-24 h-24 bg-red-600 rounded-full animate-pulse" />
            <p className="mt-4 text-zinc-400">Listening...</p>
          </div>
        );
      case 'processing':
      case 'analyzing':
        return (
          <div className="flex flex-col items-center justify-center h-48">
            <LoaderCircle className="w-24 h-24 text-zinc-500 animate-spin" />
            <p className="mt-4 text-zinc-400">{status === 'analyzing' ? 'Analyzing...' : 'Processing...'}</p>
          </div>
        );
      case 'speaking':
        return (
            <div className="flex flex-col items-center justify-center h-48 w-full">
                <AnimatedTranscript text={aiSpeakingText} />
                <AudioWaveform />
            </div>
        );
      case 'complete':
        return <ResultTicket />;
      case 'idle':
      default:
        return (
            <div className="flex flex-col items-center justify-center h-48">
                 <p className="text-zinc-300 mb-4">Press the button and describe your symptoms.</p>
            </div>
        )
    }
  };

  const renderButton = () => {
      if (status === 'complete') {
          return (
            <button
                onClick={resetTriage}
                className="bg-white text-black font-bold py-4 px-8 border border-zinc-800"
            >
                Start New Triage
            </button>
          )
      }

      return (
        <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`w-24 h-24 flex items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                status === 'recording' ? 'bg-red-600 border-red-400' : 'bg-white border-zinc-800'
            }`}
        >
            {status === 'recording' ? (
                <Square className="w-10 h-10 text-white" />
            ) : (
                <Mic className="w-10 h-10 text-black" />
            )}
        </button>
      )
  }

  return (
    <div className="w-full border border-zinc-800 bg-black p-8 flex flex-col items-center">
        <div className="w-full text-left mb-4">
            <p className="text-zinc-400">Consulting with:</p>
            <h2 className="text-2xl font-bold">{selectedPersona?.name}</h2>
            <p className="text-red-600">{selectedPersona?.specialty}</p>
        </div>
      <div className="w-full min-h-[250px] flex items-center justify-center">
        {renderContent()}
      </div>
      <div className="mt-8">
        {renderButton()}
      </div>
    </div>
  );
}
