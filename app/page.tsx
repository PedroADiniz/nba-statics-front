import type { Metadata } from 'next';
import { fetchSchedule, fetchScheduleDates } from '@/lib/api';
import SchedulePage from '@/components/schedule/SchedulePage';

export const metadata: Metadata = { title: 'Jogos NBA' };

interface Props {
  searchParams: Promise<{ date?: string }>;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default async function HomePage({ searchParams }: Props) {
  const { date = todayStr() } = await searchParams;

  const [scheduleRes, datesRes] = await Promise.allSettled([
    fetchSchedule(date),
    fetchScheduleDates(),
  ]);

  const games = scheduleRes.status === 'fulfilled' ? scheduleRes.value.games : [];
  const allDates = datesRes.status === 'fulfilled' ? datesRes.value.dates : [];

  return <SchedulePage date={date} games={games} allDates={allDates} />;
}
