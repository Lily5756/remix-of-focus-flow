import { cn } from '@/lib/utils';
import { SHOP_ITEMS, SEASONAL_ITEMS, GRID_SIZE, GRID_COLS } from '@/types/room';

interface RoomGridProps {
  placedItems: { itemId: string; gridPosition: number }[];
  selectedItemId?: string;
  onCellClick: (position: number) => void;
}

export function RoomGrid({ placedItems, selectedItemId, onCellClick }: RoomGridProps) {
  const cells = Array.from({ length: GRID_SIZE }, (_, i) => i);
  const allItems = [...SHOP_ITEMS, ...SEASONAL_ITEMS];
  
  const getItemAtPosition = (position: number) => {
    const placed = placedItems.find(p => p.gridPosition === position);
    if (!placed) return null;
    return allItems.find(i => i.id === placed.itemId);
  };

  return (
    <div className="relative w-full max-w-sm aspect-square">
      {/* Room background */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-muted to-muted/50 border-2 border-border/50 overflow-hidden">
        {/* Floor pattern */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)',
            }}
          />
        </div>
        
        {/* Wall line */}
        <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-border/30" />
      </div>
      
      {/* Grid cells */}
      <div 
        className="relative grid gap-1 p-2 h-full"
        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
      >
        {cells.map(position => {
          const item = getItemAtPosition(position);
          const isEmpty = !item;
          const isSelecting = !!selectedItemId;
          
          return (
            <button
              key={position}
              onClick={() => onCellClick(position)}
              className={cn(
                "aspect-square rounded-xl flex items-center justify-center text-2xl transition-all",
                "hover:scale-105 active:scale-95",
                isEmpty && isSelecting && "bg-primary/10 border-2 border-dashed border-primary/30 hover:border-primary/50",
                isEmpty && !isSelecting && "bg-transparent hover:bg-muted/30",
                item && "bg-muted/50 border-2 border-muted hover:bg-muted"
              )}
            >
              {item && (
                <span className="drop-shadow-sm">{item.emoji}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
