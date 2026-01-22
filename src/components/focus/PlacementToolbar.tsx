import { Check, RotateCcw, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoomItem } from '@/types/room';

interface PlacementToolbarProps {
  selectedItem: RoomItem | null;
  onPlace?: () => void;
  onCancel: () => void;
}

export function PlacementToolbar({ selectedItem, onCancel }: PlacementToolbarProps) {
  if (!selectedItem) return null;
  
  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-center gap-3 p-3 bg-card/95 backdrop-blur-md rounded-2xl border border-border shadow-lg">
        {/* Selected item preview */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-xl">
          <span className="text-2xl">{selectedItem.emoji}</span>
          <span className="text-sm font-medium max-w-[100px] truncate">
            {selectedItem.name}
          </span>
        </div>
        
        {/* Divider */}
        <div className="w-px h-8 bg-border" />
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Cancel button */}
          <button
            onClick={onCancel}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all",
              "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            <X className="w-4 h-4" />
            <span className="text-xs font-medium">Cancel</span>
          </button>
        </div>
      </div>
      
      {/* Hint text */}
      <p className="text-center text-xs text-muted-foreground mt-2 animate-fade-in">
        Tap a spot on the floor to place • Tap placed items to remove
      </p>
    </div>
  );
}
