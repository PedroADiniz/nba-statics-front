'use client';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const WEEK_DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

interface Props {
  selectedDate: string;       // YYYY-MM-DD
  gameDates: Set<string>;     // set of YYYY-MM-DD with games
  onSelect: (date: string) => void;
}

export default function CalendarWidget({ selectedDate, gameDates, onSelect }: Props) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [viewYear, setViewYear] = useState(() => Number(selectedDate.slice(0, 4)));
  const [viewMonth, setViewMonth] = useState(() => Number(selectedDate.slice(5, 7)) - 1);

  const days = useMemo(() => buildMonth(viewYear, viewMonth), [viewYear, viewMonth]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  return (
    <div className="card p-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 rounded hover:bg-bg-hover transition-colors text-muted hover:text-slate-200">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-slate-200">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="p-1 rounded hover:bg-bg-hover transition-colors text-muted hover:text-slate-200">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map((d, i) => (
          <div key={i} className="text-center text-[10px] text-muted font-medium py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((day, i) => {
          if (!day) return <div key={i} />;

          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const hasGame = gameDates.has(dateStr);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          const isFuture = dateStr > todayStr;

          return (
            <button
              key={i}
              disabled={!hasGame}
              onClick={() => hasGame && onSelect(dateStr)}
              className={cn(
                'relative flex flex-col items-center justify-center h-8 w-full rounded text-xs font-medium transition-colors',
                isSelected && 'bg-nba-orange text-white',
                !isSelected && hasGame && !isToday && 'text-slate-200 hover:bg-bg-hover cursor-pointer',
                !isSelected && isToday && hasGame && 'text-nba-orange font-bold hover:bg-bg-hover cursor-pointer',
                !isSelected && isToday && !hasGame && 'text-nba-orange font-bold opacity-40 cursor-not-allowed',
                !hasGame && !isToday && 'text-slate-700 cursor-not-allowed',
                isFuture && hasGame && !isSelected && 'text-slate-400',
              )}
            >
              {day}
              {hasGame && !isSelected && (
                <span className={cn(
                  'absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full',
                  isToday ? 'bg-nba-orange' : isFuture ? 'bg-slate-500' : 'bg-slate-400',
                )} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function buildMonth(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
