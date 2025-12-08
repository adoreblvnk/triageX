// lib/mock-healthhub.ts
export interface Persona {
  id: string;
  name: string;
  age: number;
  history: string[];
  avatar: string; // simple emoji for now
}

export const mockPersonas: Persona[] = [
  {
    id: 'uncle-tan',
    name: 'Uncle Tan',
    age: 65,
    history: ['Hypertension', 'Type 2 Diabetes'],
    avatar: '👴',
  },
  {
    id: 'aunty-lim',
    name: 'Aunty Lim',
    age: 72,
    history: ['Osteoarthritis', 'High Cholesterol'],
    avatar: '👵',
  },
  {
    id: 'chen',
    name: 'Ah Beng',
    age: 28,
    history: ['Asthma (childhood)', 'None'],
    avatar: '👨‍💻',
  },
  {
    id: 'siti',
    name: 'Siti',
    age: 45,
    history: ['Migraines'],
    avatar: '👩‍🏫',
  },
  {
    id: 'kumar',
    name: 'Mr. Kumar',
    age: 58,
    history: ['Coronary Artery Disease', 'Gout'],
    avatar: '👨‍💼',
  },
];
