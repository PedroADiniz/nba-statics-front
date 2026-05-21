import { H2HAnalysisDTO } from '@/types/api';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface Props { data: H2HAnalysisDTO }

export default function HalftimeWidget({ data }: Props) {
  const { halftime, meta } = data;
  const { team1, team2 } = meta;

  if (halftime.gamesWithData === 0) {
    return (
      <div className="card px-5 py-8 text-center text-muted text-sm">
        Dados de intervalo não disponíveis para este período.
      </div>
    );
  }

  const total = halftime.gamesWithData;

  return (
    <div className="card">
      <div className="card-header">
        <Clock size={14} className="text-nba-orange" />
        <span className="text-sm font-semibold text-slate-200">Placar no intervalo</span>
        <span className="ml-auto text-xs text-muted">{total} jogos</span>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* HT record bars */}
        {[
          { label: team1.abbreviation, value: halftime.team1Leads, pct: halftime.team1LeadPct, color: 'bg-win' },
          { label: 'Empate', value: halftime.tied, pct: total > 0 ? (halftime.tied / total) * 100 : 0, color: 'bg-slate-500' },
          { label: team2.abbreviation, value: halftime.team2Leads, pct: halftime.team2LeadPct, color: 'bg-loss' },
        ].map(row => (
          <div key={row.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{row.label} liderava</span>
              <span className="text-slate-300 font-medium">{row.value}/{total} · {row.pct.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-bg rounded-full overflow-hidden">
              <div className={`${row.color} h-full rounded-full transition-all duration-700`}
                style={{ width: `${row.pct}%` }} />
            </div>
          </div>
        ))}

        {/* Crossovers */}
        {halftime.crossovers.length > 0 && (
          <>
            <p className="text-xs text-muted font-medium uppercase tracking-wider pt-2">Intervalo × Final</p>
            <div className="space-y-1">
              {halftime.crossovers.map((c, i) => {
                const htLabel = c.halftimeLeader === 'team1' ? team1.abbreviation
                  : c.halftimeLeader === 'team2' ? team2.abbreviation : 'Empatado';
                const fwLabel = c.finalWinner === 'team1' ? team1.abbreviation : team2.abbreviation;
                return (
                  <div key={i} className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-xs',
                    c.isComeback ? 'bg-nba-orange/10 border border-nba-orange/20' : 'bg-bg-hover',
                  )}>
                    <span className="text-slate-400">
                      {htLabel} liderava → <span className="text-slate-200 font-semibold">{fwLabel} venceu</span>
                      {c.isComeback && <span className="ml-2 text-nba-orange font-bold">↩ virada</span>}
                    </span>
                    <span className="font-bold text-slate-200">{c.count}x · {c.pct.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
