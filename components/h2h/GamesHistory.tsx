'use client';
import { useState } from 'react';
import { H2HAnalysisDTO, GameDTO } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { ChevronDown, ChevronUp, List } from 'lucide-react';

interface Props { data: H2HAnalysisDTO }

export default function GamesHistory({ data }: Props) {
  const { games, meta } = data;
  const { team1, team2 } = meta;
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? [...games].reverse() : [...games].reverse().slice(0, 10);

  return (
    <div className="card">
      <div className="card-header">
        <List size={14} className="text-nba-orange" />
        <span className="text-sm font-semibold text-slate-200">Histórico de partidas</span>
        <span className="ml-auto text-xs text-muted">{games.length} jogos</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border text-muted text-xs">
              <th className="px-4 py-2.5 text-left font-medium">Data</th>
              <th className="px-3 py-2.5 text-center font-medium">Local</th>
              {games.some(g => g.team1Quarters) && (
                <>
                  <th className="px-2 py-2.5 text-center font-medium hidden md:table-cell">Q1</th>
                  <th className="px-2 py-2.5 text-center font-medium hidden md:table-cell">Q2</th>
                  <th className="px-2 py-2.5 text-center font-medium hidden md:table-cell">Q3</th>
                  <th className="px-2 py-2.5 text-center font-medium hidden md:table-cell">Q4</th>
                </>
              )}
              <th className="px-3 py-2.5 text-center font-medium">{team1.abbreviation}</th>
              <th className="px-1 py-2.5 text-center text-muted">–</th>
              <th className="px-3 py-2.5 text-center font-medium">{team2.abbreviation}</th>
              <th className="px-4 py-2.5 text-center font-medium">Total</th>
              <th className="px-4 py-2.5 text-center font-medium">Margem</th>
              <th className="px-4 py-2.5 text-right font-medium">Vencedor</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((g) => (
              <GameRow
                key={g.gameId}
                game={g}
                t1Abbr={team1.abbreviation}
                t2Abbr={team2.abbreviation}
                showQuarters={games.some(g => g.team1Quarters)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {games.length > 10 && (
        <div className="px-4 py-3 border-t border-border">
          <button
            onClick={() => setExpanded(v => !v)}
            className="btn-ghost w-full flex items-center justify-center gap-1.5"
          >
            {expanded ? <><ChevronUp size={14} /> Mostrar menos</> : <><ChevronDown size={14} /> Ver todos os {games.length} jogos</>}
          </button>
        </div>
      )}
    </div>
  );
}

function GameRow({ game, t1Abbr, t2Abbr, showQuarters }: {
  game: GameDTO; t1Abbr: string; t2Abbr: string; showQuarters: boolean;
}) {
  const t1Won = game.winner === 'team1';

  return (
    <tr className="border-b border-border/40 table-row-hover">
      <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">{formatDate(game.date)}</td>
      <td className="px-3 py-2.5 text-center">
        <span className="text-xs text-muted">{game.team1IsHome ? 'Casa' : 'Fora'}</span>
      </td>

      {showQuarters && (
        <>
          {(['q1', 'q2', 'q3', 'q4'] as const).map(q => (
            <td key={q} className="px-2 py-2.5 text-center hidden md:table-cell">
              {game.team1Quarters && game.team2Quarters ? (
                <span className="text-xs font-mono text-slate-400">
                  {game.team1Quarters[q]}–{game.team2Quarters[q]}
                </span>
              ) : <span className="text-muted">—</span>}
            </td>
          ))}
        </>
      )}

      <td className={cn('px-3 py-2.5 text-center font-bold font-mono', t1Won ? 'text-win' : 'text-slate-400')}>
        {game.team1Score}
      </td>
      <td className="px-1 py-2.5 text-center text-border-light font-mono">–</td>
      <td className={cn('px-3 py-2.5 text-center font-bold font-mono', !t1Won ? 'text-win' : 'text-slate-400')}>
        {game.team2Score}
      </td>

      <td className="px-4 py-2.5 text-center font-mono text-slate-400 text-xs">{game.total}</td>
      <td className="px-4 py-2.5 text-center">
        <span className="text-xs font-mono text-muted">+{game.margin}</span>
      </td>
      <td className="px-4 py-2.5 text-right">
        <Badge variant={t1Won ? 'win' : 'loss'}>
          {t1Won ? t1Abbr : t2Abbr}
        </Badge>
      </td>
    </tr>
  );
}
