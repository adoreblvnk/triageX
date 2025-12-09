export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  nric: string; // Masked NRIC
  avatar?: string;
  chronicConditions: string[]; // e.g., ["Hypertension", "Type 2 Diabetes"]
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export interface TriageTicket {
  urgency: 'critical' | 'high' | 'medium' | 'low';
  specialty: string;
  reasoning: string;
  suggestedActions: string[];
}

export interface TriageState {
  status: 'idle' | 'recording' | 'processing' | 'speaking' | 'analyzing' | 'complete';
  conversation: Message[];
  selectedPatient: PatientProfile | null;
  medicalHistory: string; // Context string fetched from FHIR
  triageTicket: TriageTicket | null;
}

export interface TriageContextType extends TriageState {
  setConversation: (conversation: Message[]) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setStatus: (status: TriageState['status']) => void;
  setSelectedPatient: (patient: PatientProfile | null) => void;
  setMedicalHistory: (history: string) => void;
  playAudio: (audioBase64: string) => void;
  resetTriage: () => void;
  setTriageTicket: (ticket: TriageTicket | null) => void;
}