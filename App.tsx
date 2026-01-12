import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CustomCursor from './components/CustomCursor';
import { UserProfile, AIAnalysisResult } from './types';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

  return (
    <Router>
      <div className="min-h-screen gradient-bg relative">
        <CustomCursor />
        
        <nav className="p-4 flex justify-between items-center border-b border-slate-700/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">C</div>
            <h1 className="text-xl font-bold tracking-tight text-white">Career Copilot</h1>
          </div>
          <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            SDG 8: Decent Work & Economic Growth
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding onComplete={(p: UserProfile) => setProfile(p)} />} />
            <Route 
              path="/dashboard" 
              element={
                profile ? (
                  <Dashboard profile={profile} analysis={analysis} setAnalysis={setAnalysis} />
                ) : (
                  <Navigate to="/onboarding" />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-800 mt-12">
          <p>© 2024 AI Career Copilot. Empowering global talent through agentic intelligence.</p>
          <p className="mt-2 text-xs">Ethical AI Disclaimer: Guidance provided is illustrative. Verify credentials with professionals.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;