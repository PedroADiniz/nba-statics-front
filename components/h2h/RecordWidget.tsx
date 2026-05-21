import { H2HAnalysisDTO } from '@/types/api';
import TeamLogo from '@/components/ui/TeamLogo';
import Badge from '@/components/ui/Badge';

interface Props { data: H2HAnalysisDTO }

export default function RecordWidget({ data }: Props) {
  const { meta, record } = data;
  const { team1, team2, totalGames } = meta;

  const barW1 = record.team1Wins / totalGames;
  const barW2 = record.team2Wins / totalGames;

  return (
    <div className="card overflow-hidden">
      {/* Teams header */}
      <div className="grid grid-cols-3 items-center px-6 py-5">
        <TeamCell team={team1} wins={record.team1Wins} pct={record.team1WinPct} align="left" />
        <div className="text-center">
          <p className="text-muted text-xs font-medium mb-1">{totalGames} jogos</p>
          <p className="text-2xl font-black text-slate-100 tracking-tight">
            {record.team1Wins} – {record.team2Wins}
          </p>
          <p className="text-muted text-xs mt-1">H2H</p>
        </div>
        <TeamCell team={team2} wins={record.team2Wins} pct={record.team2WinPct} align="right" />
      </div>

      {/* Progress bar */}
      <div className="px-6 pb-5">
        <div className="flex h-2 rounded-full overflow-hidden gap-px">
          <div
            className="bg-win rounded-l-full transition-all duration-700"
            style={{ width: `${barW1 * 100}%` }}
          />
          <div
            className="bg-loss rounded-r-full transition-all duration-700"
            style={{ width: `${barW2 * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-win text-xs font-semibold">{record.team1WinPct.toFixed(0)}%</span>
          <span className="text-loss text-xs font-semibold">{record.team2WinPct.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}

function TeamCell({ team, wins, pct, align }: {
  team: H2HAnalysisDTO['meta']['team1'];
  wins: number;
  pct: number;
  align: 'left' | 'right';
}) {
  return (
    <div className={`flex flex-col items-${align === 'left' ? 'start' : 'end'} gap-2`}>
      <TeamLogo teamId={team.id} name={team.name} size={52} />
      <div className={`text-${align}`}>
        <p className="text-slate-100 font-bold text-sm leading-tight">{team.fullName}</p>
        <p className="text-muted text-xs">{team.conference} · {team.division}</p>
      </div>
      <Badge variant={wins > 0 ? 'win' : 'neutral'}>{wins}V · {pct.toFixed(0)}%</Badge>
    </div>
  );
}
