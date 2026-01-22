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
            className="fill-[hsl(35,30%,82%)] dark:fill-[hsl(35,20%,28%)]"
          />
          {/* Floor wood plank pattern */}
          <g className="opacity-40">
            <line x1="50" y1="115" x2="170" y2="175" stroke="currentColor" strokeWidth="0.5" className="text-foreground/15" />
            <line x1="70" y1="105" x2="190" y2="165" stroke="currentColor" strokeWidth="0.5" className="text-foreground/15" />
            <line x1="90" y1="95" x2="210" y2="155" stroke="currentColor" strokeWidth="0.5" className="text-foreground/15" />
            <line x1="110" y1="85" x2="230" y2="145" stroke="currentColor" strokeWidth="0.5" className="text-foreground/15" />
            <line x1="130" y1="75" x2="250" y2="135" stroke="currentColor" strokeWidth="0.5" className="text-foreground/15" />
            {/* Cross planks */}
            <line x1="70" y1="130" x2="150" y2="90" stroke="currentColor" strokeWidth="0.3" className="text-foreground/10" />
            <line x1="110" y1="150" x2="190" y2="110" stroke="currentColor" strokeWidth="0.3" className="text-foreground/10" />
            <line x1="150" y1="170" x2="230" y2="130" stroke="currentColor" strokeWidth="0.3" className="text-foreground/10" />
          </g>
          
          {/* Cozy floor rug */}
          <ellipse cx="150" cy="130" rx="45" ry="22" className="fill-[hsl(25,40%,65%)] dark:fill-[hsl(25,30%,35%)] opacity-60" />
          <ellipse cx="150" cy="130" rx="38" ry="18" className="fill-[hsl(25,45%,75%)] dark:fill-[hsl(25,35%,40%)] opacity-50" />
          
          {/* Left wall */}
          <polygon
            points="30,120 30,40 150,0 150,60"
            className="fill-[hsl(0,0%,96%)] dark:fill-[hsl(0,0%,24%)]"
          />
          {/* Left wall wainscoting/paneling */}
          <polygon
            points="30,120 30,90 150,50 150,60"
            className="fill-[hsl(0,0%,93%)] dark:fill-[hsl(0,0%,20%)]"
          />
          <line x1="30" y1="90" x2="150" y2="50" stroke="currentColor" strokeWidth="1" className="text-foreground/8" />
          {/* Left wall baseboard */}
          <polygon
            points="30,120 30,115 150,57 150,60"
            className="fill-[hsl(30,20%,50%)] dark:fill-[hsl(30,15%,30%)]"
          />
          {/* Left wall accent line */}
          <line x1="30" y1="40" x2="150" y2="0" stroke="currentColor" strokeWidth="1" className="text-foreground/10" />
          
          {/* Right wall */}
          <polygon
            points="150,60 150,0 270,40 270,120"
            className="fill-[hsl(0,0%,93%)] dark:fill-[hsl(0,0%,21%)]"
          />
          {/* Right wall wainscoting/paneling */}
          <polygon
            points="150,60 150,50 270,90 270,120"
            className="fill-[hsl(0,0%,90%)] dark:fill-[hsl(0,0%,18%)]"
          />
          <line x1="150" y1="50" x2="270" y2="90" stroke="currentColor" strokeWidth="1" className="text-foreground/8" />
          {/* Right wall baseboard */}
          <polygon
            points="150,60 150,57 270,115 270,120"
            className="fill-[hsl(30,20%,50%)] dark:fill-[hsl(30,15%,30%)]"
          />
          {/* Right wall accent line */}
          <line x1="150" y1="0" x2="270" y2="40" stroke="currentColor" strokeWidth="1" className="text-foreground/10" />
          
          {/* Wall corner edge */}
          <line x1="150" y1="0" x2="150" y2="60" stroke="currentColor" strokeWidth="2" className="text-foreground/8" />
          
          {/* Window on right wall - with curtains and sill */}
          <g transform="translate(196, 35)">
            {/* Window light glow */}
            <ellipse cx="15" cy="12" rx="20" ry="15" className="fill-[hsl(50,80%,90%)] dark:fill-[hsl(220,40%,30%)] opacity-30" />
            {/* Window glass */}
            <rect x="0" y="0" width="30" height="24" rx="1" className="fill-[hsl(200,70%,88%)] dark:fill-[hsl(220,35%,50%)]" />
            {/* Sky reflection */}
            <rect x="2" y="2" width="12" height="9" rx="0.5" className="fill-[hsl(200,80%,92%)] dark:fill-[hsl(220,40%,55%)] opacity-60" />
            {/* Window frame */}
            <rect x="0" y="0" width="30" height="24" rx="1" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/20" />
            {/* Window panes */}
            <line x1="15" y1="0" x2="15" y2="24" stroke="currentColor" strokeWidth="1.5" className="text-foreground/20" />
            <line x1="0" y1="12" x2="30" y2="12" stroke="currentColor" strokeWidth="1.5" className="text-foreground/20" />
            {/* Window sill */}
            <rect x="-2" y="23" width="34" height="3" rx="0.5" className="fill-[hsl(30,20%,85%)] dark:fill-[hsl(30,15%,35%)]" />
            {/* Left curtain */}
            <path d="M-4,0 Q-6,12 -4,24 L0,24 L0,0 Z" className="fill-[hsl(340,25%,80%)] dark:fill-[hsl(340,20%,35%)]" />
            {/* Right curtain */}
            <path d="M34,0 Q36,12 34,24 L30,24 L30,0 Z" className="fill-[hsl(340,25%,80%)] dark:fill-[hsl(340,20%,35%)]" />
            {/* Curtain rod */}
            <line x1="-6" y1="-2" x2="36" y2="-2" stroke="currentColor" strokeWidth="1.5" className="text-foreground/25" />
          </g>
          
          {/* Wall art on left wall - framed picture */}
          <g transform="translate(75, 35)">
            {/* Frame shadow */}
            <rect x="2" y="2" width="24" height="18" rx="1" className="fill-black/10" />
            {/* Frame */}
            <rect x="0" y="0" width="24" height="18" rx="1" className="fill-[hsl(30,25%,75%)] dark:fill-[hsl(30,20%,30%)]" />
            {/* Inner mat */}
            <rect x="2" y="2" width="20" height="14" rx="0.5" className="fill-[hsl(0,0%,98%)] dark:fill-[hsl(0,0%,15%)]" />
            {/* Artwork - simple landscape */}
            <rect x="3" y="3" width="18" height="12" className="fill-[hsl(200,40%,75%)] dark:fill-[hsl(200,30%,40%)]" />
            <ellipse cx="8" cy="7" rx="2" ry="2" className="fill-[hsl(45,80%,70%)] dark:fill-[hsl(45,60%,50%)]" />
            <path d="M3,15 L8,10 L13,13 L18,8 L21,12 L21,15 Z" className="fill-[hsl(140,30%,55%)] dark:fill-[hsl(140,25%,35%)]" />
          </g>
          
          {/* Small shelf on left wall */}
          <g transform="translate(55, 58)">
            <rect x="0" y="0" width="18" height="3" className="fill-[hsl(30,25%,60%)] dark:fill-[hsl(30,20%,35%)]" />
            {/* Small plant on shelf */}
            <ellipse cx="9" cy="-2" rx="4" ry="3" className="fill-[hsl(140,40%,50%)] dark:fill-[hsl(140,30%,35%)]" />
            <rect x="7" y="-1" width="4" height="2" rx="0.5" className="fill-[hsl(25,50%,55%)] dark:fill-[hsl(25,40%,35%)]" />
          </g>
          
          {/* Clock on right wall */}
          <g transform="translate(238, 50)">
            <circle cx="8" cy="8" r="8" className="fill-[hsl(0,0%,98%)] dark:fill-[hsl(0,0%,20%)]" />
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground/20" />
            <line x1="8" y1="8" x2="8" y2="4" stroke="currentColor" strokeWidth="1" className="text-foreground/40" />
            <line x1="8" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="0.8" className="text-foreground/40" />
            <circle cx="8" cy="8" r="1" className="fill-foreground/30" />
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
