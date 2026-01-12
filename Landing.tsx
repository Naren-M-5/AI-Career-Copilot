
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-20 text-center min-h-[80vh]">
        <div className="mb-6 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium animate-bounce">
          Advanced AI Agent for SDG 8
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight max-w-4xl">
          Bridge the Skill Gap with <span className="text-blue-500">Agentic Guidance.</span>
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl">
          Don't just search for jobs. Let our multi-agent AI system analyze your potential, diagnose your skill gaps, and build your professional roadmap.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/onboarding" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl shadow-blue-500/20 text-center"
          >
            Build My Career Path
          </Link>
          <button 
            onClick={scrollToHowItWorks}
            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold transition-all border border-slate-700 text-center"
          >
            Learn How It Works
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl">
          <FeatureCard 
            icon="📊" 
            title="Skill Gap Diagnosis" 
            desc="Our Diagnoser Agent maps your current skills against live market demand."
          />
          <FeatureCard 
            icon="📄" 
            title="Resume Intelligence" 
            desc="Get detailed, structured feedback on your CV to maximize interview success."
          />
          <FeatureCard 
            icon="🗺️" 
            title="Adaptive Roadmaps" 
            desc="Receive a 6-month actionable plan with milestones tailored to your goals."
          />
        </div>
      </div>

      {/* How it Works Section */}
      <div ref={howItWorksRef} className="py-24 w-full max-w-5xl scroll-mt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Agentic Workflow</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Unlike simple chatbots, our system orchestrates four specialized AI agents to provide a comprehensive career growth strategy.
          </p>
        </div>

        <div className="space-y-12">
          <Step 
            number="01" 
            title="Career Analyst Agent" 
            desc="Analyzes your narrative, background, and aspirations to define your professional identity and core strengths." 
            color="border-blue-500"
          />
          <Step 
            number="02" 
            title="Skill Gap Diagnoser Agent" 
            desc="Cross-references your current technical stack against real-world industry requirements for your target role." 
            color="border-purple-500"
          />
          <Step 
            number="03" 
            title="Resume Optimization Agent" 
            desc="Reviews your CV for ATS compatibility, keyword density, and red flags, providing actionable refinement steps." 
            color="border-green-500"
          />
          <Step 
            number="04" 
            title="Career Path Planner Agent" 
            desc="Synthesizes all insights into a sequential 6-month growth plan with specific learning milestones." 
            color="border-orange-500"
          />
        </div>

        <div className="mt-20 text-center p-12 glass-card rounded-3xl border-dashed border-2 border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to start your journey?</h3>
          <p className="text-slate-400 mb-8">Join thousands of professionals using agentic AI to achieve SDG 8 goals.</p>
          <Link 
            to="/onboarding" 
            className="inline-block bg-white text-slate-900 px-10 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Get Started for Free
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="glass-card p-8 rounded-2xl text-left hover:border-blue-500/50 transition-colors">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const Step = ({ number, title, desc, color }: { number: string; title: string; desc: string; color: string }) => (
  <div className={`flex flex-col md:flex-row gap-8 items-start glass-card p-8 rounded-2xl border-l-4 ${color}`}>
    <div className="text-4xl font-black text-slate-700/50 select-none">{number}</div>
    <div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Landing;
