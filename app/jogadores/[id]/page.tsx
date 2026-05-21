import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchPlayer, fetchPlayerCareer, fetchPlayerGameLog } from '@/lib/api';
import TeamLogo from '@/components/ui/TeamLogo';
import PlayerAvatar from '@/components/players/PlayerAvatar';
import CareerChart from '@/components/players/CareerChart';
import GameLogTable from '@/components/players/GameLogTable';
import { currentSeason, fmtStat, fmtPct, heightToCm, weightToKg } from '@/lib/utils';
import { ArrowLeft, MapPin, School, Trophy, Shirt } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const player = await fetchPlayer(Number(id)).catch(() => null);
  return { title: player ? `${player.fullName} · Perfil` : 'Jogador' };
}

export default async function PlayerPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { season = currentSeason() } = await searchParams;

  const playerId = Number(id);
  if (!playerId) notFound();

  const [playerRes, careerRes, gamelogRes] = await Promise.allSettled([
    fetchPlayer(playerId),
    fetchPlayerCareer(playerId),
    fetchPlayerGameLog(playerId, season),
  ]);

  if (playerRes.status === 'rejected') notFound();

  const player = playerRes.value;
  const career = careerRes.status === 'fulfilled' ? careerRes.value.seasons : [];
  const gamelog = gamelogRes.status === 'fulfilled' ? gamelogRes.value.games : [];

  const lastSeason = career[career.length - 1];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

      {/* Back */}
      {player.teamId > 0 && (
        <Link href={`/times/${player.teamId}`} className="btn-ghost inline-flex items-center gap-1.5 text-sm -ml-2">
          <ArrowLeft size={14} /> Voltar ao time
        </Link>
      )}

      {/* Hero */}
      <div className="card overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Photo */}
          <div className="bg-gradient-to-b from-bg-surface to-bg-card flex items-end justify-center pt-4 sm:w-56 shrink-0">
            <PlayerAvatar playerId={player.id} name={player.fullName} size={220} className="rounded-t-xl" />
          </div>

          {/* Info */}
          <div className="flex-1 p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-muted text-sm font-medium uppercase tracking-wider">{player.position}</p>
                <h1 className="text-2xl font-bold text-slate-100">{player.fullName}</h1>
              </div>
              {player.teamId > 0 && (
                <Link href={`/times/${player.teamId}`} className="flex items-center gap-2 card px-3 py-2 hover:bg-bg-hover transition-colors">
                  <TeamLogo teamId={player.teamId} name={player.teamName} size={28} />
                  <div>
                    <p className="text-slate-200 text-xs font-semibold">{player.teamAbbreviation}</p>
                    <p className="text-muted text-xs">{player.jerseyNumber ? `#${player.jerseyNumber}` : ''}</p>
                  </div>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <InfoItem label="Altura" value={heightToCm(player.height)} />
              <InfoItem label="Peso" value={weightToKg(player.weight)} />
              <InfoItem label="Idade" value={player.birthdate ? calcAge(player.birthdate) : '—'} />
              <InfoItem label="Experiência" value={player.experience === '0' ? 'Calouro' : player.experience ? `${player.experience} anos` : '—'} />
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-muted">
              {player.country && (
                <span className="flex items-center gap-1.5"><MapPin size={12} />{player.country}</span>
              )}
              {player.school && (
                <span className="flex items-center gap-1.5"><School size={12} />{player.school}</span>
              )}
              {player.draftYear && (
                <span className="flex items-center gap-1.5">
                  <Trophy size={12} />
                  Draft {player.draftYear} · R{player.draftRound} · #{player.draftNumber}
                </span>
              )}
              {player.jerseyNumber && (
                <span className="flex items-center gap-1.5"><Shirt size={12} />#{player.jerseyNumber}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Last season stats highlight */}
      {lastSeason && (
        <div className="card p-5 space-y-3">
          <p className="text-xs text-muted font-medium uppercase tracking-wider">
            Média por jogo · {lastSeason.season} · {lastSeason.teamAbbreviation}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            <BigStat label="PTS" value={fmtStat(lastSeason.points)} />
            <BigStat label="REB" value={fmtStat(lastSeason.rebounds)} />
            <BigStat label="AST" value={fmtStat(lastSeason.assists)} />
            <BigStat label="STL" value={fmtStat(lastSeason.steals)} />
            <BigStat label="BLK" value={fmtStat(lastSeason.blocks)} />
            <BigStat label="FG%" value={fmtPct(lastSeason.fieldGoalPct)} />
          </div>
        </div>
      )}

      {/* Career chart */}
      {career.length > 0 && (
        <div className="card p-5 space-y-3">
          <div className="card-header -mx-5 -mt-5 mb-0">
            <p className="text-sm font-semibold text-slate-200">Carreira ({career.length} temporadas)</p>
          </div>
          <CareerChart seasons={career} />
        </div>
      )}

      {/* Game log */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <p className="text-sm font-semibold text-slate-200">Últimas partidas · {season}</p>
        </div>
        {gamelog.length > 0
          ? <div className="p-4"><GameLogTable games={gamelog} /></div>
          : <div className="px-6 py-8 text-center"><p className="text-muted text-sm">Sem dados para esta temporada.</p></div>
        }
      </div>
    </div>
  );
}

function calcAge(birthdate: string): string {
  try {
    const bd = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - bd.getFullYear();
    const m = today.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
    return `${age} anos`;
  } catch {
    return '—';
  }
}

function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-muted text-xs font-medium uppercase tracking-wider">{label}</p>
      <p className="text-slate-200 font-semibold text-sm mt-0.5">{value}</p>
    </div>
  );
}

function BigStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-nba-orange font-bold text-2xl">{value}</p>
      <p className="text-muted text-xs font-medium mt-0.5">{label}</p>
    </div>
  );
}
