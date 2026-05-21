import { PlayerSeasonStatsDTO } from '@/types/api';
import Link from 'next/link';
import { fmtStat, fmtPct } from '@/lib/utils';
import PlayerAvatar from './PlayerAvatar';

interface Props {
  players: PlayerSeasonStatsDTO[];
}

export default function SeasonStatsTable({ players }: Props) {
  const sorted = [...players].sort((a, b) => b.points - a.points);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {['Jogador', 'JO', 'MIN', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'FG%', '3P%', 'FT%', '+/-'].map((h) => (
              <th key={h} className="px-3 py-3 text-left text-xs text-muted font-medium uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.playerId} className="table-row-hover border-b border-border/50">
              <td className="px-3 py-2.5">
                <Link href={`/jogadores/${p.playerId}`} className="flex items-center gap-2.5 group">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-bg-surface shrink-0">
                    <PlayerAvatar playerId={p.playerId} name={p.playerName} size={28} />
                  </div>
                  <span className="text-slate-200 font-medium text-sm group-hover:text-nba-orange transition-colors whitespace-nowrap">
                    {p.playerName}
                  </span>
                </Link>
              </td>
              <td className="px-3 py-2.5 text-muted text-xs">{p.gamesPlayed}</td>
              <td className="px-3 py-2.5 text-muted text-xs">{fmtStat(p.minutes)}</td>
              <td className="px-3 py-2.5 text-slate-200 font-bold">{fmtStat(p.points)}</td>
              <td className="px-3 py-2.5 text-slate-300">{fmtStat(p.rebounds)}</td>
              <td className="px-3 py-2.5 text-slate-300">{fmtStat(p.assists)}</td>
              <td className="px-3 py-2.5 text-muted text-xs">{fmtStat(p.steals)}</td>
              <td className="px-3 py-2.5 text-muted text-xs">{fmtStat(p.blocks)}</td>
              <td className="px-3 py-2.5 text-muted text-xs">{fmtStat(p.turnovers)}</td>
              <td className="px-3 py-2.5 text-muted text-xs font-mono">{fmtPct(p.fieldGoalPct)}</td>
              <td className="px-3 py-2.5 text-muted text-xs font-mono">{fmtPct(p.threePointPct)}</td>
              <td className="px-3 py-2.5 text-muted text-xs font-mono">{fmtPct(p.freeThrowPct)}</td>
              <td className={`px-3 py-2.5 text-xs font-mono font-semibold ${p.plusMinus > 0 ? 'text-win' : p.plusMinus < 0 ? 'text-loss' : 'text-muted'}`}>
                {p.plusMinus > 0 ? `+${p.plusMinus.toFixed(1)}` : p.plusMinus.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
