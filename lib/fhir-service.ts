import { PatientProfile } from '@/types';

const FHIR_BASE_URL = 'http://localhost:8080/fhir';

// Static Fallback Data (used if Docker is down)
const MOCK_RECORDS: Record<string, string> = {
  'patient-001': `
    Patient: Uncle Tan (68M)
    Conditions: Hypertension (diagnosed 2018), Hyperlipidemia (diagnosed 2019)
    Medications: Amlodipine 5mg (Daily), Atorvastatin 20mg (Nightly)
    Allergies: Penicillin (Mild Rash)
    Recent Vitals: BP 135/85, HR 72
  `,
  'patient-002': `
    Patient: John Leow (45M)
    Conditions: Type 2 Diabetes (diagnosed 2020)
    Medications: Metformin 500mg (BD)
    Allergies: None known
    Recent Vitals: HbA1c 7.2%, BP 128/80
  `,
  'patient-003': `
    Patient: Sarah Lim (29F)
    Conditions: Bronchial Asthma (Childhood onset)
    Medications: Ventolin Inhaler (PRN), Becotide 50mcg (Daily)
    Allergies: Dust Mites, Pollen
    Recent Vitals: SpO2 98%, Peak Flow 350
  `,
};

// Seed Data Bundles
const SEED_BUNDLES = [
  // Uncle Tan
  {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: [
      {
        resource: {
          resourceType: 'Patient',
          id: 'patient-001',
          name: [{ family: 'Tan', given: ['Uncle'] }],
          gender: 'male',
          birthDate: '1955-06-15',
        },
        request: { method: 'PUT', url: 'Patient/patient-001' },
      },
      {
        resource: {
          resourceType: 'Condition',
          subject: { reference: 'Patient/patient-001' },
          code: { text: 'Hypertension' },
          onsetDateTime: '2018-01-01',
        },
        request: { method: 'POST', url: 'Condition' },
      },
      {
        resource: {
          resourceType: 'Condition',
          subject: { reference: 'Patient/patient-001' },
          code: { text: 'Hyperlipidemia' },
          onsetDateTime: '2019-01-01',
        },
        request: { method: 'POST', url: 'Condition' },
      },
      {
        resource: {
           resourceType: 'MedicationRequest',
           subject: { reference: 'Patient/patient-001' },
           medicationCodeableConcept: { text: 'Amlodipine 5mg' },
           status: 'active'
        },
        request: { method: 'POST', url: 'MedicationRequest' }
      },
      {
        resource: {
           resourceType: 'MedicationRequest',
           subject: { reference: 'Patient/patient-001' },
           medicationCodeableConcept: { text: 'Atorvastatin 20mg' },
           status: 'active'
        },
        request: { method: 'POST', url: 'MedicationRequest' }
      }
    ],
  },
  // John Leow
  {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: [
      {
        resource: {
          resourceType: 'Patient',
          id: 'patient-002',
          name: [{ family: 'Leow', given: ['John'] }],
          gender: 'male',
          birthDate: '1980-01-01',
        },
        request: { method: 'PUT', url: 'Patient/patient-002' },
      },
      {
        resource: {
          resourceType: 'Condition',
          subject: { reference: 'Patient/patient-002' },
          code: { text: 'Type 2 Diabetes' },
          onsetDateTime: '2020-01-01',
        },
        request: { method: 'POST', url: 'Condition' },
      },
      {
        resource: {
           resourceType: 'MedicationRequest',
           subject: { reference: 'Patient/patient-002' },
           medicationCodeableConcept: { text: 'Metformin 500mg' },
           status: 'active'
        },
        request: { method: 'POST', url: 'MedicationRequest' }
      }
    ],
  },
  // Sarah Lim
  {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: [
      {
        resource: {
          resourceType: 'Patient',
          id: 'patient-003',
          name: [{ family: 'Lim', given: ['Sarah'] }],
          gender: 'female',
          birthDate: '1996-01-01',
        },
        request: { method: 'PUT', url: 'Patient/patient-003' },
      },
      {
        resource: {
          resourceType: 'Condition',
          subject: { reference: 'Patient/patient-003' },
          code: { text: 'Bronchial Asthma' },
          onsetDateTime: '2010-01-01',
        },
        request: { method: 'POST', url: 'Condition' },
      },
      {
        resource: {
           resourceType: 'MedicationRequest',
           subject: { reference: 'Patient/patient-003' },
           medicationCodeableConcept: { text: 'Ventolin Inhaler' },
           status: 'active'
        },
        request: { method: 'POST', url: 'MedicationRequest' }
      },
      {
        resource: {
           resourceType: 'MedicationRequest',
           subject: { reference: 'Patient/patient-003' },
           medicationCodeableConcept: { text: 'Becotide 50mcg' },
           status: 'active'
        },
        request: { method: 'POST', url: 'MedicationRequest' }
      }
    ],
  }
];

export async function seedDatabase() {
  console.log('FHIR Service: Starting seed process...');
  
  for (const bundle of SEED_BUNDLES) {
    try {
        // Extract the Patient resource to find the ID for logging
        const patientEntry = bundle.entry.find(e => e.resource.resourceType === 'Patient');
        const patientId = patientEntry?.resource.id || 'unknown';

        console.log(`FHIR Service: Seeding ${patientId}...`);
        
        // We skip the existence check and directly POST the transaction.
        // The Patient entry uses PUT (update/create), so it is idempotent.
        // The Condition/Medication entries use POST, which might create duplicates if run repeatedly 
        // without a clean slate, but this ensures the Patient resource definitely exists.
        await fetch(FHIR_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/fhir+json' },
            body: JSON.stringify(bundle),
        });
        
    } catch (error) {
        console.warn('FHIR Service: Docker not reachable or error during seed.');
        // We continue to try other bundles or exit; here we just log.
        // NOTE: Important: Vercel does not support Docker, so we will always fallback to mock data there.
    }
  }
  console.log('FHIR Service: Seed process complete.');
}

export async function getPatientRecord(patientId: string): Promise<string> {
  // 1. Try to fetch from local FHIR server
  try {
    const patientRes = await fetch(`${FHIR_BASE_URL}/Patient/${patientId}`);
    if (!patientRes.ok) throw new Error('Patient not found');
    const patientData = await patientRes.json();

    const conditionsRes = await fetch(`${FHIR_BASE_URL}/Condition?subject=Patient/${patientId}`);
    const conditionsData = await conditionsRes.json();
    
    const medsRes = await fetch(`${FHIR_BASE_URL}/MedicationRequest?subject=Patient/${patientId}`);
    const medsData = await medsRes.json();

    // Format the data into a readable string
    const name = patientData.name?.[0]?.given?.join(' ') + ' ' + patientData.name?.[0]?.family;
    const gender = patientData.gender;
    const birthDate = patientData.birthDate;

    const conditions = conditionsData.entry
      ?.map((e: any) => e.resource?.code?.text || e.resource?.code?.coding?.[0]?.display)
      .filter(Boolean)
      .join(', ') || 'None known';

    const meds = medsData.entry
      ?.map((e: any) => e.resource?.medicationCodeableConcept?.text || e.resource?.medicationCodeableConcept?.coding?.[0]?.display)
      .filter(Boolean)
      .join(', ') || 'None active';

    return `
      Patient: ${name} (${gender}, DOB: ${birthDate})
      Conditions: ${conditions}
      Medications: ${meds}
      Source: Live FHIR Server
    `;

  } catch (error) {
    // 2. Fallback to Mock Data
    console.warn(`FHIR Service: Fetch failed for ${patientId}. Using fallback.`);
    return MOCK_RECORDS[patientId] || 'No records found.';
  }
}