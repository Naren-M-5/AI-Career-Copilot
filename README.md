# AI Career Copilot 🚀

**An Agentic AI System for Career Strategic Planning & SDG 8 Alignment**

AI Career Copilot is a sophisticated multi-agent orchestration system built to democratize high-end career coaching. It analyzes user profiles, diagnoses technical skill gaps, provides real-world salary intelligence (INR), and synthesizes a full business-grade **Concept Note** and **Lean Canvas** for your career transition.

## 🎯 SDG 8 Alignment
This project directly supports **United Nations Sustainable Development Goal 8: Decent Work and Economic Growth**. By providing automated, high-quality guidance, we bridge the mentorship gap for thousands of professionals globally, specifically targeting **Target 8.6** (Reducing youth unemployment).

## 🤖 Agentic Engine
The system utilizes five specialized agents working in a high-performance parallel workflow:
1. **Career Analyst**: Establishes professional identity and market context.
2. **Skill Gap Diagnoser**: Maps current skills against live industry requirements.
3. **Resume Optimization Agent**: Technical CV review for ATS compliance.
4. **Career Planner**: Synthesizes a sequential 6-month roadmap.
5. **Strategy Consultant**: Drafts your Career Concept Note and Lean Canvas (Exportable as PDF).

## 🛠️ Tech Stack
- **Framework**: React 19 / Vite / TypeScript
- **Intelligence**: Google Gemini 3 (Flash Preview)
- **Deployment**: GitHub Pages / Vercel
- **Visualization**: Recharts (Radar/Spider charts)
- **Document Engine**: jsPDF

## 🚀 Deployment to GitHub Pages

### 1. Configure Secrets
1. Go to your GitHub Repository **Settings**.
2. Navigate to **Secrets and variables** -> **Actions**.
3. Create a **New repository secret**.
4. Name: `API_KEY`
5. Value: Your Google AI Studio API Key.

### 2. Enable GitHub Actions Deployment
1. Go to **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, select **GitHub Actions**.

### 3. Push to Main
Push your code to the `main` branch. The included workflow in `.github/workflows/deploy.yml` will automatically build and deploy your site to `https://<your-username>.github.io/<repo-name>/`.

## ⚖️ Ethical AI & Governance
- **Transparency**: Every step of the agent's process is logged in real-time in the Dashboard.
- **Fairness**: Prompts are engineered to evaluate skills and market demand without demographic bias.
- **Advisory Only**: AI outputs are meant to assist strategic thinking, not replace professional human counseling.

---
*Created with ❤️ to support global employability and SDG 8 goals.*