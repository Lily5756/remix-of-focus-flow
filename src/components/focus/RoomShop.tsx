import { useState, useMemo } from 'react';
import { X, Lock, Check, Coins, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  RoomItem, 
  ItemCategory,
  getCurrentSeason, 
  SEASON_INFO,
  getAvailableShopItems 
} from '@/types/room';

type Category = ItemCategory;

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
  seasonal: { label: 'Seasonal', emoji: '🎁' },
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
  
  const currentSeason = useMemo(() => getCurrentSeason(), []);
  const seasonInfo = SEASON_INFO[currentSeason];
  const availableItems = useMemo(() => getAvailableShopItems(), []);
  
  const categories: Category[] = ['essentials', 'comfort', 'decor', 'special', 'seasonal'];
  const categoryItems = availableItems.filter(item => item.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[85vh] bg-card rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slide-up shadow-2xl">
        {/* Header - cozy style */}
        <div className="relative p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-xl">🏪</span>
              </div>
              <div>
                <h2 className="text-lg font-bold">Room Shop</h2>
                <p className="text-xs text-muted-foreground">Decorate your cozy space</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-background px-4 py-2 rounded-2xl border border-border shadow-sm">
                <Coins className="w-4 h-4 text-primary" />
                <span className="font-bold text-primary">
                  {focusPoints}
                </span>
              </div>
              
              <button
                onClick={onClose}
                className="p-2.5 rounded-2xl hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Category tabs - pill style */}
        <div className="flex gap-2 p-3 overflow-x-auto bg-muted/30">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all whitespace-nowrap",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              )}
            >
              <span>{CATEGORY_LABELS[cat].emoji}</span>
              <span>{CATEGORY_LABELS[cat].label}</span>
            </button>
          ))}
        </div>
        
        {/* Seasonal banner */}
        {activeCategory === 'seasonal' && (
          <div className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">{seasonInfo.emoji} {seasonInfo.label}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {seasonInfo.description} Limited time items refresh each season.
            </p>
          </div>
        )}
        
        {/* Items grid - Apple Reminders card style */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          {categoryItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="w-16 h-16 mx-auto mb-3 rounded-3xl bg-muted flex items-center justify-center">
                <span className="text-3xl">📦</span>
              </div>
              <p className="text-sm">No items available in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {categoryItems.map(item => {
                const isUnlocked = isItemUnlocked(item, longestStreak);
                const isOwned = ownsItem(item.id);
                const canAfford = focusPoints >= item.cost;
                const isSeasonal = item.category === 'seasonal';
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (isUnlocked && !isOwned && canAfford) {
                        onPurchase(item.id);
                      }
                    }}
                    disabled={!isUnlocked || isOwned || !canAfford}
                    className={cn(
                      "relative flex flex-col items-center p-5 rounded-3xl transition-all",
                      "border-2 bg-card",
                      isOwned && "border-primary/30 bg-primary/5",
                      !isOwned && isUnlocked && canAfford && "border-border hover:border-primary hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                      !isOwned && isUnlocked && !canAfford && "border-border opacity-50",
                      !isUnlocked && "border-border opacity-40",
                      isSeasonal && !isOwned && isUnlocked && canAfford && "ring-2 ring-primary/20"
                    )}
                  >
                    {/* Seasonal badge */}
                    {isSeasonal && !isOwned && (
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
                        {seasonInfo.emoji} Limited
                      </div>
                    )}
                    
                    {/* Lock indicator */}
                    {!isUnlocked && (
                      <div className="absolute top-3 right-3 p-1.5 rounded-full bg-muted">
                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Owned indicator */}
                    {isOwned && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                        <Check className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                    )}
                    
                    {/* Item preview container */}
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
                      <span className="text-4xl">{item.emoji}</span>
                    </div>
                    
                    {/* Item name */}
                    <span className="text-sm font-medium text-center leading-tight">{item.name}</span>
                    
                    {/* Price or unlock condition */}
                    {isUnlocked ? (
                      <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-muted">
                        <Coins className="w-3.5 h-3.5 text-primary" />
                        <span className={cn(
                          "text-sm font-bold",
                          canAfford ? "text-primary" : "text-muted-foreground"
                        )}>
                          {item.cost}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-2 px-3 py-1 rounded-full bg-muted">
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {item.unlockCondition?.description}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
