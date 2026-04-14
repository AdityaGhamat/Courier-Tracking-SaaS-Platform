import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: number | string;
  sub?: string;
  icon: LucideIcon;
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "primary"
    | "blue"
    | "purple";
}

const VARIANT_STYLES: Record<
  NonNullable<KpiCardProps["variant"]>,
  { iconBg: string; value: string }
> = {
  default: { iconBg: "bg-slate-600", value: "text-foreground" },
  success: {
    iconBg: "bg-green-500",
    value: "text-green-600 dark:text-green-400",
  },
  warning: {
    iconBg: "bg-orange-500",
    value: "text-orange-600 dark:text-orange-400",
  },
  danger: { iconBg: "bg-red-500", value: "text-red-600 dark:text-red-400" },
  primary: {
    iconBg: "bg-indigo-500",
    value: "text-indigo-600 dark:text-indigo-400",
  },
  blue: { iconBg: "bg-sky-500", value: "text-sky-600 dark:text-sky-400" },
  purple: {
    iconBg: "bg-violet-500",
    value: "text-violet-600 dark:text-violet-400",
  },
};

export function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  variant = "default",
}: KpiCardProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>

        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-white",
            styles.iconBg,
          )}
        >
          <Icon size={15} />
        </div>
      </div>

      <p
        className={cn(
          "text-3xl font-extrabold tabular-nums leading-none",
          styles.value,
        )}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>

      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
