'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PlayerRosterEntryDTO } from '@/types/api';
import PlayerAvatar from './PlayerAvatar';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { heightToCm, weightToKg } from '@/lib/utils';

type SortKey = 'jerseyNumber' | 'fullName' | 'position' | 'age';

interface Props {
  players: PlayerRosterEntryDTO[];
}

export default function RosterTable({ players }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('jerseyNumber');
  const [sortAsc, setSortAsc] = useState(true);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(v => !v);
    else { setSortKey(key); setSortAsc(true); }
  }

  const sorted = [...players].sort((a, b) => {
    let va: string | number = a[sortKey];
    let vb: string | number = b[sortKey];
    if (sortKey === 'jerseyNumber') { va = Number(va) || 0; vb = Number(vb) || 0; }
    if (va < vb) return sortAsc ? -1 : 1;
    if (va > vb) return sortAsc ? 1 : -1;
    return 0;
  });

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronUp size={12} className="text-muted opacity-40" />;
    return sortAsc ? <ChevronUp size={12} className="text-nba-orange" /> : <ChevronDown size={12} className="text-nba-orange" />;
  }

  function Th({ label, k }: { label: string; k: SortKey }) {
    return (
      <th
        className="px-4 py-3 text-left text-xs text-muted font-medium uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors select-none"
        onClick={() => handleSort(k)}
      >
        <span className="flex items-center gap-1">{label}<SortIcon k={k} /></span>
      </th>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <Th label="#" k="jerseyNumber" />
            <Th label="Jogador" k="fullName" />
            <Th label="Pos" k="position" />
            <th className="px-4 py-3 text-left text-xs text-muted font-medium uppercase tracking-wider">Altura</th>
            <th className="px-4 py-3 text-left text-xs text-muted font-medium uppercase tracking-wider">Peso</th>
            <Th label="Idade" k="age" />
            <th className="px-4 py-3 text-left text-xs text-muted font-medium uppercase tracking-wider">Exp.</th>
            <th className="px-4 py-3 text-left text-xs text-muted font-medium uppercase tracking-wider">Faculdade</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.id} className="table-row-hover border-b border-border/50">
              <td className="px-4 py-3 text-muted font-mono text-xs">{p.jerseyNumber}</td>
              <td className="px-4 py-3">
                <Link href={`/jogadores/${p.id}`} className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-bg-surface shrink-0">
                    <PlayerAvatar playerId={p.id} name={p.fullName} size={36} />
                  </div>
                  <span className="text-slate-200 font-medium group-hover:text-nba-orange transition-colors">
                    {p.fullName}
                  </span>
                </Link>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs bg-bg-surface text-muted px-2 py-0.5 rounded font-mono">
                  {p.position || '—'}
                </span>
              </td>
              <td className="px-4 py-3 text-muted text-xs font-mono">{heightToCm(p.height)}</td>
              <td className="px-4 py-3 text-muted text-xs font-mono">{weightToKg(p.weight)}</td>
              <td className="px-4 py-3 text-slate-300 text-xs">{p.age || '—'}</td>
              <td className="px-4 py-3 text-muted text-xs">{p.experience === '0' ? 'Calouro' : p.experience ? `${p.experience} anos` : '—'}</td>
              <td className="px-4 py-3 text-muted text-xs truncate max-w-[140px]">{p.school || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
