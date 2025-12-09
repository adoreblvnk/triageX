'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { TriageState, Message, PatientProfile, TriageTicket } from '@/types';

interface TriageContextType extends TriageState {
  setConversation: (conversation: Message[]) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setStatus: (status: TriageState['status']) => void;
  setSelectedPatient: (patient: PatientProfile | null) => void;
  setMedicalHistory: (history: string) => void;
  playAudio: (audioBase64: string) => void;
  resetTriage: () => void;
  setTriageTicket: (ticket: TriageTicket | null) => void;
}

const TriageContext = createContext<TriageContextType | undefined>(undefined);

const initialState: TriageState = {
  status: 'idle',
  conversation: [],
  selectedPatient: null,
  medicalHistory: '',
  triageTicket: null,
};

export const TriageProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TriageState>(initialState);

  const setConversation = (conversation: Message[]) => {
    setState(prevState => ({ ...prevState, conversation }));
  };

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: Date.now(),
    };
    setState(prevState => ({
      ...prevState,
      conversation: [...prevState.conversation, newMessage],
    }));
  }, []);

  const setStatus = (status: TriageState['status']) => {
    setState(prevState => ({ ...prevState, status }));
  };

  const setSelectedPatient = (patient: PatientProfile | null) => {
    setState(prevState => ({ ...prevState, selectedPatient: patient }));
  };

  const setMedicalHistory = (history: string) => {
    setState(prevState => ({ ...prevState, medicalHistory: history }));
  };

  const playAudio = (audioBase64: string) => {
    try {
      setStatus('speaking');
      const audioSrc = `data:audio/mpeg;base64,${audioBase64}`;
      const audio = new Audio(audioSrc);
      audio.play();
      audio.onended = () => {
        setStatus('idle');
      };
    } catch (error) {
      console.error('Error playing audio:', error);
      setStatus('idle');
    }
  };

  const setTriageTicket = (ticket: TriageTicket | null) => {
    setState(prevState => ({ ...prevState, triageTicket: ticket }));
  };

  const resetTriage = () => {
    setState(initialState);
  };

  const value = {
    ...state,
    setConversation,
    addMessage,
    setStatus,
    setSelectedPatient,
    setMedicalHistory,
    playAudio,
    resetTriage,
    setTriageTicket,
  };

  return <TriageContext.Provider value={value}>{children}</TriageContext.Provider>;
};

export const useTriage = () => {
  const context = useContext(TriageContext);
  if (context === undefined) {
    throw new Error('useTriage must be used within a TriageProvider');
  }
  return context;
};
