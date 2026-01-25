import { cn } from '@/lib/utils';
import { FOCUS_DURATIONS } from '@/types/focus';

interface DurationSelectorProps {
  selectedDuration: number;
  onSelect: (duration: number) => void;
  disabled?: boolean;
}

export function DurationSelector({ selectedDuration, onSelect, disabled }: DurationSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      {FOCUS_DURATIONS.map((duration) => (
        <button
          key={duration}
          onClick={() => onSelect(duration)}
          disabled={disabled}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            selectedDuration === duration
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {duration < 1 ? '10s' : `${duration}m`}
        </button>
      ))}
    </div>
  );
}
