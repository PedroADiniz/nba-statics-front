import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function teamLogoUrl(teamId: number): string {
  return `https://cdn.nba.com/logos/nba/${teamId}/global/L/logo.svg`;
}

export function playerPhotoUrl(playerId: number): string {
  return `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`;
}

export function currentSeason(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const startYear = month >= 10 ? year : year - 1;
  return `${startYear}-${String(startYear + 1).slice(-2)}`;
}

export function fmtPct(value: number): string {
  return value > 0 ? `${(value * 100).toFixed(1)}%` : '—';
}

export function fmtStat(value: number, decimals = 1): string {
  return value > 0 ? value.toFixed(decimals) : '—';
}

export function heightToCm(height: string): string {
  if (!height) return '—';
  const m = height.match(/^(\d+)-(\d+)$/);
  if (!m) return height;
  const cm = Math.round((Number(m[1]) * 12 + Number(m[2])) * 2.54);
  return `${cm} cm`;
}

export function weightToKg(weight: string | number): string {
  if (!weight) return '—';
  const lbs = Number(String(weight).replace(/\s*lbs?/i, ''));
  if (isNaN(lbs) || lbs === 0) return '—';
  return `${Math.round(lbs * 0.453592)} kg`;
}

export function formatDate(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export function formatSeason(season: string): string {
  const year = season.slice(-4);
  return `${year}/${String(Number(year) + 1).slice(-2)}`;
}

export function pct(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function yearsAgo(n: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - n);
  return d.toISOString().slice(0, 10);
}
