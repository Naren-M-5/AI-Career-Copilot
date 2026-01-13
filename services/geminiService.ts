import { UserProfile, AIAnalysisResult, AgentRole } from '../types';

/**
 * Robust JSON extraction and normalization
 * Handles common AI response quirks like "10%" instead of 10
 */
const extractAndParseJSON = (text: string) => {
  try {
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(jsonStr);

    const normalizeNumbers = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(normalizeNumbers);
      
      const newObj: any = {};
      const numericKeys = ['score', 'current', 'target', 'min', 'max', 'avg', 'month'];
      
      for (const [key, value] of Object.entries(obj)) {
        if (numericKeys.includes(key)) {
          // Clean strings like "10%", "$5000", or "Month 1" to pure numbers
          const cleanValue = typeof value === 'string' ? value.replace(/[^0-9.-]/g, '') : value;
          newObj[key] = Number(cleanValue) || 0;
        } else if (typeof value === 'object') {
          newObj[key] = normalizeNumbers(value);
        } else {
          newObj[key] = value;
        }
      }
      return newObj;
    };

    return normalizeNumbers(parsed);
  } catch (e) {
    console.error("Gemini Service: Critical Parsing Failure", e, text);
    return null;
  }
};

const getSystemInstruction = (role: AgentRole) => {
  switch (role) {
    case AgentRole.CAREER_ANALYST:
      return "Senior Career Strategist. Task: Define professional identity and provide Indian market salary benchmarks (INR). Output JSON.";
    case AgentRole.SKILL_GAP_DIAGNOSER:
      return "Technical Skill Auditor. Task: Map current stack vs industry requirements. Provide scores 0-10. Output JSON array.";
    case AgentRole.RESUME_OPTIMIZER:
      return "ATS Compliance Expert. Task: Score resume (0-100) and provide actionable fixes. Output JSON.";
    case AgentRole.CAREER_PLANNER:
      return "Strategic Roadmapper. Task: 6-month career advancement plan and job titles. Output JSON.";
    case AgentRole.STRATEGY_CONSULTANT:
      return "Business Strategy Consultant. Task: Draft a formal Career Concept Note and Lean Canvas. Output JSON.";
    default:
      return "AI Agent.";
  }
};

async function runAgentTask(role: AgentRole, contents: string, schema: any, retries = 2) {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          contents,
          schema,
          systemInstruction: getSystemInstruction(role)
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server Error ${response.status}`);
      }

      const result = await response.json();
      const data = extractAndParseJSON(result.text);
      if (data) return data;
    } catch (err) {
      console.warn(`[Agent ${role}] Attempt ${i+1}/${retries} failed. Retrying...`, err);
      lastError = err;
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  throw lastError || new Error(`Agent ${role} exhausted all retries.`);
}

export const runAgenticWorkflow = async (
  profile: UserProfile, 
  onLog: (role: AgentRole, status: string, output?: string) => void
): Promise<AIAnalysisResult> => {
  
  onLog(AgentRole.CAREER_ANALYST, 'working');
  onLog(AgentRole.SKILL_GAP_DIAGNOSER, 'working');
  onLog(AgentRole.RESUME_OPTIMIZER, 'working');

  const clusterA = await Promise.all([
    runAgentTask(AgentRole.CAREER_ANALYST, 
      `User Profile: Name: ${profile.fullName}, Role: ${profile.targetRole}, Skills: ${profile.skills.join(', ')}`,
      {
        type: "OBJECT",
        properties: {
          summary: { type: "STRING" },
          salary: {
            type: "OBJECT",
            properties: {
              currency: { type: "STRING" },
              entry: { type: "OBJECT", properties: { min: { type: "NUMBER" }, max: { type: "NUMBER" }, avg: { type: "NUMBER" } } },
              mid: { type: "OBJECT", properties: { min: { type: "NUMBER" }, max: { type: "NUMBER" }, avg: { type: "NUMBER" } } },
              senior: { type: "OBJECT", properties: { min: { type: "NUMBER" }, max: { type: "NUMBER" }, avg: { type: "NUMBER" } } },
              insight: { type: "STRING" }
            },
            required: ["currency", "entry", "mid", "senior"]
          }
        },
        required: ["summary", "salary"]
      }
    ).then(res => { onLog(AgentRole.CAREER_ANALYST, 'completed', 'Analysis finalized.'); return res; }),

    runAgentTask(AgentRole.SKILL_GAP_DIAGNOSER,
      `Mapping: [${profile.skills.join(', ')}] to Target [${profile.targetRole}]`,
      {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: { skill: { type: "STRING" }, current: { type: "NUMBER" }, target: { type: "NUMBER" } },
          required: ["skill", "current", "target"]
        }
      }
    ).then(res => { onLog(AgentRole.SKILL_GAP_DIAGNOSER, 'completed', 'Skill gaps identified.'); return res; }),

    runAgentTask(AgentRole.RESUME_OPTIMIZER,
      `Reviewing Resume: ${profile.resumeText || 'No text provided'}. Context: ${profile.bio}`,
      {
        type: "OBJECT",
        properties: {
          score: { type: "NUMBER" },
          positives: { type: "ARRAY", items: { type: "STRING" } },
          improvements: { type: "ARRAY", items: { type: "STRING" } },
          suggestedKeywords: { type: "ARRAY", items: { type: "STRING" } },
          redFlags: { type: "ARRAY", items: { type: "STRING" } }
        },
        required: ["score", "positives", "improvements"]
      }
    ).then(res => { onLog(AgentRole.RESUME_OPTIMIZER, 'completed', 'ATS scoring finished.'); return res; })
  ]);

  const [analystData, skillGaps, resumeFeedback] = clusterA;

  onLog(AgentRole.STRATEGY_CONSULTANT, 'working');
  onLog(AgentRole.CAREER_PLANNER, 'working');

  const clusterB = await Promise.all([
    runAgentTask(AgentRole.STRATEGY_CONSULTANT,
      `Synthesizing strategy for: ${analystData.summary}`,
      {
        type: "OBJECT",
        properties: {
          conceptNote: {
            type: "OBJECT",
            properties: {
              projectTitle: { type: "STRING" }, missionStatement: { type: "STRING" }, targetMarket: { type: "STRING" }, strategicObjective: { type: "STRING" }, expectedImpact: { type: "STRING" }
            }
          },
          leanCanvas: {
            type: "OBJECT",
            properties: {
              problem: { type: "STRING" }, solution: { type: "STRING" }, keyMetrics: { type: "STRING" }, uniqueValueProp: { type: "STRING" }, unfairAdvantage: { type: "STRING" }, channels: { type: "STRING" }, customerSegments: { type: "STRING" }, costStructure: { type: "STRING" }, revenueStreams: { type: "STRING" }
            }
          }
        }
      }
    ).then(res => { onLog(AgentRole.STRATEGY_CONSULTANT, 'completed', 'Career strategy drafted.'); return res; }),

    runAgentTask(AgentRole.CAREER_PLANNER,
      `Planning for gaps: ${skillGaps.map((s:any) => s.skill).join(', ')}`,
      {
        type: "OBJECT",
        properties: {
          roadmap: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: { month: { type: "NUMBER" }, title: { type: "STRING" }, description: { type: "STRING" }, actionItems: { type: "ARRAY", items: { type: "STRING" } } }
            }
          },
          suggestedJobs: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: { title: { type: "STRING" }, company: { type: "STRING" }, matchReason: { type: "STRING" } }
            }
          }
        }
      }
    ).then(res => { onLog(AgentRole.CAREER_PLANNER, 'completed', 'Career roadmap generated.'); return res; })
  ]);

  const [strategyData, planningData] = clusterB;

  return {
    profileSummary: analystData.summary,
    salaryEstimate: analystData.salary,
    strengths: profile.skills.slice(0, 3),
    skillGaps,
    resumeFeedback,
    roadmap: planningData.roadmap || [],
    suggestedJobs: planningData.suggestedJobs || [],
    conceptNote: strategyData.conceptNote,
    leanCanvas: strategyData.leanCanvas
  };
};