'use client';
import { useMemo, useState } from 'react';
import { ScheduleGameDTO } from '@/types/api';
import GameCard from './GameCard';
import CalendarWidget from './CalendarWidget';
import DateNav from './DateNav';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

type Filter = 'todos' | 'ao_vivo' | 'proximos' | 'encerrados';

const TABS: { id: Filter; label: string }[] = [
  { id: 'todos',      label: 'Todos' },
  { id: 'ao_vivo',    label: 'Ao Vivo' },
  { id: 'proximos',   label: 'Próximos' },
  { id: 'encerrados', label: 'Encerrados' },
];

interface Props {
  date: string;
  games: ScheduleGameDTO[];
  allDates: string[];
}

export default function SchedulePage({ date, games, allDates }: Props) {
  const [filter, setFilter] = useState<Filter>('todos');
  const [showCalendar, setShowCalendar] = useState(false);

  const gameDatesSet = useMemo(() => new Set(allDates), [allDates]);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'ao_vivo':    return games.filter(g => g.gameStatus === 2);
      case 'proximos':   return games.filter(g => g.gameStatus === 1);
      case 'encerrados': return games.filter(g => g.gameStatus === 3);
      default:           return games;
    }
  }, [games, filter]);

  const liveCount = games.filter(g => g.gameStatus === 2).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── LEFT: Calendar (desktop sticky, mobile hidden) ── */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 space-y-3">
            <CalendarWidget
              selectedDate={date}
              gameDates={gameDatesSet}
              onSelect={(d) => { window.location.href = `/?date=${d}`; }}
            />
            <div className="card px-4 py-3 space-y-1">
              <p className="text-xs text-muted font-medium uppercase tracking-wider">Legenda</p>
              <div className="space-y-1.5 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" /> Jogos passados
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-500" /> Jogos futuros
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-nba-orange" /> Hoje
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── RIGHT: Games panel ── */}
        <div className="flex-1 min-w-0 space-y-3">

          {/* Top bar: tabs + date nav */}
          <div className="card px-3 py-2 flex flex-wrap items-center justify-between gap-3">

            {/* Filter tabs */}
            <div className="flex items-center gap-0.5">
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors relative',
                    filter === id
                      ? 'bg-nba-orange text-white'
                      : 'text-muted hover:text-slate-200 hover:bg-bg-hover',
                  )}
                >
                  {label}
                  {id === 'ao_vivo' && liveCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-win text-white text-[9px] flex items-center justify-center font-bold">
                      {liveCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Date nav + calendar toggle */}
            <div className="flex items-center gap-2">
              <DateNav date={date} gameDates={gameDatesSet} />
              <button
                onClick={() => setShowCalendar(v => !v)}
                className={cn(
                  'p-1.5 rounded-lg transition-colors lg:hidden',
                  showCalendar ? 'bg-nba-orange text-white' : 'text-muted hover:bg-bg-hover hover:text-slate-200',
                )}
              >
                <Calendar size={15} />
              </button>
            </div>
          </div>

          {/* Mobile calendar (toggle) */}
          {showCalendar && (
            <div className="lg:hidden">
              <CalendarWidget
                selectedDate={date}
                gameDates={gameDatesSet}
                onSelect={(d) => { window.location.href = `/?date=${d}`; }}
              />
            </div>
          )}

          {/* Games list */}
          <div className="card overflow-hidden">
            {/* Card header */}
            <div className="card-header">
              <div className="w-2 h-2 rounded-full bg-nba-orange" />
              <span className="text-sm font-semibold text-slate-200">NBA</span>
              <span className="text-muted text-xs ml-auto">
                {filtered.length} {filtered.length === 1 ? 'jogo' : 'jogos'}
              </span>
            </div>

            {filtered.length === 0 ? (
              <EmptyState filter={filter} hasGames={games.length > 0} />
            ) : (
              filtered.map((g) => <GameCard key={g.gameId} game={g} />)
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function EmptyState({ filter, hasGames }: { filter: Filter; hasGames: boolean }) {
  const messages: Record<Filter, string> = {
    todos:      'Nenhum jogo nesta data.',
    ao_vivo:    'Nenhum jogo ao vivo agora.',
    proximos:   'Nenhum jogo agendado para esta data.',
    encerrados: 'Nenhum jogo encerrado nesta data.',
  };

  return (
    <div className="px-6 py-12 text-center space-y-1">
      <p className="text-slate-400 font-medium text-sm">
        {hasGames ? messages[filter] : 'Nenhum jogo nesta data.'}
      </p>
      {!hasGames && (
        <p className="text-muted text-xs">Use o calendário ou as setas para navegar até uma data com jogos.</p>
      )}
    </div>
  );
}
