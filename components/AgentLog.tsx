
import React, { useState } from 'react';
import { AgentLogEntry } from '../types';

interface Props {
  logs: AgentLogEntry[];
}

const AgentLog: React.FC<Props> = ({ logs }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openAll = () => {
    setExpandedIds(new Set(logs.map(l => l.id)));
  };

  // Sort logs by status (working first) then by timestamp
  const sortedLogs = [...logs].sort((a, b) => {
    if (a.status === 'working' && b.status !== 'working') return -1;
    if (a.status !== 'working' && b.status === 'working') return 1;
    return b.timestamp.localeCompare(a.timestamp);
  });

  return (
    <div className="glass-card p-6 rounded-2xl overflow-hidden flex flex-col h-full max-h-[700px]">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="text-lg font-bold text-white">Agent Activity Log</h3>
        <button 
          onClick={openAll}
          className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-widest border border-blue-500/20 px-2 py-1 rounded"
        >
          Open All
        </button>
      </div>
      
      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {logs.length === 0 && (
          <div className="text-sm text-slate-500 italic py-10 text-center">
            Initializing system protocols...
          </div>
        )}
        
        {sortedLogs.map((log) => {
          const isExpanded = expandedIds.has(log.id);
          return (
            <div 
              key={log.id} 
              className={`p-4 rounded-xl transition-all duration-300 ${log.status === 'working' ? 'border-blue-500/50 bg-blue-500/5' : isExpanded ? 'bg-slate-800/80 border-blue-500/30' : 'bg-slate-900/50 border-slate-800'} border space-y-2`}
            >
              <div className="flex justify-between items-start">
                <div onClick={() => toggleExpand(log.id)} className="cursor-pointer group flex-1">
                  <p className="text-[10px] font-mono text-blue-400 mb-1 group-hover:text-blue-300 transition-colors">[{log.timestamp}] {isExpanded ? '▼' : '▶'}</p>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-200">{log.agent}</h4>
                </div>
                <StatusBadge status={log.status} />
              </div>
              
              {log.output && (
                <p className={`text-xs text-slate-400 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                  {log.output}
                </p>
              )}

              {log.status === 'working' && (
                <div className="flex gap-1 mt-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    pending: 'bg-slate-700 text-slate-300',
    working: 'bg-blue-900/50 text-blue-400 animate-pulse',
    completed: 'bg-green-900/50 text-green-400',
    error: 'bg-red-900/50 text-red-400'
  };

  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${colors[status as keyof typeof colors]}`}>
      {status === 'working' ? 'Processing' : status}
    </span>
  );
};

export default AgentLog;
