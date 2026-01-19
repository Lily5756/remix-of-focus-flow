import { Volume2, VolumeX, SkipForward, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicControlsProps {
  isPlaying: boolean;
  isMusicEnabled: boolean;
  volume: number;
  onToggleMusic: () => void;
  onSkipTrack: () => void;
  onVolumeChange: (volume: number) => void;
}

export function MusicControls({
  isPlaying,
  isMusicEnabled,
  volume,
  onToggleMusic,
  onSkipTrack,
  onVolumeChange,
}: MusicControlsProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-2xl">
      {/* Music toggle */}
      <button
        onClick={onToggleMusic}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all",
          isMusicEnabled
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground"
        )}
        title={isMusicEnabled ? "Disable music" : "Enable music"}
      >
        {isMusicEnabled ? (
          <Music className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>

      {/* Volume slider */}
      {isMusicEnabled && (
        <>
          <div className="flex items-center gap-2 flex-1">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
              className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-foreground"
            />
          </div>

          {/* Skip track button */}
          {isPlaying && (
            <button
              onClick={onSkipTrack}
              className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-accent transition-colors"
              title="Skip track"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
