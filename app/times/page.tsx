import type { Metadata } from 'next';
import { fetchTeams } from '@/lib/api';
import TeamCard from '@/components/teams/TeamCard';
import { Users } from 'lucide-react';

export const metadata: Metadata = { title: 'Times NBA' };

export default async function TimesPage() {
  let teams = await fetchTeams().catch(() => []);

  const east = teams.filter(t => t.conference === 'East');
  const west = teams.filter(t => t.conference === 'West');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-nba-orange/15 flex items-center justify-center">
          <Users size={18} className="text-nba-orange" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-100">Times da NBA</h1>
          <p className="text-muted text-sm">{teams.length} franquias · clique para ver elenco e estatísticas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ConferenceSection title="Conferência Leste" teams={east} />
        <ConferenceSection title="Conferência Oeste" teams={west} />
      </div>
    </div>
  );
}

function ConferenceSection({ title, teams }: { title: string; teams: Awaited<ReturnType<typeof fetchTeams>> }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{title}</h2>
      <div className="space-y-1.5">
        {teams.map(team => <TeamCard key={team.id} team={team} />)}
      </div>
    </section>
  );
}
