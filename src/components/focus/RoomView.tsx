import { useState, useMemo } from 'react';
import { Store, Coins, Gift, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IsometricRoom } from './IsometricRoom';
import { RoomShop } from './RoomShop';
import { RoomPet } from './RoomPet';
import { RoomInventory } from './RoomInventory';
import { PlacementToolbar } from './PlacementToolbar';
import { ShareRewardsModal } from './ShareRewardsModal';
import { RoomItem, ClaimedReward, SHOP_ITEMS, SEASONAL_ITEMS } from '@/types/room';

interface RoomViewProps {
  focusPoints: number;
  totalCompletedPomodoros: number;
  longestStreak: number;
  ownedItems: { itemId: string; purchasedAt: number }[];
  placedItems: { itemId: string; gridPosition: number }[];
  unplacedOwnedItems: RoomItem[];
  isTimerActive: boolean;
  appUrl: string;
  onPurchase: (itemId: string) => { success: boolean; message: string };
  onPlaceItem: (itemId: string, gridPosition: number) => boolean;
  onRemoveItem: (gridPosition: number) => void;
  isItemUnlocked: (item: RoomItem, longestStreak: number) => boolean;
  ownsItem: (itemId: string) => boolean;
  onClaimReward: (rewardType: ClaimedReward['type']) => { success: boolean; points: number };
  hasClaimedReward: (rewardType: ClaimedReward['type']) => boolean;
}

export function RoomView({
  focusPoints,
  totalCompletedPomodoros,
  longestStreak,
  ownedItems,
  placedItems,
  unplacedOwnedItems,
  isTimerActive,
  appUrl,
  onPurchase,
  onPlaceItem,
  onRemoveItem,
  isItemUnlocked,
  ownsItem,
  onClaimReward,
  hasClaimedReward,
}: RoomViewProps) {
  const [showShop, setShowShop] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showShareRewards, setShowShareRewards] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RoomItem | null>(null);
  const [shopMessage, setShopMessage] = useState<string | null>(null);

  const allItems = useMemo(() => [...SHOP_ITEMS, ...SEASONAL_ITEMS], []);

  const handleShopOpen = () => {
    if (isTimerActive) {
      setShopMessage('Finish your focus session first 🔒');
      setTimeout(() => setShopMessage(null), 2500);
      return;
    }
    setShowShop(true);
  };

  const handlePurchase = (itemId: string) => {
    const result = onPurchase(itemId);
    setShopMessage(result.message);
    setTimeout(() => setShopMessage(null), 2500);
  };

  const handleGridCellClick = (position: number) => {
    const existingItem = placedItems.find(p => p.gridPosition === position);
    
    if (existingItem) {
      // Remove item from grid
      onRemoveItem(position);
      setSelectedItem(null);
    } else if (selectedItem) {
      // Place selected item
      const success = onPlaceItem(selectedItem.id, position);
      if (success) {
        setSelectedItem(null);
      }
    }
  };

  const handleSelectItemToPlace = (item: RoomItem) => {
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const hasItems = ownedItems.length > 0;
  
  // Check if user owns a cat bed to show the pet
  const hasCatBed = useMemo(() => ownsItem('cat-bed'), [ownsItem]);

  const isPlacementMode = !!selectedItem;

  return (
    <div className="flex flex-col h-full">
      {/* Room Scene - Takes ~70% of screen */}
      <div className="flex-1 relative flex flex-col items-center justify-center px-4 py-6">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-muted/50 pointer-events-none" />
        
        {/* Message display */}
        {shopMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-card/95 backdrop-blur-md rounded-full border border-border shadow-lg animate-fade-in">
            <span className="text-sm">{shopMessage}</span>
          </div>
        )}

        {!hasItems ? (
          <div className="text-center p-8 relative z-10">
            <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-5xl">🏠</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Your Room Awaits</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Complete Pomodoros to earn Focus Points and start decorating your cozy space!
            </p>
          </div>
        ) : (
          <div className="relative w-full max-w-sm">
            <IsometricRoom
              placedItems={placedItems}
              selectedItemId={selectedItem?.id}
              isPlacementMode={isPlacementMode}
              onCellClick={handleGridCellClick}
            />
            
            {/* Cozy cat pet - appears when cat bed is owned */}
            <RoomPet petType="cat" isVisible={hasCatBed} />
          </div>
        )}
        
        {/* Placement mode toolbar */}
        {isPlacementMode && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <PlacementToolbar
              selectedItem={selectedItem}
              onCancel={() => setSelectedItem(null)}
            />
          </div>
        )}
      </div>

      {/* Bottom Controls Panel */}
      <div className={cn(
        "relative z-10 px-4 pb-4 pt-3",
        "bg-gradient-to-t from-background via-background to-transparent"
      )}>
        {/* Focus Points Badge */}
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm">
            <Coins className="w-5 h-5 text-primary" />
            <span className="font-bold text-primary">{focusPoints}</span>
            <span className="text-xs text-muted-foreground">FP</span>
          </div>
        </div>
        
        {/* Action buttons row */}
        <div className="flex items-center justify-center gap-3">
          {/* Inventory button */}
          <button
            onClick={() => setShowInventory(true)}
            disabled={unplacedOwnedItems.length === 0}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl transition-all",
              "bg-card border border-border shadow-sm",
              "hover:shadow-md hover:border-primary/30",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Package className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Inventory</span>
            {unplacedOwnedItems.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                {unplacedOwnedItems.length}
              </span>
            )}
          </button>
          
          {/* Shop button */}
          <button
            onClick={handleShopOpen}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl transition-all",
              "bg-primary text-primary-foreground shadow-sm",
              "hover:opacity-90 hover:shadow-md",
              isTimerActive && "opacity-50"
            )}
          >
            <Store className="w-5 h-5" />
            <span className="text-sm font-medium">Shop</span>
          </button>
          
          {/* Earn Rewards button */}
          <button
            onClick={() => setShowShareRewards(true)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl transition-all",
              "bg-card border border-border shadow-sm",
              "hover:shadow-md hover:border-primary/30"
            )}
          >
            <Gift className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Earn</span>
          </button>
        </div>
      </div>

      {/* Inventory modal */}
      {showInventory && (
        <RoomInventory
          items={unplacedOwnedItems}
          selectedItemId={selectedItem?.id}
          onSelectItem={handleSelectItemToPlace}
          onClose={() => setShowInventory(false)}
        />
      )}

      {/* Shop modal */}
      {showShop && (
        <RoomShop
          focusPoints={focusPoints}
          totalCompletedPomodoros={totalCompletedPomodoros}
          longestStreak={longestStreak}
          onClose={() => setShowShop(false)}
          onPurchase={handlePurchase}
          isItemUnlocked={isItemUnlocked}
          ownsItem={ownsItem}
        />
      )}

      {/* Share rewards modal */}
      {showShareRewards && (
        <ShareRewardsModal
          onClose={() => setShowShareRewards(false)}
          onClaimReward={onClaimReward}
          hasClaimedReward={hasClaimedReward}
          appUrl={appUrl}
        />
      )}
    </div>
  );
}
