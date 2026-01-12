
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserProfile>({
    fullName: '',
    email: '',
    targetRole: '',
    experienceLevel: 'Entry',
    skills: [],
    bio: '',
    resumeText: '',
  });

  const [skillInput, setSkillInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
    navigate('/dashboard');
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Initialize Your Copilot</h2>
        <p className="text-slate-400">Tell us where you are and where you want to go.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 glass-card p-8 rounded-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Full Name</label>
            <input 
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
              placeholder="Alex Rivers"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Target Career Role</label>
            <input 
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.targetRole}
              onChange={e => setFormData({...formData, targetRole: e.target.value})}
              placeholder="Software Engineer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Experience Level</label>
          <select 
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none"
            value={formData.experienceLevel}
            onChange={e => setFormData({...formData, experienceLevel: e.target.value as any})}
          >
            <option value="Entry">Entry Level / Student</option>
            <option value="Mid">Mid-Level Professional</option>
            <option value="Senior">Senior / Expert</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Skills (Add multiple)</label>
          <div className="flex gap-2">
            <input 
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="e.g. Python, React, Project Mgmt"
            />
            <button 
              type="button"
              onClick={addSkill}
              className="bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skills.map(s => (
              <span key={s} className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full text-xs border border-blue-500/30">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Professional Bio / Story</label>
          <textarea 
            required
            rows={3}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none"
            value={formData.bio}
            onChange={e => setFormData({...formData, bio: e.target.value})}
            placeholder="Tell us about your background and motivation..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Paste Resume Text (Optional for Analysis)</label>
          <textarea 
            rows={5}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none"
            value={formData.resumeText}
            onChange={e => setFormData({...formData, resumeText: e.target.value})}
            placeholder="Copy/paste your CV content here for AI optimization feedback..."
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
        >
          Initialize AI Career Agents
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
