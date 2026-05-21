import { H2HAnalysisDTO } from '@/types/api';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Trophy, Zap, Shield } from 'lucide-react';

interface Props { data: H2HAnalysisDTO }

export default function ScoringWidget({ data }: Props) {
  const { scoring, meta } = data;
  const { team1, team2 } = meta;

  return (
    <div className="space-y-4">
      {/* Médias */}
      <div className="card">
        <div className="card-header">
          <Zap size={14} className="text-nba-orange" />
          <span className="text-sm font-semibold text-slate-200">Médias por jogo</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 px-5 py-4">
          <StatCard label={team1.abbreviation} value={scoring.team1Avg} sub="pts/jogo" />
          <StatCard label={team2.abbreviation} value={scoring.team2Avg} sub="pts/jogo" />
          <StatCard label="Total" value={scoring.totalAvg} sub="pts combinados" accent />
          <StatCard label="Margem" value={scoring.marginAvg} sub="pts diferença" />
        </div>
      </div>

      {/* Insights rápidos */}
      <div className="grid grid-cols-3 gap-3">
        <InsightCard
          icon={<Shield size={14} className="text-blue-400" />}
          label="Jogos disputados"
          value={`${scoring.closeGames}`}
          sub="≤ 5 pts"
          color="blue"
        />
        <InsightCard
          icon={<Trophy size={14} className="text-nba-orange" />}
          label="Blowouts"
          value={`${scoring.blowouts}`}
          sub="≥ 20 pts"
          color="orange"
        />
        <InsightCard
          icon={<Zap size={14} className="text-win" />}
          label="Maior margem"
          value={scoring.biggestWin ? `+${scoring.biggestWin.margin}` : '—'}
          sub={scoring.biggestWin ? formatDate(scoring.biggestWin.date) : ''}
          color="green"
        />
      </div>

      {/* Último jogo */}
      {scoring.lastGame && (
        <div className="card px-5 py-4">
          <p className="text-xs text-muted font-medium uppercase tracking-wider mb-3">Último jogo</p>
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">{formatDate(scoring.lastGame.date)}</div>
            <div className="flex items-center gap-3 font-mono font-bold text-lg">
              <span className={scoring.lastGame.winner === 'team1' ? 'text-win' : 'text-slate-400'}>
                {scoring.lastGame.team1Score}
              </span>
              <span className="text-border-light">—</span>
              <span className={scoring.lastGame.winner === 'team2' ? 'text-win' : 'text-slate-400'}>
                {scoring.lastGame.team2Score}
              </span>
            </div>
            <Badge variant={scoring.lastGame.winner === 'team1' ? 'win' : 'loss'}>
              {scoring.lastGame.winner === 'team1' ? team1.abbreviation : team2.abbreviation} venceu
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}

function InsightCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: 'blue' | 'orange' | 'green';
}) {
  const bg = { blue: 'bg-blue-500/10', orange: 'bg-orange-500/10', green: 'bg-green-500/10' }[color];
  const text = { blue: 'text-blue-400', orange: 'text-nba-orange', green: 'text-win' }[color];
  return (
    <div className={`card px-4 py-3 ${bg}`}>
      <div className="flex items-center gap-1.5 mb-2">{icon}<span className="text-xs text-muted">{label}</span></div>
      <p className={`text-xl font-bold ${text}`}>{value}</p>
      <p className="text-xs text-muted mt-0.5">{sub}</p>
    </div>
  );
}
