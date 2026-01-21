import { useState } from 'react';
import { X, Lock, Check, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SHOP_ITEMS, RoomItem } from '@/types/room';

type Category = 'essentials' | 'comfort' | 'decor' | 'special';

interface RoomShopProps {
  focusPoints: number;
  totalCompletedPomodoros: number;
  longestStreak: number;
  onClose: () => void;
  onPurchase: (itemId: string) => void;
  isItemUnlocked: (item: RoomItem, longestStreak: number) => boolean;
  ownsItem: (itemId: string) => boolean;
}

const CATEGORY_LABELS: Record<Category, { label: string; emoji: string }> = {
  essentials: { label: 'Essentials', emoji: '🌿' },
  comfort: { label: 'Comfort', emoji: '🪑' },
  decor: { label: 'Decor', emoji: '✨' },
  special: { label: 'Special', emoji: '🔮' },
};

export function RoomShop({
  focusPoints,
  totalCompletedPomodoros,
  longestStreak,
  onClose,
  onPurchase,
  isItemUnlocked,
  ownsItem,
}: RoomShopProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('essentials');
  
  const categories: Category[] = ['essentials', 'comfort', 'decor', 'special'];
  const categoryItems = SHOP_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[85vh] bg-background rounded-t-3xl sm:rounded-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏪</span>
            <h2 className="text-lg font-bold">Room Shop</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-accent px-3 py-1.5 rounded-full">
              <Coins className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary text-sm">
                {focusPoints}
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Category tabs */}
        <div className="flex gap-1 p-2 bg-muted/50 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                activeCategory === cat
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>{CATEGORY_LABELS[cat].emoji}</span>
              <span>{CATEGORY_LABELS[cat].label}</span>
            </button>
          ))}
        </div>
        
        {/* Items grid */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-2 gap-3">
            {categoryItems.map(item => {
              const isUnlocked = isItemUnlocked(item, longestStreak);
              const isOwned = ownsItem(item.id);
              const canAfford = focusPoints >= item.cost;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (isUnlocked && !isOwned) {
                      onPurchase(item.id);
                    }
                  }}
                  disabled={!isUnlocked || isOwned}
                  className={cn(
                    "relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all",
                    isOwned && "border-accent bg-accent/50",
                    !isOwned && isUnlocked && canAfford && "border-primary/50 bg-primary/5 hover:border-primary hover:scale-[1.02]",
                    !isOwned && isUnlocked && !canAfford && "border-border bg-muted/30 opacity-60",
                    !isUnlocked && "border-border bg-muted/30 opacity-50"
                  )}
                >
                  {/* Lock indicator */}
                  {!isUnlocked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Owned indicator */}
                  {isOwned && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  
                  {/* Item emoji */}
                  <span className="text-4xl mb-2">{item.emoji}</span>
                  
                  {/* Item name */}
                  <span className="text-sm font-medium text-center">{item.name}</span>
                  
                  {/* Price or unlock condition */}
                  {isUnlocked ? (
                    <div className="flex items-center gap-1 mt-1.5">
                      <Coins className="w-3.5 h-3.5 text-primary" />
                      <span className={cn(
                        "text-sm font-bold",
                        canAfford ? "text-primary" : "text-muted-foreground"
                      )}>
                        {item.cost}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground mt-1.5 text-center">
                      {item.unlockCondition?.description}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
