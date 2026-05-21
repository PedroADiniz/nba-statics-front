'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { H2HAnalysisDTO } from '@/types/api';
import { BarChart2 } from 'lucide-react';

interface Props { data: H2HAnalysisDTO }

export default function QuarterChart({ data }: Props) {
  const { quarterAverages, meta } = data;

  if (quarterAverages.gamesWithData === 0) {
    return (
      <div className="card px-5 py-8 text-center text-muted text-sm">
        Dados por quarto não disponíveis. Use <code className="bg-bg px-1 rounded">includeQuarters=true</code>.
      </div>
    );
  }

  const chartData = quarterAverages.team1.map((q, i) => ({
    quarter: q.quarter,
    [meta.team1.abbreviation]: q.avg,
    [meta.team2.abbreviation]: quarterAverages.team2[i].avg,
    Combinado: q.combinedAvg,
  }));

  return (
    <div className="card">
      <div className="card-header">
        <BarChart2 size={14} className="text-nba-orange" />
        <span className="text-sm font-semibold text-slate-200">Média de pontos por quarto</span>
        <span className="ml-auto text-xs text-muted">{quarterAverages.gamesWithData} jogos</span>
      </div>
      <div className="px-4 pt-3 pb-1">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barGap={3} barCategoryGap="30%" margin={{ top: 5, right: 5, bottom: -10, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3347" vertical={false} />
            <XAxis dataKey="quarter" tick={{ fill: '#8c96a8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8c96a8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
            <Tooltip
              contentStyle={{ background: '#1e2535', border: '1px solid #2a3347', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
              itemStyle={{ color: '#8c96a8' }}
              cursor={{ fill: 'rgba(244,98,43,0.05)' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#8c96a8', paddingTop: 8 }} />
            <Bar dataKey={meta.team1.abbreviation} fill="#22c55e" radius={[3, 3, 0, 0]} />
            <Bar dataKey={meta.team2.abbreviation} fill="#ef4444" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Combinado" fill="#f4622b" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
