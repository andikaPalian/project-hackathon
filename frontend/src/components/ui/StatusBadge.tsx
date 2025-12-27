import { cn } from "@/lib/utils";
import { Badge } from "./badge";

type Status = "belum_dimulai" | "sedang_belajar" | "dikuasai" | "easy" | "medium" | "hard";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  belum_dimulai: {
    label: "Belum Mulai",
    className: "bg-muted text-muted-foreground",
  },
  sedang_belajar: {
    label: "Sedang Belajar",
    className: "bg-primary/10 text-primary",
  },
  dikuasai: {
    label: "Dikuasai",
    className: "bg-success/10 text-success",
  },
  easy: {
    label: "Mudah",
    className: "bg-success/10 text-success",
  },
  medium: {
    label: "Sedang",
    className: "bg-warning/10 text-warning",
  },
  hard: {
    label: "Sulit",
    className: "bg-destructive/10 text-destructive",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig["belum_dimulai"];

  return (
    <Badge variant="secondary" className={cn("font-medium", config.className, className)}>
      {config.label}
    </Badge>
  );
}
