import { cn } from '@/lib/utils';
import { Badge } from './badge';

type Status = 'not_started' | 'learning' | 'mastered' | 'easy' | 'medium' | 'hard';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  not_started: {
    label: 'Belum Mulai',
    className: 'bg-muted text-muted-foreground',
  },
  learning: {
    label: 'Sedang Belajar',
    className: 'bg-primary/10 text-primary',
  },
  mastered: {
    label: 'Dikuasai',
    className: 'bg-success/10 text-success',
  },
  easy: {
    label: 'Mudah',
    className: 'bg-success/10 text-success',
  },
  medium: {
    label: 'Sedang',
    className: 'bg-warning/10 text-warning',
  },
  hard: {
    label: 'Sulit',
    className: 'bg-destructive/10 text-destructive',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={cn('font-medium', config.className, className)}>
      {config.label}
    </Badge>
  );
}