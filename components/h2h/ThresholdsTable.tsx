import { H2HAnalysisDTO } from '@/types/api';
import { cn } from '@/lib/utils';
import { Target } from 'lucide-react';

interface Props { data: H2HAnalysisDTO }

export default function ThresholdsTable({ data }: Props) {
  const { thresholds, meta, scoring } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TeamThreshold
        label={meta.team1.fullName}
        abbr={meta.team1.abbreviation}
        rows={thresholds.team1}
        avg={scoring.team1Avg}
        total={meta.totalGames}
      />
      <TeamThreshold
        label={meta.team2.fullName}
        abbr={meta.team2.abbreviation}
        rows={thresholds.team2}
        avg={scoring.team2Avg}
        total={meta.totalGames}
      />
    </div>
  );
}

function TeamThreshold({ label, abbr, rows, avg, total }: {
  label: string; abbr: string;
  rows: H2HAnalysisDTO['thresholds']['team1'];
  avg: number; total: number;
}) {
  return (
    <div className="card">
      <div className="card-header">
        <Target size={14} className="text-nba-orange" />
        <span className="text-sm font-semibold text-slate-200 truncate">{abbr}</span>
        <span className="ml-auto text-xs text-muted">média {avg.toFixed(1)} pts</span>
      </div>
      <div className="px-5 py-3 space-y-2">
        {rows.map(row => {
          const isNear = Math.abs(row.points - avg) < 5;
          return (
            <div key={row.points} className={cn(
              'flex items-center gap-3 py-1.5',
              isNear && 'opacity-100',
              !isNear && 'opacity-75',
            )}>
              <span className={cn(
                'font-mono text-sm font-bold w-8 shrink-0',
                isNear ? 'text-nba-orange' : 'text-slate-400',
              )}>
                {row.points}+
              </span>
              <div className="flex-1 h-1.5 bg-bg rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-700',
                    row.pct >= 70 ? 'bg-win' : row.pct >= 40 ? 'bg-nba-orange' : 'bg-loss',
                  )}
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 font-mono w-16 text-right shrink-0">
                {row.count}/{total} · {row.pct.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
