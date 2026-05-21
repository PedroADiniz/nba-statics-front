export interface TeamDTO {
  id: number;
  abbreviation: string;
  city: string;
  name: string;
  fullName: string;
  conference: string;
  division: string;
}

export interface QuarterScoreDTO {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
}

export interface GameDTO {
  gameId: string;
  date: string;
  season: string;
  team1IsHome: boolean;
  team1Score: number;
  team2Score: number;
  team1HalftimeScore: number | null;
  team2HalftimeScore: number | null;
  team1Quarters: QuarterScoreDTO | null;
  team2Quarters: QuarterScoreDTO | null;
  winner: 'team1' | 'team2';
  margin: number;
  total: number;
}

export interface OverUnderLineDTO {
  line: number;
  over: number;
  under: number;
  overPct: number;
  underPct: number;
}

export interface ScoringThresholdDTO {
  points: number;
  count: number;
  pct: number;
}

export interface QuarterAverageDTO {
  quarter: string;
  avg: number;
  combinedAvg: number;
}

export interface HalftimeCrossoverDTO {
  halftimeLeader: string;
  finalWinner: string;
  count: number;
  pct: number;
  isComeback: boolean;
}

export interface H2HAnalysisDTO {
  meta: {
    team1: TeamDTO;
    team2: TeamDTO;
    startDate: string;
    endDate: string;
    totalGames: number;
    generatedAt: string;
  };
  record: {
    team1Wins: number;
    team2Wins: number;
    team1WinPct: number;
    team2WinPct: number;
  };
  halftime: {
    gamesWithData: number;
    team1Leads: number;
    team2Leads: number;
    tied: number;
    team1LeadPct: number;
    team2LeadPct: number;
    crossovers: HalftimeCrossoverDTO[];
  };
  quarterAverages: {
    gamesWithData: number;
    team1: QuarterAverageDTO[];
    team2: QuarterAverageDTO[];
  };
  scoring: {
    team1Avg: number;
    team2Avg: number;
    totalAvg: number;
    marginAvg: number;
    biggestWin: GameDTO | null;
    lastGame: GameDTO | null;
    closeGames: number;
    blowouts: number;
  };
  thresholds: {
    team1: ScoringThresholdDTO[];
    team2: ScoringThresholdDTO[];
    total: OverUnderLineDTO[];
  };
  games: GameDTO[];
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  total?: number;
}

// Player types

export interface PlayerRosterEntryDTO {
  id: number;
  fullName: string;
  jerseyNumber: string;
  position: string;
  height: string;
  weight: string;
  birthdate: string;
  age: number;
  experience: string;
  school: string;
}

export interface RosterResponseDTO {
  teamId: number;
  season: string;
  players: PlayerRosterEntryDTO[];
}

export interface PlayerProfileDTO {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  teamId: number;
  teamName: string;
  teamAbbreviation: string;
  jerseyNumber: string;
  position: string;
  height: string;
  weight: string;
  birthdate: string;
  age: number;
  experience: string;
  school: string;
  country: string;
  draftYear: number | null;
  draftRound: number | null;
  draftNumber: number | null;
  isActive: boolean;
}

export interface PlayerCareerRowDTO {
  season: string;
  teamId: number;
  teamAbbreviation: string;
  gamesPlayed: number;
  gamesStarted: number;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fieldGoalPct: number;
  threePointPct: number;
  freeThrowPct: number;
}

export interface CareerStatsResponseDTO {
  playerId: number;
  seasons: PlayerCareerRowDTO[];
}

export interface PlayerGameEntryDTO {
  gameId: string;
  gameDate: string;
  matchup: string;
  outcome: 'W' | 'L';
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fieldGoalPct: number;
  threePointPct: number;
  freeThrowPct: number;
  plusMinus: number;
}

export interface GameLogResponseDTO {
  playerId: number;
  season: string;
  games: PlayerGameEntryDTO[];
}

export interface PlayerSeasonStatsDTO {
  playerId: number;
  playerName: string;
  teamId: number;
  teamAbbreviation: string;
  season: string;
  gamesPlayed: number;
  gamesStarted: number;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fieldGoalPct: number;
  threePointPct: number;
  freeThrowPct: number;
  plusMinus: number;
}

export interface TeamSeasonStatsResponseDTO {
  teamId: number;
  season: string;
  players: PlayerSeasonStatsDTO[];
}

// Schedule types

export interface ScheduleTeamDTO {
  id: number;
  city: string;
  name: string;
  abbreviation: string;
  wins: number;
  losses: number;
  score: number | null;
}

export interface ScheduleGameDTO {
  gameId: string;
  gameDate: string;       // YYYY-MM-DD
  gameTimeUtc: string;    // ISO UTC
  gameStatusText: string; // "7:30 pm ET" | "Final" | "Q3 4:21"
  gameStatus: 1 | 2 | 3; // 1=scheduled 2=live 3=final
  homeTeam: ScheduleTeamDTO;
  awayTeam: ScheduleTeamDTO;
}

export interface ScheduleByDateResponseDTO {
  date: string;
  games: ScheduleGameDTO[];
}

export interface ScheduleDatesResponseDTO {
  dates: string[];
}

export interface GameDetailTeamDTO extends ScheduleTeamDTO {
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  ot1: number | null;
  ot2: number | null;
  ot3: number | null;
  ot4: number | null;
  fgPct: number | null;
  ftPct: number | null;
  fg3Pct: number | null;
  assists: number | null;
  rebounds: number | null;
}

export interface GameDetailPlayerDTO {
  playerId: number;
  playerName: string;
  startPosition: string;
  minutes: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fgMade: number;
  fgAttempted: number;
  fg3Made: number;
  fg3Attempted: number;
  ftMade: number;
  ftAttempted: number;
  plusMinus: number;
}

export interface GameDetailDTO {
  gameId: string;
  gameDate: string;
  gameTimeUtc: string;
  gameStatus: 1 | 2 | 3;
  gameStatusText: string;
  homeTeam: GameDetailTeamDTO;
  awayTeam: GameDetailTeamDTO;
  homePlayers: GameDetailPlayerDTO[];
  awayPlayers: GameDetailPlayerDTO[];
  attendance: number | null;
  gameDuration: string | null;
}
