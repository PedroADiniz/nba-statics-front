'use client';
import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar, Loader2 } from 'lucide-react';
import { fetchTeams } from '@/lib/api';
import { TeamDTO } from '@/types/api';
import TeamLogo from '@/components/ui/TeamLogo';
import { today, yearsAgo } from '@/lib/utils';

interface Props {
  initialTeam1?: number;
  initialTeam2?: number;
  initialStart?: string;
  initialEnd?: string;
}

export default function H2HForm({ initialTeam1, initialTeam2, initialStart, initialEnd }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [teams, setTeams] = useState<TeamDTO[]>([]);
  const [team1Id, setTeam1Id] = useState<number>(initialTeam1 ?? 0);
  const [team2Id, setTeam2Id] = useState<number>(initialTeam2 ?? 0);
  const [startDate, setStartDate] = useState(initialStart ?? yearsAgo(4));
  const [endDate, setEndDate] = useState(initialEnd ?? today());
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeams().then(setTeams).catch(() => setError('Não foi possível carregar os times.'));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!team1Id || !team2Id) { setError('Selecione os dois times.'); return; }
    if (team1Id === team2Id) { setError('Selecione times diferentes.'); return; }
    setError('');
    startTransition(() => {
      router.push(`/h2h?team1Id=${team1Id}&team2Id=${team2Id}&startDate=${startDate}&endDate=${endDate}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TeamSelect label="Time 1" teams={teams} value={team1Id} exclude={team2Id} onChange={setTeam1Id} />
        <TeamSelect label="Time 2" teams={teams} value={team2Id} exclude={team1Id} onChange={setTeam2Id} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-muted font-medium flex items-center gap-1.5">
            <Calendar size={12} /> Data inicial
          </label>
          <input type="date" className="input" value={startDate}
            onChange={e => setStartDate(e.target.value)} max={endDate} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted font-medium flex items-center gap-1.5">
            <Calendar size={12} /> Data final
          </label>
          <input type="date" className="input" value={endDate}
            onChange={e => setEndDate(e.target.value)} min={startDate} max={today()} />
        </div>
      </div>

      {error && <p className="text-loss text-sm">{error}</p>}

      <button type="submit" disabled={isPending} className="btn-primary w-full flex items-center justify-center gap-2">
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        {isPending ? 'Buscando...' : 'Analisar H2H'}
      </button>
    </form>
  );
}

function TeamSelect({ label, teams, value, exclude, onChange }: {
  label: string;
  teams: TeamDTO[];
  value: number;
  exclude: number;
  onChange: (id: number) => void;
}) {
  const selected = teams.find(t => t.id === value);

  return (
    <div className="space-y-1.5">
      <label className="text-xs text-muted font-medium">{label}</label>
      <div className="relative">
        {selected && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <TeamLogo teamId={selected.id} name={selected.name} size={22} />
          </div>
        )}
        <select
          className={`input appearance-none cursor-pointer ${selected ? 'pl-10' : ''}`}
          value={value || ''}
          onChange={e => onChange(Number(e.target.value))}
        >
          <option value="">Selecione um time...</option>
          {teams.filter(t => t.id !== exclude).map(t => (
            <option key={t.id} value={t.id}>{t.fullName}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
