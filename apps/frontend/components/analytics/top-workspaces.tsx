import { cn } from "@/lib/utils";
import type { TopWorkspace } from "@/types/analytics.types";

interface Props {
  data: TopWorkspace[];
}

const RANK_COLORS = [
  "bg-yellow-400 text-yellow-900",
  "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  "bg-orange-300 text-orange-900",
];

export function TopWorkspaces({ data }: Props) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((w) => w.total), 1);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm font-semibold text-foreground">
        Top Workspaces by Volume
      </p>

      <div className="flex flex-col gap-3">
        {data.map((w, idx) => {
          const pct = (w.total / max) * 100;
          const rankStyle =
            RANK_COLORS[idx] ?? "bg-muted text-muted-foreground";

          return (
            <div key={w.workspaceId}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shrink-0",
                      rankStyle,
                    )}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-sm text-foreground font-medium">
                    {w.workspaceName ?? w.workspaceId.slice(0, 8)}
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {w.total.toLocaleString()}
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    idx === 0 ? "bg-yellow-400" : "bg-indigo-500",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
