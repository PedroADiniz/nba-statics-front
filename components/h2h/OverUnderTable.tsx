import { H2HAnalysisDTO } from '@/types/api';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

interface Props { data: H2HAnalysisDTO }

export default function OverUnderTable({ data }: Props) {
  const { thresholds, scoring } = data;
  const avg = scoring.totalAvg;

  return (
    <div className="card">
      <div className="card-header">
        <TrendingUp size={14} className="text-nba-orange" />
        <span className="text-sm font-semibold text-slate-200">Over / Under — Total de pontos</span>
        <span className="ml-auto text-xs text-muted">Média: {avg.toFixed(1)} pts</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted text-xs">
              <th className="px-5 py-2.5 text-left font-medium">Linha</th>
              <th className="px-3 py-2.5 text-center font-medium">Over</th>
              <th className="px-3 py-2.5 text-center font-medium">%</th>
              <th className="px-3 py-2.5 w-1/3 py-2.5 px-5" />
              <th className="px-3 py-2.5 text-center font-medium">Under</th>
              <th className="px-3 py-2.5 text-center font-medium">%</th>
            </tr>
          </thead>
          <tbody>
            {thresholds.total.map((row) => {
              const isNear = Math.abs(row.line - avg) < 3;
              return (
                <tr key={row.line} className={cn(
                  'border-b border-border/50 table-row-hover',
                  isNear && 'bg-nba-orange/5',
                )}>
                  <td className="px-5 py-2.5 font-mono font-semibold text-slate-200">
                    {row.line}
                    {isNear && <span className="ml-2 text-nba-orange text-xs">◄</span>}
                  </td>
                  <td className="px-3 py-2.5 text-center text-win font-semibold">{row.over}</td>
                  <td className="px-3 py-2.5 text-center">
                    <PctBar value={row.overPct} color="bg-win" />
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="flex h-1.5 rounded-full overflow-hidden bg-bg gap-px">
                      <div className="bg-win rounded-l-full" style={{ width: `${row.overPct}%` }} />
                      <div className="bg-loss rounded-r-full" style={{ width: `${row.underPct}%` }} />
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-center text-loss font-semibold">{row.under}</td>
                  <td className="px-3 py-2.5 text-center">
                    <PctBar value={row.underPct} color="bg-loss" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PctBar({ value, color }: { value: number; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 min-w-[48px]">
      {value.toFixed(0)}%
    </span>
  );
}
