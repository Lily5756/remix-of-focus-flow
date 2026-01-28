import { cn } from '@/lib/utils';
import { FOCUS_DURATIONS } from '@/types/focus';
import { ChevronDown } from 'lucide-react';

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
            "min-w-[3.5rem] px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "border backdrop-blur-sm",
            selectedDuration === duration
              ? "bg-card/80 text-foreground border-[hsl(var(--timer-accent))] shadow-[0_0_20px_hsl(var(--timer-accent)/0.3),inset_0_1px_0_hsl(var(--timer-accent)/0.2)]"
              : "bg-card/40 text-muted-foreground border-border/60 hover:bg-card/60 hover:text-foreground hover:border-border",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {`${duration}m`}
        </button>
      ))}
      {/* More options dropdown indicator */}
      <button
        disabled={disabled}
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
          "border backdrop-blur-sm",
          "bg-card/40 text-muted-foreground border-border/60 hover:bg-card/60 hover:text-foreground hover:border-border",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}
