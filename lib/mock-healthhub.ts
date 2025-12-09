import { PatientProfile } from '@/types';

export const mockPatients: PatientProfile[] = [
  {
    id: 'patient-001',
    name: 'Uncle Tan',
    age: 68,
    nric: 'S****123A',
    chronicConditions: ['Hypertension', 'Hyperlipidemia'],
    avatar: '/avatars/uncle-tan.jpg', // Placeholder
  },
  {
    id: 'patient-002',
    name: 'John Leow',
    age: 45,
    nric: 'S****567B',
    chronicConditions: ['Type 2 Diabetes'],
    avatar: '/avatars/john-leow.jpg', // Placeholder
  },
  {
    id: 'patient-003',
    name: 'Sarah Lim',
    age: 29,
    nric: 'S****890C',
    chronicConditions: ['Asthma'],
    avatar: '/avatars/sarah-lim.jpg', // Placeholder
  },
];
