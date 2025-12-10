TriageX: Multi-Agent Triage System

Singapore's polyclinics face a critical bottleneck: consultation wait times often exceed 3 hrs due to manual, linear triage processes. This strains healthcare resources & delays care for urgent cases. With an ageing population, the need to optimize the triage process is crucial.

TriageX is a voice-first, multi-agent pre-triage medical kiosk designed to solve this. Placing accessibility at its core, it allows patients to naturally "speak" their symptoms while waiting. Unlike standard chatbots, TriageX uses a unique safety-first Multi-Agent Ensemble. It orchestrates 3 distinct LLMs (Gemini 2.5, GPT-OSS & Llama 4) to cross-validate diagnoses in real-time. TriageX uses a weight-based strategy to detect critical risk with a safety protocol override, ensuring no emergency is missed.

TriageX simulates integration with NEHR (National Electronic Health Record) via FHIR API. By contextualizing symptoms against a patient's historical data (eg asthma), it generates precise clinical acuity scores & handoff notes before patient sees a nurse. TriageX transforms the waiting room from a passive holding area into an active diagnostic stage.
