import type { Metadata } from 'next';
import H2HResults from './H2HResults';

export const metadata: Metadata = { title: 'Análise H2H' };

interface Props {
  searchParams: { team1Id?: string; team2Id?: string; startDate?: string; endDate?: string };
}

export default function H2HPage({ searchParams }: Props) {
  const { team1Id, team2Id, startDate, endDate } = searchParams;

  return (
    <H2HResults
      team1Id={team1Id ? Number(team1Id) : undefined}
      team2Id={team2Id ? Number(team2Id) : undefined}
      startDate={startDate}
      endDate={endDate}
    />
  );
}
