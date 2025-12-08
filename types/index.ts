export interface Persona {
  id: string;
  name: string;
  title: string;
  specialty: string;
  avatar: string; // URL or path to image
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
  selectedPersona: Persona | null;
  triageTicket: TriageTicket | null;
}

export interface TriageContextType extends TriageState {
  setConversation: (conversation: Message[]) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setStatus: (status: TriageState['status']) => void;
  setSelectedPersona: (persona: Persona | null) => void;
  playAudio: (audioBase64: string) => void;
  resetTriage: () => void;
  setTriageTicket: (ticket: TriageTicket | null) => void;
}
