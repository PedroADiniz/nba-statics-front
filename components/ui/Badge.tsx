import { cn } from '@/lib/utils';

type Variant = 'win' | 'loss' | 'neutral' | 'orange' | 'blue';

const variants: Record<Variant, string> = {
  win:     'bg-green-500/15 text-win border-green-500/20',
  loss:    'bg-red-500/15 text-loss border-red-500/20',
  neutral: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  orange:  'bg-orange-500/15 text-nba-orange border-orange-500/20',
  blue:    'bg-blue-500/15 text-blue-400 border-blue-500/20',
};

interface Props {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

export default function Badge({ children, variant = 'neutral', className }: Props) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border',
      variants[variant],
      className,
    )}>
      {children}
    </span>
  );
}
