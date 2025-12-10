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

export interface ModelOpinion {
  model: string;
  acuity: string;
  reasoning: string;
}

export interface TriageTicket {
  acuity_score: 'P1' | 'P2' | 'P3' | 'P4';
  specialty: string;
  reasoning: string; // The consolidated reasoning
  suggestedActions: string[]; // Restored suggested actions
  clinical_handoff_notes: string[];
  model_consensus: ModelOpinion[]; // To show individual model votes
  calculation_log?: {
    method: string;
    votes: { model: string; weight: number; acuity: string }[];
    final_score: number;
  };
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