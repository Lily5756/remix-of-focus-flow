import { Volume2, VolumeX, SkipForward, Music, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicControlsProps {
  isPlaying: boolean;
  isMusicEnabled: boolean;
  volume: number;
  onToggleMusic: () => void;
  onSkipTrack: () => void;
  onVolumeChange: (volume: number) => void;
  onRetryPlay?: () => void;
}

export function MusicControls({
  isPlaying,
  isMusicEnabled,
  volume,
  onToggleMusic,
  onSkipTrack,
  onVolumeChange,
  onRetryPlay,
}: MusicControlsProps) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl border backdrop-blur-sm"
      style={{
        background: 'hsl(var(--card) / 0.6)',
        borderColor: 'hsl(var(--border) / 0.5)',
        boxShadow: '0 4px 16px hsl(var(--background) / 0.3), inset 0 1px 0 hsl(255 255 255 / 0.05)'
      }}
    >
      {/* Music toggle */}
      <button
        onClick={onToggleMusic}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
          isMusicEnabled
            ? "text-white"
            : "bg-muted/60 text-muted-foreground"
        )}
        style={isMusicEnabled ? {
          background: 'linear-gradient(135deg, hsl(var(--timer-accent)) 0%, hsl(var(--timer-accent) / 0.8) 100%)',
          boxShadow: '0 4px 12px hsl(var(--timer-accent) / 0.3)'
        } : {}}
        title={isMusicEnabled ? "Disable music" : "Enable music"}
      >
        {isMusicEnabled ? (
          <Music className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>

      {/* Show "Play Music" button when music is enabled but not playing */}
      {isMusicEnabled && !isPlaying && onRetryPlay && (
        <button
          onClick={onRetryPlay}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--timer-accent)) 0%, hsl(var(--timer-accent) / 0.8) 100%)',
            color: 'white',
            boxShadow: '0 4px 12px hsl(var(--timer-accent) / 0.3)'
          }}
        >
          <Play className="w-4 h-4" fill="currentColor" />
          <span>Play Music</span>
        </button>
      )}

      {/* Volume slider - show when music is enabled */}
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
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, hsl(var(--timer-accent)) 0%, hsl(var(--timer-accent)) ${volume * 100}%, hsl(var(--muted)) ${volume * 100}%, hsl(var(--muted)) 100%)`
              }}
            />
          </div>

          {/* Skip track button */}
          {isPlaying && (
            <button
              onClick={onSkipTrack}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border backdrop-blur-sm hover:scale-105"
              style={{
                background: 'hsl(var(--card) / 0.8)',
                borderColor: 'hsl(var(--border) / 0.5)'
              }}
              title="Skip track"
            >
              <SkipForward className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
