"use client";

interface Props {
  onSelectRange: (from: string, to: string) => void;
}

export default function QuickDateFilters({ onSelectRange }: Props) {
  const handleQuickSelect = (days: number) => {
    const to = new Date();
    const from = new Date();
    if (days === 1) { // Yesterday
      from.setDate(from.getDate() - 1);
      to.setDate(to.getDate() - 1);
    } else {
      from.setDate(from.getDate() - days);
    }
    
    onSelectRange(
      from.toISOString().split('T')[0],
      to.toISOString().split('T')[0]
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">Quick Dates:</span>
      <button onClick={() => handleQuickSelect(0)} className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors">Today</button>
      <button onClick={() => handleQuickSelect(1)} className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors">Yesterday</button>
      <button onClick={() => handleQuickSelect(7)} className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors">Last 7 Days</button>
      <button onClick={() => handleQuickSelect(30)} className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors">Last 30 Days</button>
    </div>
  );
}