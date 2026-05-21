'use client';
import { useState } from 'react';
import { PlayerGameEntryDTO } from '@/types/api';
import { fmtPct, fmtStat } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  games: PlayerGameEntryDTO[];
}

const VISIBLE_DEFAULT = 10;

export default function GameLogTable({ games }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? games : games.slice(0, VISIBLE_DEFAULT);

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {['Data', 'Partida', 'R', 'MIN', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'FG%', '3P%', 'FT%', '+/-'].map((h) => (
                <th key={h} className="px-2 py-2.5 text-left text-muted font-medium uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((g) => (
              <tr key={g.gameId} className="table-row-hover border-b border-border/40">
                <td className="px-2 py-2 text-muted whitespace-nowrap">{g.gameDate}</td>
                <td className="px-2 py-2 text-slate-300 whitespace-nowrap font-medium">{g.matchup}</td>
                <td className="px-2 py-2">
                  <span className={`font-bold ${g.outcome === 'W' ? 'text-win' : 'text-loss'}`}>
                    {g.outcome}
                  </span>
                </td>
                <td className="px-2 py-2 text-muted">{fmtStat(g.minutes, 0)}</td>
                <td className="px-2 py-2 text-slate-200 font-semibold">{fmtStat(g.points, 0)}</td>
                <td className="px-2 py-2 text-slate-300">{fmtStat(g.rebounds, 0)}</td>
                <td className="px-2 py-2 text-slate-300">{fmtStat(g.assists, 0)}</td>
                <td className="px-2 py-2 text-muted">{fmtStat(g.steals, 0)}</td>
                <td className="px-2 py-2 text-muted">{fmtStat(g.blocks, 0)}</td>
                <td className="px-2 py-2 text-muted">{fmtStat(g.turnovers, 0)}</td>
                <td className="px-2 py-2 text-muted font-mono">{fmtPct(g.fieldGoalPct)}</td>
                <td className="px-2 py-2 text-muted font-mono">{fmtPct(g.threePointPct)}</td>
                <td className="px-2 py-2 text-muted font-mono">{fmtPct(g.freeThrowPct)}</td>
                <td className={`px-2 py-2 font-mono font-semibold ${g.plusMinus > 0 ? 'text-win' : g.plusMinus < 0 ? 'text-loss' : 'text-muted'}`}>
                  {g.plusMinus > 0 ? `+${g.plusMinus}` : g.plusMinus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {games.length > VISIBLE_DEFAULT && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="btn-ghost w-full flex items-center justify-center gap-1.5 text-xs"
        >
          {expanded
            ? <><ChevronUp size={13} /> Mostrar menos</>
            : <><ChevronDown size={13} /> Ver todos {games.length} jogos</>
          }
        </button>
      )}
    </div>
  );
}
