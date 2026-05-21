'use client';
import Image from 'next/image';
import { useState } from 'react';
import { playerPhotoUrl } from '@/lib/utils';
import { User } from 'lucide-react';

interface Props {
  playerId: number;
  name: string;
  size?: number;
  className?: string;
}

export default function PlayerAvatar({ playerId, name, size = 56, className = '' }: Props) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-bg-surface ${className}`}
        style={{ width: size, height: size }}
      >
        <User size={size * 0.5} className="text-muted" />
      </div>
    );
  }

  return (
    <Image
      src={playerPhotoUrl(playerId)}
      alt={name}
      width={size}
      height={Math.round(size * 0.73)}
      className={`object-cover object-top ${className}`}
      onError={() => setError(true)}
      unoptimized
    />
  );
}
