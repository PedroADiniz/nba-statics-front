'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { H2HAnalysisDTO, PlayerSeasonStatsDTO } from '@/types/api';
import { fetchTeamSeasonStats } from '@/lib/api';
import { fmtStat, fmtPct, currentSeason } from '@/lib/utils';
import PlayerAvatar from '@/components/players/PlayerAvatar';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';

type StatKey = 'points' | 'rebounds' | 'assists' | 'steals' | 'blocks';
const STAT_LABELS: Record<StatKey, string> = {
  points: 'PTS', rebounds: 'REB', assists: 'AST', steals: 'ROUBs', blocks: 'BLKs',
};

interface Props {
  data: H2HAnalysisDTO;
}

export default function PlayersWidget({ data }: Props) {
  const [team1Players, setTeam1Players] = useState<PlayerSeasonStatsDTO[]>([]);
  const [team2Players, setTeam2Players] = useState<PlayerSeasonStatsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<StatKey>('points');
  const [expanded, setExpanded] = useState(false);
  const season = currentSeason();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchTeamSeasonStats(data.meta.team1.id, season).catch(() => ({ players: [] as PlayerSeasonStatsDTO[] })),
      fetchTeamSeasonStats(data.meta.team2.id, season).catch(() => ({ players: [] as PlayerSeasonStatsDTO[] })),
    ]).then(([r1, r2]) => {
      if (!cancelled) {
        setTeam1Players(r1.players);
        setTeam2Players(r2.players);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [data.meta.team1.id, data.meta.team2.id, season]);

  const SHOW = expanded ? 99 : 5;

  const sorted1 = [...team1Players].sort((a, b) => b[sortBy] - a[sortBy]).slice(0, SHOW);
  const sorted2 = [...team2Players].sort((a, b) => b[sortBy] - a[sortBy]).slice(0, SHOW);

  return (
    <div className="card overflow-hidden">
      <div className="card-header justify-between">
        <div className="flex items-center gap-2">
          <Users size={15} className="text-nba-orange" />
          <span className="text-sm font-semibold text-slate-200">Jogadores · {season}</span>
        </div>
        <div className="flex items-center gap-1">
          {(Object.keys(STAT_LABELS) as StatKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setSortBy(k)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                sortBy === k ? 'bg-nba-orange text-white' : 'text-muted hover:text-slate-200'
              }`}
            >
              {STAT_LABELS[k]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="px-6 py-8 text-center">
          <p className="text-muted text-sm animate-pulse">Carregando estatísticas...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
            <TeamColumn
              team={data.meta.team1}
              players={sorted1}
              sortBy={sortBy}
              otherPlayers={sorted2}
            />
            <TeamColumn
              team={data.meta.team2}
              players={sorted2}
              sortBy={sortBy}
              otherPlayers={sorted1}
            />
          </div>

          {(team1Players.length > 5 || team2Players.length > 5) && (
            <div className="border-t border-border">
              <button
                onClick={() => setExpanded(v => !v)}
                className="btn-ghost w-full flex items-center justify-center gap-1.5 text-xs py-2"
              >
                {expanded
                  ? <><ChevronUp size={13} /> Mostrar menos</>
                  : <><ChevronDown size={13} /> Ver todos os jogadores</>
                }
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TeamColumn({
  team,
  players,
  sortBy,
  otherPlayers,
}: {
  team: H2HAnalysisDTO['meta']['team1'];
  players: PlayerSeasonStatsDTO[];
  sortBy: StatKey;
  otherPlayers: PlayerSeasonStatsDTO[];
}) {
  const maxVal = Math.max(...players.map(p => p[sortBy]), 0);
  const otherMax = Math.max(...otherPlayers.map(p => p[sortBy]), 0);

  return (
    <div className="p-4 space-y-2">
      <p className="text-xs text-muted font-semibold uppercase tracking-wider px-1">
        {team.abbreviation}
      </p>
      {players.length === 0 ? (
        <p className="text-muted text-xs px-1">Sem dados disponíveis.</p>
      ) : (
        players.map((p) => {
          const val = p[sortBy];
          const barPct = maxVal > 0 ? (val / Math.max(maxVal, otherMax)) * 100 : 0;
          const isLeader = val === maxVal && val > 0;
          return (
            <Link
              key={p.playerId}
              href={`/jogadores/${p.playerId}`}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-bg-hover transition-colors group"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-bg-surface shrink-0">
                <PlayerAvatar playerId={p.playerId} name={p.playerName} size={32} />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-200 text-xs font-medium truncate group-hover:text-nba-orange transition-colors">
                    {p.playerName}
                  </span>
                  <span className={`text-xs font-bold shrink-0 ${isLeader ? 'text-nba-orange' : 'text-slate-300'}`}>
                    {sortBy === 'points' || sortBy === 'rebounds' || sortBy === 'assists'
                      ? fmtStat(val)
                      : fmtStat(val, 2)}
                  </span>
                </div>
                <div className="h-1 rounded-full bg-bg-surface overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isLeader ? 'bg-nba-orange' : 'bg-slate-600'}`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}
