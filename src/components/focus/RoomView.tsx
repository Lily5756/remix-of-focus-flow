import { useState, useMemo } from 'react';
import { Store, Coins, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoomGrid } from './RoomGrid';
import { RoomShop } from './RoomShop';
import { RoomPet } from './RoomPet';
import { ShareRewardsModal } from './ShareRewardsModal';
import { RoomItem, ClaimedReward } from '@/types/room';

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
  const [showShareRewards, setShowShareRewards] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RoomItem | null>(null);
  const [shopMessage, setShopMessage] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col h-full px-4">
      {/* Header with points and shop button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
          <Coins className="w-5 h-5 text-primary" />
          <span className="font-bold text-primary">
            {focusPoints} FP
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Share rewards button */}
          <button
            onClick={() => setShowShareRewards(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-accent hover:bg-accent/80 transition-colors"
            title="Earn Focus Points"
          >
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary hidden sm:inline">Earn</span>
          </button>
          
          {/* Shop button */}
          <button
            onClick={handleShopOpen}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
              "bg-primary text-primary-foreground hover:opacity-90",
              isTimerActive && "opacity-50"
            )}
          >
            <Store className="w-4 h-4" />
            <span className="text-sm font-medium">Shop</span>
          </button>
        </div>
      </div>

      {/* Message display */}
      {shopMessage && (
        <div className="mb-4 p-3 bg-muted rounded-xl text-center text-sm animate-fade-in">
          {shopMessage}
        </div>
      )}

      {/* Room grid */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {!hasItems ? (
          <div className="text-center p-8">
            <div className="text-4xl mb-4">🏠</div>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Your room is empty 🌱 Complete a Pomodoro to earn Focus Points and start decorating!
            </p>
          </div>
        ) : (
          <>
            <div className="relative w-full max-w-sm">
              <RoomGrid
                placedItems={placedItems}
                selectedItemId={selectedItem?.id}
                onCellClick={handleGridCellClick}
              />
              
              {/* Cozy cat pet - appears when cat bed is owned */}
              <RoomPet petType="cat" isVisible={hasCatBed} />
            </div>
            
            {/* Unplaced items inventory */}
            {unplacedOwnedItems.length > 0 && (
              <div className="mt-6 w-full max-w-sm">
                <p className="text-xs text-muted-foreground mb-2 text-center">
                  {selectedItem 
                    ? 'Tap an empty cell to place the item'
                    : 'Tap an item below to place it'}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {unplacedOwnedItems.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectItemToPlace(item)}
                      className={cn(
                        "w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all",
                        "border-2 hover:scale-110",
                        selectedItem?.id === item.id
                          ? "border-primary bg-primary/20 scale-110"
                          : "border-border bg-muted/50"
                      )}
                      title={item.name}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

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
