import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchGameDetail } from '@/lib/api';
import TeamLogo from '@/components/ui/TeamLogo';
import PlayerAvatar from '@/components/players/PlayerAvatar';
import { ArrowLeft, Users, Clock } from 'lucide-react';
import { GameDetailTeamDTO, GameDetailPlayerDTO } from '@/types/api';
import { formatDate, fmtPct } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const g = await fetchGameDetail(id);
    return { title: `${g.awayTeam.abbreviation} vs ${g.homeTeam.abbreviation} · Jogo` };
  } catch {
    return { title: 'Detalhes do Jogo' };
  }
}

export default async function GameDetailPage({ params }: Props) {
  const { id } = await params;

  let game;
  try {
    game = await fetchGameDetail(id);
  } catch {
    notFound();
  }

  const { homeTeam: h, awayTeam: a } = game;
  const isLive      = game.gameStatus === 2;
  const isFinal     = game.gameStatus === 3;
  const isScheduled = game.gameStatus === 1;

  const aWins = isFinal && a.score !== null && h.score !== null && a.score > h.score;
  const hWins = isFinal && h.score !== null && a.score !== null && h.score > a.score;

  const hasOT1 = (a.ot1 ?? 0) > 0 || (h.ot1 ?? 0) > 0;
  const hasOT2 = (a.ot2 ?? 0) > 0 || (h.ot2 ?? 0) > 0;
  const hasOT3 = (a.ot3 ?? 0) > 0 || (h.ot3 ?? 0) > 0;
  const hasOT4 = (a.ot4 ?? 0) > 0 || (h.ot4 ?? 0) > 0;

  const statusLabel = isLive
    ? game.gameStatusText
    : isFinal
    ? 'ENCERRADO'
    : formatDate(game.gameDate);

  const hasBoxScore = (isFinal || isLive) && (game.homePlayers.length > 0 || game.awayPlayers.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

      {/* Back */}
      <Link href="/" className="btn-ghost inline-flex items-center gap-1.5 text-sm -ml-2">
        <ArrowLeft size={14} /> Voltar aos jogos
      </Link>

      {/* Hero */}
      <div className="card p-6">
        <div className="flex items-center justify-between gap-4">

          {/* Away team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <TeamLogo teamId={a.id} name={`${a.city} ${a.name}`} size={72} />
            <p className="text-slate-400 text-xs text-center font-medium leading-tight">
              {a.city}<br /><span className="text-slate-200 font-semibold">{a.name}</span>
            </p>
            <p className="text-muted text-xs">{a.wins}-{a.losses}</p>
          </div>

          {/* Score / status */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            {(isFinal || isLive) ? (
              <div className="flex items-center gap-4">
                <span className={`text-5xl font-black tabular-nums ${aWins ? 'text-slate-100' : 'text-slate-500'}`}>
                  {a.score ?? '—'}
                </span>
                <span className="text-slate-600 text-2xl font-light">:</span>
                <span className={`text-5xl font-black tabular-nums ${hWins ? 'text-slate-100' : 'text-slate-500'}`}>
                  {h.score ?? '—'}
                </span>
              </div>
            ) : (
              <span className="text-slate-500 text-lg font-semibold">vs</span>
            )}
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              isLive
                ? 'bg-win/20 text-win animate-pulse'
                : isFinal
                ? 'bg-bg-surface text-muted'
                : 'bg-bg-surface text-slate-400'
            }`}>
              {statusLabel}
            </span>
          </div>

          {/* Home team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <TeamLogo teamId={h.id} name={`${h.city} ${h.name}`} size={72} />
            <p className="text-slate-400 text-xs text-center font-medium leading-tight">
              {h.city}<br /><span className="text-slate-200 font-semibold">{h.name}</span>
            </p>
            <p className="text-muted text-xs">{h.wins}-{h.losses}</p>
          </div>
        </div>

        {/* Meta info */}
        {(game.attendance || game.gameDuration) && (
          <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-center gap-6 text-xs text-muted">
            {game.attendance && (
              <span className="flex items-center gap-1.5">
                <Users size={11} /> {game.attendance.toLocaleString('pt-BR')} presentes
              </span>
            )}
            {game.gameDuration && (
              <span className="flex items-center gap-1.5">
                <Clock size={11} /> {game.gameDuration}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quarter breakdown */}
      {(isFinal || isLive) && (
        <div className="card overflow-hidden">
          <div className="card-header">
            <p className="text-sm font-semibold text-slate-200">Placar por período</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2.5 text-left text-xs text-muted font-medium uppercase tracking-wider w-28">Time</th>
                  <PeriodTh>Q1</PeriodTh>
                  <PeriodTh>Q2</PeriodTh>
                  <PeriodTh>Q3</PeriodTh>
                  <PeriodTh>Q4</PeriodTh>
                  {hasOT1 && <PeriodTh>OT1</PeriodTh>}
                  {hasOT2 && <PeriodTh>OT2</PeriodTh>}
                  {hasOT3 && <PeriodTh>OT3</PeriodTh>}
                  {hasOT4 && <PeriodTh>OT4</PeriodTh>}
                  <th className="px-4 py-2.5 text-center text-xs text-muted font-medium uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody>
                <QuarterRow team={a} isWinner={aWins} hasOT1={hasOT1} hasOT2={hasOT2} hasOT3={hasOT3} hasOT4={hasOT4} />
                <QuarterRow team={h} isWinner={hWins} hasOT1={hasOT1} hasOT2={hasOT2} hasOT3={hasOT3} hasOT4={hasOT4} last />
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Player box scores */}
      {hasBoxScore && (
        <>
          <PlayerBoxScore
            teamId={a.id}
            abbreviation={a.abbreviation}
            teamName={`${a.city} ${a.name}`}
            players={game.awayPlayers}
          />
          <PlayerBoxScore
            teamId={h.id}
            abbreviation={h.abbreviation}
            teamName={`${h.city} ${h.name}`}
            players={game.homePlayers}
          />
        </>
      )}

      {/* H2H link */}
      {a.id > 0 && h.id > 0 && (
        <div className="text-center">
          <Link
            href={`/h2h?team1Id=${h.id}&team2Id=${a.id}&startDate=${fiveYearsAgo()}&endDate=${todayStr()}`}
            className="btn-ghost inline-flex items-center gap-2 text-sm"
          >
            Ver histórico H2H completo entre {a.abbreviation} e {h.abbreviation}
          </Link>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function PeriodTh({ children }: { children: ReactNode }) {
  return (
    <th className="px-3 py-2.5 text-center text-xs text-muted font-medium uppercase tracking-wider">
      {children}
    </th>
  );
}

function QuarterRow({
  team, isWinner, hasOT1, hasOT2, hasOT3, hasOT4, last,
}: {
  team: GameDetailTeamDTO;
  isWinner: boolean;
  hasOT1: boolean; hasOT2: boolean; hasOT3: boolean; hasOT4: boolean;
  last?: boolean;
}) {
  const cellQ = 'px-3 py-3 text-center font-mono text-sm text-slate-300';
  return (
    <tr className={last ? '' : 'border-b border-border/50'}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <TeamLogo teamId={team.id} name={team.abbreviation} size={20} />
          <span className={`font-semibold text-sm ${isWinner ? 'text-slate-100' : 'text-slate-400'}`}>
            {team.abbreviation}
          </span>
        </div>
      </td>
      <td className={cellQ}>{team.q1 ?? '—'}</td>
      <td className={cellQ}>{team.q2 ?? '—'}</td>
      <td className={cellQ}>{team.q3 ?? '—'}</td>
      <td className={cellQ}>{team.q4 ?? '—'}</td>
      {hasOT1 && <td className={cellQ}>{team.ot1 ?? '—'}</td>}
      {hasOT2 && <td className={cellQ}>{team.ot2 ?? '—'}</td>}
      {hasOT3 && <td className={cellQ}>{team.ot3 ?? '—'}</td>}
      {hasOT4 && <td className={cellQ}>{team.ot4 ?? '—'}</td>}
      <td className={`px-4 py-3 text-center font-bold tabular-nums text-sm ${isWinner ? 'text-nba-orange' : 'text-slate-400'}`}>
        {team.score ?? '—'}
      </td>
    </tr>
  );
}

function PlayerBoxScore({
  teamId, abbreviation, teamName, players,
}: {
  teamId: number;
  abbreviation: string;
  teamName: string;
  players: GameDetailPlayerDTO[];
}) {
  if (players.length === 0) return null;

  const starters  = players.filter((p) => p.startPosition !== '');
  const bench     = players.filter((p) => p.startPosition === '');

  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <TeamLogo teamId={teamId} name={teamName} size={18} />
        <span className="text-sm font-semibold text-slate-200">{teamName}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 py-2.5 text-left text-muted font-medium uppercase tracking-wider min-w-[160px]">Jogador</th>
              <th className="px-2 py-2.5 text-center text-muted font-medium uppercase tracking-wider w-10">MIN</th>
              <th className="px-2 py-2.5 text-center text-muted font-medium uppercase tracking-wider w-9">PTS</th>
              <th className="px-2 py-2.5 text-center text-muted font-medium uppercase tracking-wider w-9">REB</th>
              <th className="px-2 py-2.5 text-center text-muted font-medium uppercase tracking-wider w-9">AST</th>
              <th className="px-2 py-2.5 text-center text-muted font-medium uppercase tracking-wider w-9">STL</th>
              <th className="px-2 py-2.5 text-center text-muted font-medium uppercase tracking-wider w-9">BLK</th>
              <th className="px-2 py-2.5 text-center text-muted font-medium uppercase tracking-wider w-9">TO</th>
              <th className="px-2 py-2.5 text-center text-muted font-medium uppercase tracking-wider w-14">FG</th>
              <th className="px-2 py-2.5 text-center text-muted font-medium uppercase tracking-wider w-14">3P</th>
              <th className="px-2 py-2.5 text-center text-muted font-medium uppercase tracking-wider w-14">FT</th>
              <th className="px-2 py-2.5 text-center text-muted font-medium uppercase tracking-wider w-10">+/-</th>
            </tr>
          </thead>
          <tbody>
            {starters.length > 0 && (
              <tr>
                <td colSpan={12} className="px-3 py-1.5 text-[10px] font-semibold text-muted uppercase tracking-wider bg-bg-surface/50">
                  Titulares
                </td>
              </tr>
            )}
            {starters.map((p) => <PlayerRow key={p.playerId} player={p} />)}
            {bench.length > 0 && (
              <tr>
                <td colSpan={12} className="px-3 py-1.5 text-[10px] font-semibold text-muted uppercase tracking-wider bg-bg-surface/50">
                  Banco
                </td>
              </tr>
            )}
            {bench.map((p) => <PlayerRow key={p.playerId} player={p} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlayerRow({ player: p }: { player: GameDetailPlayerDTO }) {
  const pmColor = p.plusMinus > 0 ? 'text-win' : p.plusMinus < 0 ? 'text-loss' : 'text-muted';
  const pmLabel = p.plusMinus > 0 ? `+${p.plusMinus}` : String(p.plusMinus);
  const fgPct   = p.fgAttempted > 0 ? fmtPct(p.fgMade / p.fgAttempted) : null;

  return (
    <tr className="border-b border-border/40 hover:bg-bg-hover/30 transition-colors">
      <td className="px-3 py-2.5">
        <Link href={`/jogadores/${p.playerId}`} className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-bg-surface shrink-0">
            <PlayerAvatar playerId={p.playerId} name={p.playerName} size={28} />
          </div>
          <div className="min-w-0">
            <span className="text-slate-200 font-medium group-hover:text-nba-orange transition-colors truncate block">
              {p.playerName}
            </span>
            {p.startPosition && (
              <span className="text-muted text-[10px] font-mono">{p.startPosition}</span>
            )}
          </div>
        </Link>
      </td>
      <td className="px-2 py-2.5 text-center text-muted font-mono">{p.minutes || '—'}</td>
      <td className="px-2 py-2.5 text-center font-bold text-slate-200">{p.points}</td>
      <td className="px-2 py-2.5 text-center text-slate-300">{p.rebounds}</td>
      <td className="px-2 py-2.5 text-center text-slate-300">{p.assists}</td>
      <td className="px-2 py-2.5 text-center text-slate-400">{p.steals}</td>
      <td className="px-2 py-2.5 text-center text-slate-400">{p.blocks}</td>
      <td className="px-2 py-2.5 text-center text-slate-400">{p.turnovers}</td>
      <td className="px-2 py-2.5 text-center font-mono text-slate-400">
        {p.fgMade}-{p.fgAttempted}
        {fgPct && <span className="block text-[10px] text-muted">{fgPct}</span>}
      </td>
      <td className="px-2 py-2.5 text-center font-mono text-slate-400">{p.fg3Made}-{p.fg3Attempted}</td>
      <td className="px-2 py-2.5 text-center font-mono text-slate-400">{p.ftMade}-{p.ftAttempted}</td>
      <td className={`px-2 py-2.5 text-center font-bold font-mono ${pmColor}`}>{pmLabel}</td>
    </tr>
  );
}

function todayStr() { return new Date().toISOString().slice(0, 10); }
function fiveYearsAgo() {
  const d = new Date(); d.setFullYear(d.getFullYear() - 5);
  return d.toISOString().slice(0, 10);
}
