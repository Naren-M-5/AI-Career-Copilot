
import React, { useEffect, useState, useCallback } from 'react';
import { UserProfile, AIAnalysisResult, AgentLogEntry, AgentRole, SalaryTier } from '../types';
import { runAgenticWorkflow } from '../services/geminiService';
import { storageService, SavedReport } from '../services/storageService';
import SkillChart from '../components/SkillChart';
import AgentLog from '../components/AgentLog';
import { jsPDF } from 'jspdf';

interface Props {
  profile: UserProfile;
  analysis: AIAnalysisResult | null;
  setAnalysis: (res: AIAnalysisResult) => void;
}

const Dashboard: React.FC<Props> = ({ profile, analysis, setAnalysis }) => {
  const [logs, setLogs] = useState<AgentLogEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<SavedReport[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadHistory = useCallback(() => {
    setHistory(storageService.getHistory());
  }, []);

  const startAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setLogs([]);
    
    const updateLogs = (role: AgentRole, status: any, output?: string) => {
      setLogs(prev => {
        const existing = prev.find(l => l.agent === role);
        if (existing) {
          return prev.map(l => l.agent === role ? { ...l, status, output, timestamp: new Date().toLocaleTimeString() } : l);
        }
        return [...prev, { id: Math.random().toString(), agent: role, status, output, timestamp: new Date().toLocaleTimeString() }];
      });
    };

    try {
      const result = await runAgenticWorkflow(profile, updateLogs);
      setAnalysis(result);
      storageService.saveReport(profile, result);
      loadHistory();
    } catch (err) {
      console.error(err);
      updateLogs(AgentRole.CAREER_ANALYST, 'error', "An error occurred during agent execution.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [profile, setAnalysis, loadHistory]);

  useEffect(() => {
    loadHistory();
    if (!analysis && !isAnalyzing) {
      const latest = storageService.getLatestReport();
      if (latest && latest.profile.targetRole === profile.targetRole) {
        setAnalysis(latest.analysis);
      } else {
        startAnalysis();
      }
    }
  }, [analysis, isAnalyzing, startAnalysis, profile.targetRole, setAnalysis, loadHistory]);

  const generatePDF = () => {
    if (!analysis) return;
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text("Strategic Career Concept Note", margin, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Prepared for: ${profile.fullName}`, margin, y);
    y += 15;

    const renderSection = (title: string, content: string) => {
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246);
      doc.text(title, margin, y);
      y += 7;
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      const lines = doc.splitTextToSize(content || "N/A", 170);
      doc.text(lines, margin, y);
      y += (lines.length * 5) + 10;
    };

    renderSection("1. Project Title / Role Target", analysis.conceptNote.projectTitle);
    renderSection("2. Mission Statement", analysis.conceptNote.missionStatement);
    renderSection("3. Strategic Objective", analysis.conceptNote.strategicObjective);
    renderSection("4. Expected Economic Impact (SDG 8)", analysis.conceptNote.expectedImpact);

    doc.addPage();
    y = margin;
    doc.setFontSize(22);
    doc.text("Career Lean Canvas", margin, y);
    y += 20;

    const boxes = [
      { t: "Problem", c: analysis.leanCanvas.problem, x: 20, y: 40, w: 40, h: 60 },
      { t: "Solution", c: analysis.leanCanvas.solution, x: 60, y: 40, w: 40, h: 30 },
      { t: "Key Metrics", c: analysis.leanCanvas.keyMetrics, x: 60, y: 70, w: 40, h: 30 },
      { t: "Unique Value Prop", c: analysis.leanCanvas.uniqueValueProp, x: 100, y: 40, w: 40, h: 60 },
      { t: "Unfair Advantage", x: 140, y: 40, w: 40, h: 30, c: analysis.leanCanvas.unfairAdvantage },
      { t: "Channels", x: 140, y: 70, w: 40, h: 30, c: analysis.leanCanvas.channels },
      { t: "Cost Structure", x: 20, y: 110, w: 80, h: 40, c: analysis.leanCanvas.costStructure },
      { t: "Revenue Streams", x: 100, y: 110, w: 80, h: 40, c: analysis.leanCanvas.revenueStreams },
    ];

    doc.setFontSize(8);
    boxes.forEach(box => {
      doc.rect(box.x, box.y, box.w, box.h);
      doc.setFont("helvetica", "bold");
      doc.text(box.t, box.x + 2, box.y + 5);
      doc.setFont("helvetica", "normal");
      const wrapText = doc.splitTextToSize(box.c || "", box.w - 4);
      doc.text(wrapText, box.x + 2, box.y + 12);
    });

    doc.save(`${profile.fullName.replace(/\s/g, '_')}_Career_Strategy.pdf`);
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const SalaryRow = ({ label, data, highlight }: { label: string, data: SalaryTier, highlight?: boolean }) => (
    <div className={`flex justify-between items-center p-3 rounded-lg border ${highlight ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
      <div>
        <p className={`text-[10px] uppercase font-bold tracking-widest ${highlight ? 'text-amber-400' : 'text-slate-500'}`}>{label}</p>
        <p className="text-sm font-bold text-white">{formatINR(data.avg)}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-slate-500 font-mono">Range</p>
        <p className="text-[10px] text-slate-400 font-mono">{formatINR(data.min)} - {formatINR(data.max)}</p>
      </div>
    </div>
  );

  const getScoreColor = (score: number) => {
    if (score > 75) return 'text-emerald-400 border-emerald-500';
    if (score > 40) return 'text-blue-400 border-blue-500';
    return 'text-orange-400 border-orange-500';
  };

  return (
    <div className="relative space-y-8 animate-in fade-in duration-700">
      {/* History Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-800 z-[60] transform transition-transform duration-300 shadow-2xl ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white">Report History</h3>
            <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
            {history.length === 0 && <p className="text-sm text-slate-500 italic">No saved reports yet.</p>}
            {history.map(item => (
              <div 
                key={item.id}
                onClick={() => { setAnalysis(item.analysis); setShowHistory(false); }}
                className="p-4 rounded-xl border border-slate-800 hover:border-blue-500 bg-slate-800/30 cursor-pointer group transition-all"
              >
                <p className="text-[10px] font-bold text-blue-400 mb-1">{new Date(item.timestamp).toLocaleDateString()}</p>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-200">{item.profile.targetRole}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.analysis.profileSummary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard Intelligence</h2>
          <p className="text-slate-400">Targeting: <span className="text-blue-400 font-semibold">{profile.targetRole}</span></p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setShowHistory(true)}
            className="bg-slate-800 border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-xs font-bold text-slate-300"
          >
            History ({history.length})
          </button>
          <button 
            onClick={generatePDF}
            disabled={!analysis}
            className="bg-gradient-to-r from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-slate-900 px-6 py-2 rounded-lg text-sm font-bold disabled:opacity-50 transition-all shadow-lg"
          >
            Export Strategy (PDF)
          </button>
          <button 
            onClick={startAnalysis}
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 shadow-lg shadow-blue-500/20"
          >
            {isAnalyzing ? "Agents at work..." : "New Analysis"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <AgentLog logs={logs} />
          
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">SDG 8 Focus</h3>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              "This system optimizes for Target 8.6: reducing youth not in employment, education, or training by providing automated professional mapping."
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          {analysis ? (
            <>
              {/* Concept Note */}
              <div className="glass-card p-8 rounded-2xl border-l-4 border-amber-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <span className="text-8xl font-black">STRATEGY</span>
                </div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Strategic Concept Note</h3>
                    <p className="text-sm text-slate-400">Market-ready professional value proposition</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-amber-500 uppercase font-bold tracking-widest mb-1">Mission</p>
                      <p className="text-sm text-slate-200 leading-relaxed italic">"{analysis.conceptNote.missionStatement}"</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-amber-500 uppercase font-bold tracking-widest mb-1">Economic Impact</p>
                      <p className="text-sm text-slate-200 leading-relaxed">{analysis.conceptNote.expectedImpact}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Intelligence */}
              <div className="glass-card p-8 rounded-2xl border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-white mb-4">Agentic Summary</h3>
                <p className="text-slate-300 leading-relaxed">{analysis.profileSummary}</p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {analysis.strengths.map(s => (
                    <span key={s} className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold border border-green-500/30 uppercase">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">Competency Map</h3>
                  <SkillChart data={analysis.skillGaps} />
                </div>

                <div className="glass-card p-6 rounded-2xl border-l-4 border-emerald-500">
                  <h3 className="text-lg font-bold text-white mb-6">INR Benchmarks</h3>
                  <div className="space-y-4">
                    <SalaryRow label="Entry Level" data={analysis.salaryEstimate.entry} highlight={profile.experienceLevel === 'Entry'} />
                    <SalaryRow label="Mid-Career" data={analysis.salaryEstimate.mid} highlight={profile.experienceLevel === 'Mid'} />
                    <SalaryRow label="Senior / Lead" data={analysis.salaryEstimate.senior} highlight={profile.experienceLevel === 'Senior'} />
                  </div>
                </div>
              </div>

              {/* Resume Analytics */}
              <div className="glass-card p-8 rounded-2xl">
                <div className="flex items-center gap-6 mb-8">
                  <div className={`p-5 rounded-full bg-slate-800 border-4 ${getScoreColor(analysis.resumeFeedback.score)} text-4xl font-bold`}>
                    {Math.round(analysis.resumeFeedback.score)}%
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">ATS Optimization Score</h3>
                    <p className="text-sm text-slate-400">Score based on market-specific technical requirements</p>
                    {(!profile.resumeText || profile.resumeText.length < 50) && (
                      <p className="text-[10px] text-amber-500 mt-1 font-bold">⚠️ Partial score: Full resume text was not provided.</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Key Positives</h4>
                    <ul className="space-y-2">
                      {analysis.resumeFeedback.positives.map((p, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-emerald-500">✓</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Suggested Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.resumeFeedback.suggestedKeywords.map((kw, i) => (
                        <span key={i} className="text-[10px] px-2 py-1 bg-blue-900/30 text-blue-400 border border-blue-500/30 rounded uppercase font-bold tracking-tighter">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Roadmap Section */}
              <div className="glass-card p-8 rounded-2xl">
                 <h3 className="text-xl font-bold text-white mb-8">Strategic Growth Roadmap</h3>
                 <div className="space-y-12 relative before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                    {analysis.roadmap.map((m, i) => (
                      <div key={i} className="relative pl-10">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-600 border-4 border-slate-900 z-10"></div>
                        <div>
                          <span className="text-[10px] font-black text-blue-500 uppercase">Month {m.month}</span>
                          <h4 className="text-lg font-bold text-white mb-2">{m.title}</h4>
                          <p className="text-sm text-slate-400 mb-4">{m.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {m.actionItems.map((item, j) => (
                              <span key={j} className="text-[10px] px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 animate-pulse">Synchronizing Agent Networks...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
