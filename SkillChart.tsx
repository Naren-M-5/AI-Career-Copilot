
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SkillGapData } from '../types';

interface Props {
  data: SkillGapData[];
}

const SkillChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return <div className="text-slate-500 italic text-sm">Waiting for agent data...</div>;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Current Proficiency"
            dataKey="current"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Radar
            name="Market Requirement"
            dataKey="target"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.2}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: '#f8fafc' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillChart;
