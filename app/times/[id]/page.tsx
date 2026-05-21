import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchTeam, fetchRoster, fetchTeamSeasonStats } from '@/lib/api';
import TeamLogo from '@/components/ui/TeamLogo';
import Badge from '@/components/ui/Badge';
import RosterTable from '@/components/players/RosterTable';
import SeasonStatsTable from '@/components/players/SeasonStatsTable';
import SeasonSelector from '@/components/teams/SeasonSelector';
import { currentSeason } from '@/lib/utils';
import { Users, BarChart2, ArrowLeft, Activity } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; season?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const team = await fetchTeam(Number(id)).catch(() => null);
  return { title: team ? `${team.fullName} · Elenco` : 'Time' };
}

export default async function TeamDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { tab = 'roster', season = currentSeason() } = await searchParams;

  const teamId = Number(id);
  if (!teamId) notFound();

  const [team, roster, stats] = await Promise.allSettled([
    fetchTeam(teamId),
    fetchRoster(teamId, season),
    fetchTeamSeasonStats(teamId, season),
  ]);

  if (team.status === 'rejected') notFound();

  const teamData = team.value;
  const rosterData = roster.status === 'fulfilled' ? roster.value.players : [];
  const statsData = stats.status === 'fulfilled' ? stats.value.players : [];

  const isEast = teamData.conference === 'East';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">

      {/* Back */}
      <Link href="/times" className="btn-ghost inline-flex items-center gap-1.5 text-sm -ml-2">
        <ArrowLeft size={14} /> Todos os times
      </Link>

      {/* Hero */}
      <div className="card px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <TeamLogo teamId={teamData.id} name={teamData.name} size={72} className="shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100">{teamData.fullName}</h1>
            <Badge variant={isEast ? 'blue' : 'orange'}>{teamData.conference}</Badge>
          </div>
          <p className="text-muted text-sm">{teamData.division}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href={`/h2h?team1Id=${teamData.id}`}
              className="btn-primary flex items-center gap-1.5 text-sm py-1.5 px-4"
            >
              <Activity size={13} /> Analisar H2H
            </Link>
          </div>
        </div>
      </div>

      {/* Season selector */}
      <SeasonSelector current={season} teamId={String(teamId)} tab={tab} />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        <TabLink href={`/times/${teamId}?tab=roster&season=${season}`} active={tab === 'roster'} icon={<Users size={14} />} label={`Elenco (${rosterData.length})`} />
        <TabLink href={`/times/${teamId}?tab=stats&season=${season}`} active={tab === 'stats'} icon={<BarChart2 size={14} />} label="Estatísticas" />
      </div>

      {/* Content */}
      <div className="card overflow-hidden">
        {tab === 'roster' ? (
          rosterData.length > 0
            ? <RosterTable players={rosterData} />
            : <EmptyState message="Elenco não disponível para esta temporada." />
        ) : (
          statsData.length > 0
            ? <SeasonStatsTable players={statsData} />
            : <EmptyState message="Estatísticas não disponíveis para esta temporada." />
        )}
      </div>
    </div>
  );
}

function TabLink({ href, active, icon, label }: { href: string; active: boolean; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
        active
          ? 'border-nba-orange text-nba-orange'
          : 'border-transparent text-muted hover:text-slate-200'
      }`}
    >
      {icon}{label}
    </Link>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="text-muted text-sm">{message}</p>
    </div>
  );
}
