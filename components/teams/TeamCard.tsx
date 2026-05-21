import Link from 'next/link';
import { TeamDTO } from '@/types/api';
import TeamLogo from '@/components/ui/TeamLogo';
import Badge from '@/components/ui/Badge';

interface Props { team: TeamDTO }

export default function TeamCard({ team }: Props) {
  return (
    <Link
      href={`/times/${team.id}`}
      className="card flex items-center gap-4 px-4 py-3 hover:bg-bg-hover transition-colors duration-150 group"
    >
      <TeamLogo teamId={team.id} name={team.name} size={44} className="shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-slate-200 font-semibold text-sm truncate group-hover:text-nba-orange transition-colors">
          {team.fullName}
        </p>
        <p className="text-muted text-xs">{team.division}</p>
      </div>
      <Badge variant={team.conference === 'East' ? 'blue' : 'orange'} className="shrink-0">
        {team.conference}
      </Badge>
    </Link>
  );
}
