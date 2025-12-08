'use client';

import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';
import type { Persona } from '@/lib/mock-healthhub';

// -- STATE & SHAPE --
interface TriageState {
  currentPersona: Persona | null;
  transcript: string[];
  analysisStatus: 'idle' | 'loading' | 'complete';
  triageResult: TriageResult | null;
  error: string | null;
}

export interface TriageResult {
  gemini: { score: number; reasoning: string };
  gpt_oss: { score: number; reasoning: string };
  llama_maverick: { score: number; reasoning: string };
  finalScore: number;
  finalReasoning: string;
  variance: number;
}

const initialState: TriageState = {
  currentPersona: null,
  transcript: [],
  analysisStatus: 'idle',
  triageResult: null,
  error: null,
};

// -- REDUCER --
type TriageAction =
  | { type: 'SELECT_PERSONA'; payload: Persona }
  | { type: 'ADD_TRANSCRIPT_CHUNK'; payload: string }
  | { type: 'START_ANALYSIS' }
  | { type: 'SET_ANALYSIS_SUCCESS'; payload: TriageResult }
  | { type: 'SET_ANALYSIS_ERROR'; payload: string }
  | { type: 'RESET_SESSION' };

// use reducer for complex state transitions
const triageReducer = (state: TriageState, action: TriageAction): TriageState => {
  switch (action.type) {
    case 'SELECT_PERSONA':
      return { ...initialState, currentPersona: action.payload };
    case 'ADD_TRANSCRIPT_CHUNK':
      return { ...state, transcript: [...state.transcript, action.payload] };
    case 'START_ANALYSIS':
      return { ...state, analysisStatus: 'loading', error: null };
    case 'SET_ANALYSIS_SUCCESS':
      return { ...state, analysisStatus: 'complete', triageResult: action.payload };
    case 'SET_ANALYSIS_ERROR':
        return { ...state, analysisStatus: 'idle', error: action.payload };
    case 'RESET_SESSION':
      return { ...initialState };
    default:
      return state;
  }
};

// -- CONTEXT --
const TriageContext = createContext<{
  state: TriageState;
  dispatch: Dispatch<TriageAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// -- PROVIDER --
export const TriageProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(triageReducer, initialState);
  return (
    <TriageContext.Provider value={{ state, dispatch }}>
      {children}
    </TriageContext.Provider>
  );
};

// -- HOOK --
export const useTriage = () => {
  const context = useContext(TriageContext);
  if (context === undefined) {
    throw new Error('useTriage must be used within a TriageProvider');
  }
  return context;
};