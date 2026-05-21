import {
  TeamDTO,
  H2HAnalysisDTO,
  ApiResponse,
  RosterResponseDTO,
  PlayerProfileDTO,
  CareerStatsResponseDTO,
  GameLogResponseDTO,
  TeamSeasonStatsResponseDTO,
  ScheduleByDateResponseDTO,
  ScheduleDatesResponseDTO,
  GameDetailDTO,
} from '@/types/api';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';
const KEY  = process.env.NEXT_PUBLIC_API_KEY ?? '';

async function apiFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { 'x-api-key': KEY },
    next: { revalidate: 0 },
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || json.status === 'error') {
    throw new Error(json.message ?? `HTTP ${res.status}`);
  }

  return json.data as T;
}

export async function fetchTeams(conference?: string): Promise<TeamDTO[]> {
  const params: Record<string, string> = {};
  if (conference) params['conference'] = conference;
  return apiFetch<TeamDTO[]>('/teams', params);
}

export async function fetchTeam(id: number): Promise<TeamDTO> {
  return apiFetch<TeamDTO>(`/teams/${id}`);
}

export interface H2HParams {
  team1Id: number;
  team2Id: number;
  startDate: string;
  endDate: string;
  includeQuarters?: boolean;
}

export async function fetchH2H(params: H2HParams): Promise<H2HAnalysisDTO> {
  return apiFetch<H2HAnalysisDTO>('/h2h', {
    team1Id: String(params.team1Id),
    team2Id: String(params.team2Id),
    startDate: params.startDate,
    endDate: params.endDate,
    includeQuarters: String(params.includeQuarters ?? false),
  });
}

export async function fetchRoster(teamId: number, season?: string): Promise<RosterResponseDTO> {
  const params: Record<string, string> = { teamId: String(teamId) };
  if (season) params['season'] = season;
  return apiFetch<RosterResponseDTO>('/players', params);
}

export async function fetchPlayer(playerId: number): Promise<PlayerProfileDTO> {
  return apiFetch<PlayerProfileDTO>(`/players/${playerId}`);
}

export async function fetchPlayerCareer(playerId: number): Promise<CareerStatsResponseDTO> {
  return apiFetch<CareerStatsResponseDTO>(`/players/${playerId}/career`);
}

export async function fetchPlayerGameLog(playerId: number, season?: string): Promise<GameLogResponseDTO> {
  const params: Record<string, string> = {};
  if (season) params['season'] = season;
  return apiFetch<GameLogResponseDTO>(`/players/${playerId}/gamelog`, params);
}

export async function fetchTeamSeasonStats(teamId: number, season?: string): Promise<TeamSeasonStatsResponseDTO> {
  const params: Record<string, string> = { teamId: String(teamId) };
  if (season) params['season'] = season;
  return apiFetch<TeamSeasonStatsResponseDTO>('/players/stats', params);
}

export async function fetchSchedule(date: string): Promise<ScheduleByDateResponseDTO> {
  return apiFetch<ScheduleByDateResponseDTO>('/schedule', { date });
}

export async function fetchScheduleDates(): Promise<ScheduleDatesResponseDTO> {
  return apiFetch<ScheduleDatesResponseDTO>('/schedule/dates');
}

export async function fetchGameDetail(gameId: string): Promise<GameDetailDTO> {
  return apiFetch<GameDetailDTO>(`/schedule/game/${gameId}`);
}
