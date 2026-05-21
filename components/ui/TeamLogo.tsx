'use client';
import Image from 'next/image';
import { teamLogoUrl } from '@/lib/utils';

interface Props {
  teamId: number;
  name: string;
  size?: number;
  className?: string;
}

export default function TeamLogo({ teamId, name, size = 40, className = '' }: Props) {
  return (
    <Image
      src={teamLogoUrl(teamId)}
      alt={name}
      width={size}
      height={size}
      className={`object-contain drop-shadow-lg ${className}`}
      onError={() => {}}
      unoptimized
    />
  );
}
