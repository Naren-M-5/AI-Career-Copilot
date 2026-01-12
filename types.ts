
export enum AgentRole {
  CAREER_ANALYST = 'Career Analyst',
  SKILL_GAP_DIAGNOSER = 'Skill Gap Diagnoser',
  RESUME_OPTIMIZER = 'Resume Optimizer',
  CAREER_PLANNER = 'Career Path Planner',
  STRATEGY_CONSULTANT = 'Strategy Consultant'
}

export interface UserProfile {
  fullName: string;
  email: string;
  targetRole: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
  skills: string[];
  bio: string;
  resumeText: string;
}

export interface AgentLogEntry {
  id: string;
  agent: AgentRole;
  status: 'pending' | 'working' | 'completed' | 'error';
  timestamp: string;
  output?: string;
  reasoning?: string;
}

export interface SkillGapData {
  skill: string;
  current: number;
  target: number;
}

export interface CareerMilestone {
  month: number;
  title: string;
  description: string;
  actionItems: string[];
}

export interface SalaryTier {
  min: number;
  max: number;
  avg: number;
}

export interface LeanCanvas {
  problem: string;
  solution: string;
  keyMetrics: string;
  uniqueValueProp: string;
  unfairAdvantage: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
}

export interface ConceptNote {
  projectTitle: string;
  missionStatement: string;
  targetMarket: string;
  strategicObjective: string;
  expectedImpact: string;
}

export interface AIAnalysisResult {
  profileSummary: string;
  strengths: string[];
  skillGaps: SkillGapData[];
  salaryEstimate: {
    currency: string;
    entry: SalaryTier;
    mid: SalaryTier;
    senior: SalaryTier;
    insight: string;
  };
  resumeFeedback: {
    score: number;
    positives: string[];
    improvements: string[];
    suggestedKeywords: string[];
    redFlags: string[];
  };
  roadmap: CareerMilestone[];
  suggestedJobs: {
    title: string;
    company: string;
    matchReason: string;
  }[];
  conceptNote: ConceptNote;
  leanCanvas: LeanCanvas;
}
