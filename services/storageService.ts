
import { AIAnalysisResult, UserProfile } from '../types';

export interface SavedReport {
  id: string;
  timestamp: string;
  profile: UserProfile;
  analysis: AIAnalysisResult;
}

const STORAGE_KEY = 'career_copilot_history';

export const storageService = {
  saveReport: (profile: UserProfile, analysis: AIAnalysisResult): string => {
    const history = storageService.getHistory();
    const id = Math.random().toString(36).substr(2, 9);
    const newReport: SavedReport = {
      id,
      timestamp: new Date().toISOString(),
      profile,
      analysis,
    };
    
    const updatedHistory = [newReport, ...history].slice(0, 10); // Keep last 10 reports
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return id;
  },

  getHistory: (): SavedReport[] => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  deleteReport: (id: string) => {
    const history = storageService.getHistory();
    const filtered = history.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  getLatestReport: (): SavedReport | null => {
    const history = storageService.getHistory();
    return history.length > 0 ? history[0] : null;
  }
};
