"use client";

export default function QueueProgressIndicator({ completed, total }: { completed: number, total: number }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center gap-4">
      <div className="flex flex-col shrink-0">
        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Queue Progress</span>
        <span className="font-bold text-foreground">{completed} / {total} Completed</span>
      </div>
      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-success transition-all duration-700" style={{ width: `${percentage}%` }} />
      </div>
      <span className="text-sm font-bold text-success shrink-0">{percentage}%</span>
    </div>
  );
}