'use client';
import { useRouter } from 'next/navigation';

interface Props {
  current: string;
  teamId: string;
  tab: string;
}

export default function SeasonSelector({ current, teamId, tab }: Props) {
  const router = useRouter();

  const currentYear = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const latestStartYear = month >= 10 ? currentYear : currentYear - 1;

  const seasons = Array.from({ length: 8 }, (_, i) => {
    const y = latestStartYear - i;
    return `${y}-${String(y + 1).slice(-2)}`;
  });

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-muted font-medium">Temporada</label>
      <select
        value={current}
        onChange={(e) => router.push(`/times/${teamId}?tab=${tab}&season=${e.target.value}`)}
        className="input py-1.5 text-xs w-auto"
      >
        {seasons.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
