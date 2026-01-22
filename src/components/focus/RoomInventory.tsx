import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoomItem } from '@/types/room';

interface RoomInventoryProps {
  items: RoomItem[];
  selectedItemId?: string;
  onSelectItem: (item: RoomItem) => void;
  onClose: () => void;
}

export function RoomInventory({ items, selectedItemId, onSelectItem, onClose }: RoomInventoryProps) {
  if (items.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-card rounded-t-3xl sm:rounded-2xl p-6 animate-slide-up">
          <div className="text-center">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">No Items in Inventory</h3>
            <p className="text-sm text-muted-foreground">
              Visit the Shop to purchase furniture and decor!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-card rounded-t-3xl sm:rounded-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Your Inventory</h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Items grid */}
        <div className="p-4 max-h-[50vh] overflow-y-auto">
          <p className="text-xs text-muted-foreground mb-3 text-center">
            Select an item to place in your room
          </p>
          
          <div className="grid grid-cols-4 gap-3">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectItem(item);
                  onClose();
                }}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center p-2 rounded-2xl transition-all",
                  "border-2 hover:scale-105 active:scale-95",
                  selectedItemId === item.id
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border bg-muted/50 hover:border-primary/50"
                )}
              >
                <span className="text-2xl mb-1">{item.emoji}</span>
                <span className="text-[10px] font-medium text-center leading-tight line-clamp-2">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
