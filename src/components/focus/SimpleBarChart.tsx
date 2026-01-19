import { cn } from '@/lib/utils';

interface ChartData {
  label: string;
  minutes: number;
  sessions: number;
}

interface SimpleBarChartProps {
  data: ChartData[];
  className?: string;
}

export function SimpleBarChart({ data, className }: SimpleBarChartProps) {
  const maxMinutes = Math.max(...data.map(d => d.minutes), 1);

  return (
    <div className={cn("flex items-end justify-between gap-1 h-32", className)}>
      {data.map((item, index) => {
        const height = (item.minutes / maxMinutes) * 100;
        const hasData = item.minutes > 0;
        
        return (
          <div
            key={index}
            className="flex-1 flex flex-col items-center gap-1"
          >
            {/* Bar */}
            <div className="w-full flex items-end justify-center h-24">
              <div
                className={cn(
                  "w-full max-w-8 rounded-t-md transition-all duration-300",
                  hasData ? "bg-foreground" : "bg-muted"
                )}
                style={{ height: `${Math.max(height, hasData ? 8 : 4)}%` }}
              />
            </div>
            
            {/* Label */}
            <span className="text-[10px] text-muted-foreground font-medium">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
