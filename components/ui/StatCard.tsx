import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  className?: string;
}

export default function StatCard({ label, value, sub, accent, className }: Props) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className="text-muted text-xs font-medium uppercase tracking-wider">{label}</span>
      <span className={cn('text-2xl font-bold', accent ? 'text-nba-orange' : 'text-slate-100')}>
        {value}
      </span>
      {sub && <span className="text-muted text-xs">{sub}</span>}
    </div>
  );
}
