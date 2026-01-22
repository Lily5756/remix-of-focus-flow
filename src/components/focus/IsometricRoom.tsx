import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { SHOP_ITEMS, SEASONAL_ITEMS, RoomItem } from '@/types/room';

interface PlacedItem {
  itemId: string;
  gridPosition: number;
}

interface IsometricRoomProps {
  placedItems: PlacedItem[];
  selectedItemId?: string;
  isPlacementMode: boolean;
  onCellClick: (position: number) => void;
}

// Isometric grid positions - 4x4 grid mapped to isometric coordinates
// Position 0 is back-left, position 15 is front-right
const ISOMETRIC_POSITIONS: { x: number; y: number; z: number }[] = [
  // Row 0 (back row)
  { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 1 }, { x: 2, y: 0, z: 2 }, { x: 3, y: 0, z: 3 },
  // Row 1
  { x: 0, y: 1, z: 1 }, { x: 1, y: 1, z: 2 }, { x: 2, y: 1, z: 3 }, { x: 3, y: 1, z: 4 },
  // Row 2
  { x: 0, y: 2, z: 2 }, { x: 1, y: 2, z: 3 }, { x: 2, y: 2, z: 4 }, { x: 3, y: 2, z: 5 },
  // Row 3 (front row)
  { x: 0, y: 3, z: 3 }, { x: 1, y: 3, z: 4 }, { x: 2, y: 3, z: 5 }, { x: 3, y: 3, z: 6 },
];

// Convert grid position to screen position
function getScreenPosition(gridPos: number) {
  const iso = ISOMETRIC_POSITIONS[gridPos];
  const tileWidth = 60;
  const tileHeight = 30;
  
  // Isometric projection
  const screenX = (iso.x - iso.y) * (tileWidth / 2);
  const screenY = (iso.x + iso.y) * (tileHeight / 2);
  
  return { 
    x: screenX + 120, // Center offset
    y: screenY + 20,  // Top offset
    z: iso.z 
  };
}

export function IsometricRoom({ 
  placedItems, 
  selectedItemId, 
  isPlacementMode,
  onCellClick 
}: IsometricRoomProps) {
  const allItems = useMemo(() => [...SHOP_ITEMS, ...SEASONAL_ITEMS], []);
  
  const getItemAtPosition = (position: number): RoomItem | null => {
    const placed = placedItems.find(p => p.gridPosition === position);
    if (!placed) return null;
    return allItems.find(i => i.id === placed.itemId) || null;
  };

  // Sort items by z-index for proper layering
  const sortedPositions = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => i).sort((a, b) => {
      const posA = getScreenPosition(a);
      const posB = getScreenPosition(b);
      return posA.z - posB.z;
    });
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto">
      {/* Outer shadow/glow */}
      <div className="absolute inset-0 -bottom-4 rounded-3xl bg-gradient-to-b from-transparent to-black/10 blur-xl" />
      
      {/* Room container with perspective */}
      <div className="relative w-full h-full">
        {/* Background - soft muted sage color */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[hsl(140,20%,75%)] to-[hsl(140,15%,65%)] dark:from-[hsl(140,15%,25%)] dark:to-[hsl(140,10%,20%)]" />
        
        {/* Isometric room structure */}
        <svg 
          viewBox="0 0 300 250" 
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))' }}
        >
          {/* Floor */}
          <polygon
            points="150,180 30,120 150,60 270,120"
            className="fill-[hsl(35,30%,85%)] dark:fill-[hsl(35,20%,30%)]"
          />
          {/* Floor wood pattern overlay */}
          <g className="opacity-30">
            <line x1="60" y1="110" x2="180" y2="170" stroke="currentColor" strokeWidth="0.5" className="text-foreground/20" />
            <line x1="90" y1="95" x2="210" y2="155" stroke="currentColor" strokeWidth="0.5" className="text-foreground/20" />
            <line x1="120" y1="80" x2="240" y2="140" stroke="currentColor" strokeWidth="0.5" className="text-foreground/20" />
          </g>
          
          {/* Left wall */}
          <polygon
            points="30,120 30,40 150,0 150,60"
            className="fill-[hsl(0,0%,95%)] dark:fill-[hsl(0,0%,25%)]"
          />
          {/* Left wall accent line */}
          <line x1="30" y1="40" x2="150" y2="0" stroke="currentColor" strokeWidth="1" className="text-foreground/10" />
          
          {/* Right wall */}
          <polygon
            points="150,60 150,0 270,40 270,120"
            className="fill-[hsl(0,0%,92%)] dark:fill-[hsl(0,0%,22%)]"
          />
          {/* Right wall accent line */}
          <line x1="150" y1="0" x2="270" y2="40" stroke="currentColor" strokeWidth="1" className="text-foreground/10" />
          
          {/* Wall corner edge */}
          <line x1="150" y1="0" x2="150" y2="60" stroke="currentColor" strokeWidth="2" className="text-foreground/5" />
          
          {/* Window on right wall - centered on wall */}
          <g transform="translate(196, 35)">
            <rect x="0" y="0" width="30" height="24" rx="1" className="fill-[hsl(200,60%,85%)] dark:fill-[hsl(220,30%,45%)]" />
            {/* Window frame */}
            <rect x="0" y="0" width="30" height="24" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/25" />
            {/* Window panes */}
            <line x1="15" y1="0" x2="15" y2="24" stroke="currentColor" strokeWidth="1" className="text-foreground/20" />
            <line x1="0" y1="12" x2="30" y2="12" stroke="currentColor" strokeWidth="1" className="text-foreground/20" />
          </g>
          
          {/* Wall art on left wall - centered on wall */}
          <g transform="translate(75, 35)">
            <rect x="0" y="0" width="24" height="18" rx="1" className="fill-[hsl(340,30%,75%)] dark:fill-[hsl(340,25%,40%)]" />
            <rect x="0" y="0" width="24" height="18" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/25" />
          </g>
        </svg>
        
        {/* Interactive floor grid overlay */}
        <div 
          className="absolute inset-0"
          style={{ 
            perspective: '800px',
            transformStyle: 'preserve-3d'
          }}
        >
          {sortedPositions.map(position => {
            const item = getItemAtPosition(position);
            const screenPos = getScreenPosition(position);
            const isEmpty = !item;
            const isSelecting = isPlacementMode && !!selectedItemId;
            
            return (
              <button
                key={position}
                onClick={() => onCellClick(position)}
                className={cn(
                  "absolute transition-all duration-200 ease-out",
                  "flex items-center justify-center",
                  "hover:scale-110",
                  isEmpty && isSelecting && "animate-pulse"
                )}
                style={{
                  left: `${screenPos.x}px`,
                  top: `${screenPos.y + 50}px`, // Offset to align with floor
                  width: '55px',
                  height: '55px',
                  zIndex: screenPos.z + 10,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Clickable area indicator */}
                <div 
                  className={cn(
                    "absolute inset-0 rounded-xl transition-all",
                    isEmpty && isSelecting && "bg-primary/20 border-2 border-dashed border-primary/40",
                    isEmpty && !isSelecting && "hover:bg-primary/10",
                    item && "hover:ring-2 hover:ring-primary/50 rounded-xl"
                  )}
                />
                
                {/* Item display */}
                {item && (
                  <div 
                    className="relative flex flex-col items-center"
                    style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}
                  >
                    <span className="text-3xl">{item.emoji}</span>
                    {/* Item shadow */}
                    <div className="absolute -bottom-1 w-8 h-2 bg-black/20 rounded-full blur-sm" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
