'use client';
import Link from 'next/link';
import { ScheduleGameDTO } from '@/types/api';
import TeamLogo from '@/components/ui/TeamLogo';
import { Activity } from 'lucide-react';

function localTime(utc: string): string {
  if (!utc) return '';
  try {
    return new Date(utc).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    });
  } catch {
    return '';
  }
}

function today() { return new Date().toISOString().slice(0, 10); }
function fiveYearsAgo() {
  const d = new Date(); d.setFullYear(d.getFullYear() - 5);
  return d.toISOString().slice(0, 10);
}

interface Props { game: ScheduleGameDTO }

export default function GameCard({ game }: Props) {
  const { homeTeam: h, awayTeam: a } = game;
  const isLive      = game.gameStatus === 2;
  const isFinal     = game.gameStatus === 3;
  const isScheduled = game.gameStatus === 1;

  const brtTime    = localTime(game.gameTimeUtc);
  const isTBD      = !h.id || !a.id;
  const canH2H     = !isTBD && h.id && a.id;
  const isClickable = !isTBD && !game.gameId.startsWith('placeholder_');

  const statusContent = (
    <div className="w-20 shrink-0 flex flex-col items-center justify-center px-2 py-3 border-r border-border/40 text-center gap-0.5">
      {isLive && (
        <>
          <span className="flex items-center gap-1 text-win text-[11px] font-bold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-win" />
            AO VIVO
          </span>
          <span className="text-slate-500 text-[10px]">{game.gameStatusText}</span>
        </>
      )}
      {isFinal && (
        <span className="text-muted text-xs font-medium">Final</span>
      )}
      {isScheduled && (
        <>
          <span className="text-slate-200 text-sm font-semibold">{brtTime || '—'}</span>
          {brtTime && <span className="text-muted text-[10px]">BRT</span>}
        </>
      )}
    </div>
  );

  const teamsContent = (
    <div className="flex-1 py-2 px-3 space-y-1.5">
      {isTBD ? (
        <>
          <TBDRow label="Time A" />
          <TBDRow label="Time B" />
        </>
      ) : (
        <>
          <TeamRow
            team={a}
            score={isFinal || isLive ? a.score : null}
            isWinner={isFinal && a.score !== null && h.score !== null && a.score > h.score}
            isLive={isLive}
          />
          <TeamRow
            team={h}
            score={isFinal || isLive ? h.score : null}
            isWinner={isFinal && h.score !== null && a.score !== null && h.score > a.score}
            isLive={isLive}
          />
        </>
      )}
    </div>
  );

  return (
    <div className="flex items-stretch border-b border-border/60 group">

      {isClickable ? (
        <Link
          href={`/jogos/${game.gameId}`}
          className="flex flex-1 items-stretch hover:bg-bg-hover transition-colors"
        >
          {statusContent}
          {teamsContent}
        </Link>
      ) : (
        <div className="flex flex-1 items-stretch">
          {statusContent}
          {teamsContent}
        </div>
      )}

      {/* H2H */}
      <div className="shrink-0 flex items-center px-3 border-l border-border/40">
        {canH2H ? (
          <Link
            href={`/h2h?team1Id=${h.id}&team2Id=${a.id}&startDate=${fiveYearsAgo()}&endDate=${today()}`}
            className="flex items-center gap-1 text-muted hover:text-nba-orange transition-colors text-xs font-medium"
            title="Ver H2H"
          >
            <Activity size={13} />
            <span className="hidden sm:inline">H2H</span>
          </Link>
        ) : (
          <span className="w-[42px]" />
        )}
      </div>
    </div>
  );
}

function TeamRow({
  team,
  score,
  isWinner,
  isLive,
}: {
  team: ScheduleGameDTO['homeTeam'];
  score: number | null;
  isWinner: boolean;
  isLive: boolean;
}) {
  const abbr = team.abbreviation ?? '???';
  const city = team.city ?? '';
  const name = team.name ?? '';
  const label = city && name ? `${city} ${name}` : abbr;

  return (
    <div className="flex items-center gap-2.5">
      {team.id > 0 ? (
        <TeamLogo teamId={team.id} name={label} size={20} className="shrink-0" />
      ) : (
        <span className="w-5 h-5 rounded-full bg-bg-surface shrink-0" />
      )}
      <span className={`flex-1 text-sm font-medium truncate ${isWinner ? 'text-slate-100' : 'text-slate-400'}`}>
        {label}
      </span>
      <span className="text-muted text-xs shrink-0 font-mono">{team.wins}-{team.losses}</span>
      {score !== null && (
        <span className={`w-8 text-right text-sm font-bold shrink-0 ${
          isWinner ? 'text-slate-100' : isLive ? 'text-slate-300' : 'text-slate-500'
        }`}>
          {score}
        </span>
      )}
    </div>
  );
}

function TBDRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-5 h-5 rounded-full bg-bg-surface border border-border shrink-0" />
      <span className="text-slate-600 text-sm italic">{label} — A definir</span>
    </div>
  );
}
