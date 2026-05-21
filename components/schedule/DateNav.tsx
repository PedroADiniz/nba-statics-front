'use client';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PT_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const PT_MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function formatDisplay(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${String(d).padStart(2, '0')} ${PT_MONTHS[m - 1]} ${PT_DAYS[date.getDay()]}`;
}

function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + n);
  return date.toISOString().slice(0, 10);
}

interface Props {
  date: string;
  gameDates: Set<string>;
}

export default function DateNav({ date, gameDates }: Props) {
  const router = useRouter();

  function go(d: string) {
    router.push(`/?date=${d}`);
  }

  function prev() {
    // find nearest past date with games
    let d = addDays(date, -1);
    for (let i = 0; i < 30; i++) {
      if (gameDates.has(d)) { go(d); return; }
      d = addDays(d, -1);
    }
  }

  function next() {
    // find nearest future date with games
    let d = addDays(date, 1);
    for (let i = 0; i < 30; i++) {
      if (gameDates.has(d)) { go(d); return; }
      d = addDays(d, 1);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={prev}
        className="p-1.5 rounded hover:bg-bg-hover transition-colors text-muted hover:text-slate-200"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        onClick={() => go(today)}
        className="px-3 py-1.5 text-sm font-semibold text-slate-200 hover:text-nba-orange transition-colors min-w-[130px] text-center"
      >
        {formatDisplay(date)}
        {date === today && <span className="ml-1.5 text-[10px] text-nba-orange font-bold uppercase">hoje</span>}
      </button>

      <button
        onClick={next}
        className="p-1.5 rounded hover:bg-bg-hover transition-colors text-muted hover:text-slate-200"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
