// Server Component
type StatusVariant =
  | "pending"
  | "active"
  | "inactive"
  | "processing"
  | "shipped"
  | "delivered"
  | "resolved"
  | "cancelled"
  | "contacted"
  | "in_progress"
  | "paid";

interface StatusBadgeProps {
  variant: StatusVariant;
  label: string;
}

const variantClasses: Record<StatusVariant, string> = {
  pending:     "bg-amber-100 text-amber-800 border border-amber-200",
  paid:        "bg-emerald-100 text-emerald-800 border border-emerald-200",
  processing:  "bg-blue-100 text-blue-800 border border-blue-200",
  shipped:     "bg-violet-100 text-violet-800 border border-violet-200",
  delivered:   "bg-card-light text-text-primary border border-border",
  cancelled:   "bg-destructive/10 text-destructive border border-destructive/20",
  active:      "bg-emerald-100 text-emerald-800 border border-emerald-200",
  inactive:    "bg-muted text-muted-foreground border border-border",
  contacted:   "bg-blue-100 text-blue-800 border border-blue-200",
  in_progress: "bg-violet-100 text-violet-800 border border-violet-200",
  resolved:    "bg-emerald-100 text-emerald-800 border border-emerald-200",
};

export function StatusBadge({ variant, label }: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
      ].join(" ")}
    >
      {label}
    </span>
  );
}
