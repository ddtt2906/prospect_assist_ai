# LAKSHYA — Agentic Retail Lending Intelligence

> Stop chasing leads. Identify customers who are ready, able and responsibly convertible.

**IDBI Innovate 2026 Hackathon Prototype**

LAKSHYA is an advanced frontend technical demonstration of an agentic retail-lending lead intelligence platform. It demonstrates how behavioural data, customer consent, bank transactions, income reconstruction, repayment-capacity calculations, loan-product eligibility, next-best-action selection, relationship-manager handoff, and outcome feedback work together.

## Technical Architecture

This prototype is built entirely with:
- React.js & Vite
- JavaScript (No TypeScript)
- Vanilla CSS (with CSS variables)
- Local State (`React Context`, `useReducer`, `sessionStorage`)
- `react-joyride` for the technical tour
- `recharts` for financial visualizations
- `lucide-react` for icons

**Note:** There is no backend, database, or external APIs (except for the optional Groq integration). All data is synthetic and processed locally in the browser to ensure the demo is highly robust and easily deployed for judging.

## Application Routes

- `/` — Landing Page & Tour Initialization
- `/customer-simulator` — Behavioural Event Generation
- `/data-capture` — Synthetic Data Connectors & Consent
- `/transaction-intelligence` — Income Reconstruction & Cash Flow
- `/agent-console` — Governed Agent Workflow
- `/lead-decision` — Decision Explainability & Next-Best Action
- `/rm-workbench` — Relationship Manager Copilot
- `/ai-lab` — Demo AI and optional Live Groq LLM Mode
- `/feedback-loop` — Synthetic Outcome Capture
- `/architecture` — Technical Pipeline Visualization

## Agent Definitions

LAKSHYA runs 6 specialized local agents sequentially:
1. **Intent Verification Agent:** Scores customer borrowing intent using clickstream data.
2. **Income Reconstruction Agent:** Computes sustainable and stress-adjusted income, ignoring circular transfers.
3. **Repayment Capacity Agent:** Calculates the stress-safe EMI based on obligations and income.
4. **Product Eligibility Agent:** Evaluates policy rules.
5. **Next-Best-Action Agent:** Recommends causal actions to maximize responsible conversion.
6. **Explanation & RM Copilot Agent:** Generates explainable dossiers and localized text.

## Local Setup

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```

## Live Groq (BYOK) Instructions

The AI Lab features a completely functional **Demo AI**. However, judges can optionally inject a Live Groq API Key to test the LLM agent capabilities with the context data.
- Navigate to the **AI Lab** route.
- Select **Live Groq** in the settings.
- Enter your Groq API Key.
- The key is **NEVER** transmitted to any server other than Groq. It is stored securely in your browser's `sessionStorage` and destroyed when the tab is closed.

## Disclaimer

**IDBI Innovate 2026 Hackathon Prototype**
Uses synthetic customer and transaction data. Not connected to IDBI Bank systems. Not a real loan offer or credit decision.
