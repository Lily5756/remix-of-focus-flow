import { cn } from '@/lib/utils';
import { FOCUS_DURATIONS } from '@/types/focus';

interface DurationSelectorProps {
  selectedDuration: number;
  onSelect: (duration: number) => void;
  disabled?: boolean;
}

export function DurationSelector({ selectedDuration, onSelect, disabled }: DurationSelectorProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {FOCUS_DURATIONS.map((duration) => (
        <button
          key={duration}
          onClick={() => onSelect(duration)}
          disabled={disabled}
          className={cn(
            "min-w-[3.5rem] px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            selectedDuration === duration
              ? "bg-foreground text-background shadow-md"
              : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {`${duration}m`}
        </button>
      ))}
    </div>
  );
}
