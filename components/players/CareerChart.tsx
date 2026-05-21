'use client';
import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import { PlayerCareerRowDTO } from '@/types/api';

type Stat = 'points' | 'rebounds' | 'assists' | 'steals' | 'blocks';

const STAT_LABELS: Record<Stat, string> = {
  points: 'Pontos',
  rebounds: 'Rebotes',
  assists: 'Assistências',
  steals: 'Roubos',
  blocks: 'Bloqueios',
};

interface Props {
  seasons: PlayerCareerRowDTO[];
}

const ORANGE = '#f4622b';
const DIM = '#334155';

export default function CareerChart({ seasons }: Props) {
  const [stat, setStat] = useState<Stat>('points');

  const data = seasons.map((s) => ({
    season: s.season,
    value: s[stat],
    team: s.teamAbbreviation,
    gp: s.gamesPlayed,
  }));

  const maxVal = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(STAT_LABELS) as Stat[]).map((k) => (
          <button
            key={k}
            onClick={() => setStat(k)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              stat === k
                ? 'bg-nba-orange text-white'
                : 'bg-bg-surface text-muted hover:text-slate-200'
            }`}
          >
            {STAT_LABELS[k]}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="season"
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ background: '#1e2535', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#94a3b8', fontSize: 11 }}
            itemStyle={{ color: '#f1f5f9', fontSize: 12 }}
            formatter={(value: number, _: string, entry) => [
              `${value.toFixed(1)} (${entry.payload.gp} jogos)`,
              STAT_LABELS[stat],
            ]}
          />
          <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={32}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.value === maxVal ? ORANGE : DIM} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
