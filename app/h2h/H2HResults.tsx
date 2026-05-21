'use client';
import { useState, useEffect, useCallback } from 'react';
import { fetchH2H } from '@/lib/api';
import { H2HAnalysisDTO } from '@/types/api';
import { H2HSkeleton } from '@/components/ui/Skeleton';
import H2HForm from '@/components/h2h/H2HForm';
import RecordWidget from '@/components/h2h/RecordWidget';
import ScoringWidget from '@/components/h2h/ScoringWidget';
import HalftimeWidget from '@/components/h2h/HalftimeWidget';
import QuarterChart from '@/components/h2h/QuarterChart';
import OverUnderTable from '@/components/h2h/OverUnderTable';
import ThresholdsTable from '@/components/h2h/ThresholdsTable';
import GamesHistory from '@/components/h2h/GamesHistory';
import PlayersWidget from '@/components/h2h/PlayersWidget';
import { formatDate } from '@/lib/utils';
import { RefreshCw, AlertCircle, SlidersHorizontal } from 'lucide-react';

interface Props {
  team1Id?: number;
  team2Id?: number;
  startDate?: string;
  endDate?: string;
}

export default function H2HResults({ team1Id, team2Id, startDate, endDate }: Props) {
  const [data, setData] = useState<H2HAnalysisDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(!team1Id || !team2Id);

  const load = useCallback(async () => {
    if (!team1Id || !team2Id || !startDate || !endDate) return;
    setLoading(true);
    setError('');
    try {
      const result = await fetchH2H({ team1Id, team2Id, startDate, endDate, includeQuarters: true });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido.');
    } finally {
      setLoading(false);
    }
  }, [team1Id, team2Id, startDate, endDate]);

  useEffect(() => { void load(); }, [load]);

  if (!team1Id || !team2Id) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <p className="text-muted text-sm">Selecione os times para iniciar a análise.</p>
        <H2HForm />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          {data && (
            <span>
              <span className="text-slate-300 font-semibold">{data.meta.team1.abbreviation}</span>
              {' '}vs{' '}
              <span className="text-slate-300 font-semibold">{data.meta.team2.abbreviation}</span>
              {' · '}
              {formatDate(startDate!)} – {formatDate(endDate!)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowForm(v => !v)} className="btn-ghost flex items-center gap-1.5">
            <SlidersHorizontal size={14} /> {showForm ? 'Fechar' : 'Alterar busca'}
          </button>
          <button onClick={load} disabled={loading} className="btn-ghost flex items-center gap-1.5">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Inline form */}
      {showForm && (
        <H2HForm
          initialTeam1={team1Id}
          initialTeam2={team2Id}
          initialStart={startDate}
          initialEnd={endDate}
        />
      )}

      {/* Loading */}
      {loading && <H2HSkeleton />}

      {/* Error */}
      {error && !loading && (
        <div className="card px-5 py-8 text-center space-y-3">
          <AlertCircle size={32} className="text-loss mx-auto" />
          <p className="text-slate-300 font-semibold">Não foi possível carregar os dados</p>
          <p className="text-muted text-sm">{error}</p>
          <button onClick={load} className="btn-primary mx-auto flex items-center gap-2">
            <RefreshCw size={14} /> Tentar novamente
          </button>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="space-y-5">
          <RecordWidget data={data} />

          <ScoringWidget data={data} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <HalftimeWidget data={data} />
            <QuarterChart data={data} />
          </div>

          <OverUnderTable data={data} />

          <ThresholdsTable data={data} />

          <PlayersWidget data={data} />

          <GamesHistory data={data} />
        </div>
      )}
    </div>
  );
}
