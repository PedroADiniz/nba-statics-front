'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Users, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/',       label: 'Início',  icon: Home },
  { href: '/h2h',    label: 'H2H',     icon: Activity },
  { href: '/times',  label: 'Times',   icon: Users },
];

export default function Header() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-bg-surface/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-lg bg-nba-orange flex items-center justify-center
                           shadow-glow group-hover:scale-105 transition-transform">
            <Activity size={16} className="text-white" />
          </span>
          <span className="font-bold text-lg tracking-tight text-slate-100">
            NBA <span className="text-nba-orange">Statics</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'btn-ghost flex items-center gap-1.5',
                path === href && 'text-nba-orange bg-bg-hover',
              )}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
