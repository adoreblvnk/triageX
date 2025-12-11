<div align="center">
  <img src="public/icon.png" alt="TriageX Logo" width=120>
  <h1>TriageX</h1>
  <p>
    Agentic voice-first triage system designed to slash polyclinic wait times. Powered by multi-agent system to cross-validate symptoms to deliver accurate risk assessments to medical staff. Built for HackRift 2025.
  </p>
  <p>
    Built With: 
    <a href="https://nextjs.org">Next.js</a> &bull; 
    <a href="https://ai-sdk.dev">AI SDK</a> &bull;
    <a href="https://groq.com">Groq</a> &bull;
    <a href="https://deepmind.google/models/gemini/flash">Gemini 2.5</a> &bull;
    <a href="https://ai.meta.com/blog/llama-4-multimodal-intelligence">Llama 4</a> &bull;
    <a href="https://openai.com/index/introducing-gpt-oss">GPT-OSS</a> &bull;
    <a href="https://elevenlabs.io">ElevenLabs</a> &bull; 
    <a href="https://github.com/hapifhir/hapi-fhir-jpaserver-starter">HAPI FHIR</a> over H2 database &bull; 
    <a href="https://motion.dev">Motion</a>
  </p>
  <p>
    <b>By Team Participation Mark</b>
  </p>
  <p>
    Live Site: <a href="https://triagex.vercel.app">triagex.vercel.app</a>
  </p>
</div>

---

<details>
<summary>Table of Contents</summary>

- [About](#about)
  - [How It Works](#how-it-works)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Execution](#execution)
- [Usage](#usage)
- [License](#license)
- [Credits](#credits)
- [Acknowledgements](#acknowledgements)
</details>

## About

<div align="center">  
  <img src="public/homepage.png" alt="Homepage" width="750">
</div>

**TriageX** is a next-generation medical kiosk interface designed for Singapore's Smart Nation initiative. It addresses the critical bottleneck in polyclinics where wait times often exceed 3 hours due to manual, repetitive triage processes.

<div align="center">  
  <img src="public/about.png" alt="About" width="750">
</div>

### The Problem <!-- omit in toc -->

- **Wait Times:** Highly trained nurses spend thousands of hours manually asking basic symptom questions.
- **Data Fragmentation:** Doctors often lack immediate context on a patient's history, relying on unreliable verbal confirmation.
- **Resource Drain:** Minor ailments clog the system, delaying care for critical patients.

### The Solution <!-- omit in toc -->

TriageX is an onsite kiosk that interviews patients *while they wait*. It uses:
1. **Voice-First Interface:** Powered by ElevenLabs Scribe v1 for high-fidelity clinical transcription.
2. **Ensemble AI Core:** A "Safety-First" consensus engine running Gemini 2.5 Flash, GPT-OSS 120B, and Llama 4 Maverick simultaneously to cross-validate diagnoses.
3. **FHIR Integration:** Simulated real-time retrieval of chronic conditions (eg Hypertension) from the National Electronic Health Record (NEHR) to context-weight the risk assessment.

### Results <!-- omit in toc -->

<div align="center">  
  <img src="public/results-ticket.png" alt="Results ticket" width="750">
</div>

### How It Works

TriageX operates on a sophisticated "Safety-First Weighted Consensus" algorithm.

1. **Input:** Voice audio is captured and isolated via **ElevenLabs**.
2. **Context Injection:** Patient history is fetched from a local **Dockerized HAPI FHIR Server**.
3. **Parallel Analysis:** The transcript and history are sent to 3 LLMs:
   - Gemini 2.5 Flash
   - GPT-OSS 120B
   - Llama 4 Maverick
4. **Consensus Logic:**
   - `IF` any model votes **P1 (Critical)** &rarr; **Override Final Score to P1**.
   - `ELSE` &rarr; Calculate weighted average of votes.

## Demo

Try it live here: [triagex.vercel.app](https://triagex.vercel.app)

<div align="center"><video width="750" controls src="https://github.com/user-attachments/assets/be72a139-dd78-4dd3-90dc-3324ea34a9d1"</video></div>

## Getting Started

### Prerequisites

- [Bun](https://bun.com)
- [Docker](https://www.docker.com)
- API Keys:
  - `GOOGLE_GENERATIVE_AI_API_KEY` from [AI Studio](https://aistudio.google.com/api-keys) 
  - `GROQ_API_KEY` from [Groq](https://console.groq.com/keys)
  - `ELEVENLABS_API_KEY` from [ElevenLabs](https://elevenlabs.io/app/developers/api-keys)
  - `AGENT_ID` from [ElevenLabs Agents](https://elevenlabs.io/app/agents/new)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun i
   ```
3. Create an `.env` file in the root directory:
   ```env
   AGENT_ID=
   ELEVENLABS_API_KEY=
   GOOGLE_GENERATIVE_AI_API_KEY=
   GROQ_API_KEY=
   ```

### Execution

1. Start FHIR Server:
   ```bash
   docker pull hapiproject/hapi:latest
   docker run -p 8080:8080 hapiproject/hapi:latest
   ```
2. Start TriageX:
   ```bash
   bun dev
   ```

## Usage

1. **Select a Patient Profile:** Click on a card (e.g., "Steven Tan") to simulate scanning an NRIC. This loads their specific medical history from the FHIR server.
2. **Voice Interaction:**
   - **Tap to Speak:** Click the microphone icon once. It will turn red.
   - **Describe Symptoms:** Speak naturally (e.g., "I fell running and my ankle is swollen").
   - **Tap to Stop:** Click the square stop icon.
3. **Review Analysis:** Watch the "Processing HUD" as the 3 AI models debate the diagnosis.
4. **Print Ticket:** Once the "Triage Slip" is generated, click **Print Ticket** to generate a physical handout for the doctor.

## License

TODO:

## Credits

**Team Participation Mark**
- [adore_blvnk](https://x.com/adore_blvnk)
- driedwater
- zayn3lee

## Acknowledgements

<!-- Inspired by Best-README-Template (https://github.com/othneildrew/Best-README-Template) -->
<!-- Table of Contents generated by Markdown All in One (https://github.com/yzhang-gh/vscode-markdown) -->

<!-- Helpful notes:
- insert a centred image:
  <div align="center"><img src="" alt="" width="750"></div>
-->
