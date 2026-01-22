import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { 
  RoomState, 
  OwnedItem, 
  PlacedItem, 
  SHOP_ITEMS, 
  SEASONAL_ITEMS,
  POINTS_CONFIG,
  PointsEarned,
  RoomItem,
  ClaimedReward,
  SHARING_REWARDS,
  WELCOME_BONUS,
  getAvailableShopItems
} from '@/types/room';

const DEFAULT_ROOM_STATE: RoomState = {
  roomName: 'My Cozy Room',
  focusPoints: WELCOME_BONUS, // 1000 FP welcome bonus!
  lifetimeFocusPoints: WELCOME_BONUS,
  totalCompletedPomodoros: 0,
  ownedItems: [],
  placedItems: [],
  hasClaimedWelcomeBonus: true,
  claimedRewards: [],
};

export function useRoomBuilder() {
  const [roomState, setRoomState] = useLocalStorage<RoomState>('room-state', DEFAULT_ROOM_STATE);
  const [lastPointsDate, setLastPointsDate] = useLocalStorage<string>('last-points-date', '');

  // Calculate earned points for a session
  const calculatePoints = useCallback((didReflect: boolean): PointsEarned => {
    const today = new Date().toISOString().split('T')[0];
    const isFirstOfDay = lastPointsDate !== today;
    
    const base = POINTS_CONFIG.BASE_SESSION;
    const reflectionBonus = didReflect ? POINTS_CONFIG.REFLECTION_BONUS : 0;
    const firstOfDayBonus = isFirstOfDay ? POINTS_CONFIG.FIRST_OF_DAY_BONUS : 0;
    
    return {
      base,
      reflectionBonus,
      firstOfDayBonus,
      total: base + reflectionBonus + firstOfDayBonus,
    };
  }, [lastPointsDate]);

  // Award points after completing a session
  const awardPoints = useCallback((didReflect: boolean): PointsEarned => {
    const today = new Date().toISOString().split('T')[0];
    const points = calculatePoints(didReflect);
    
    setRoomState(prev => ({
      ...prev,
      focusPoints: prev.focusPoints + points.total,
      lifetimeFocusPoints: prev.lifetimeFocusPoints + points.total,
      totalCompletedPomodoros: prev.totalCompletedPomodoros + 1,
    }));
    
    setLastPointsDate(today);
    return points;
  }, [calculatePoints, setRoomState, setLastPointsDate]);

  // Check if an item is unlocked based on conditions
  const isItemUnlocked = useCallback((item: RoomItem, longestStreak: number): boolean => {
    if (!item.unlockCondition) return true;
    
    const { type, value } = item.unlockCondition;
    if (type === 'pomodoros') {
      return roomState.totalCompletedPomodoros >= value;
    }
    if (type === 'streak') {
      return longestStreak >= value;
    }
    return false;
  }, [roomState.totalCompletedPomodoros]);

  // Check if user owns an item
  const ownsItem = useCallback((itemId: string): boolean => {
    return roomState.ownedItems.some(o => o.itemId === itemId);
  }, [roomState.ownedItems]);

  // Purchase an item
  const purchaseItem = useCallback((itemId: string): { success: boolean; message: string } => {
    // Search in both regular and seasonal items
    const allItems = [...SHOP_ITEMS, ...SEASONAL_ITEMS];
    const item = allItems.find(i => i.id === itemId);
    if (!item) {
      return { success: false, message: 'Item not found' };
    }
    
    if (ownsItem(itemId)) {
      return { success: false, message: 'You already own this item!' };
    }
    
    if (roomState.focusPoints < item.cost) {
      return { 
        success: false, 
        message: 'Not enough Focus Points yet 🌱 Complete a session to earn more!' 
      };
    }
    
    const newOwnedItem: OwnedItem = {
      itemId,
      purchasedAt: Date.now(),
    };
    
    setRoomState(prev => ({
      ...prev,
      focusPoints: prev.focusPoints - item.cost,
      ownedItems: [...prev.ownedItems, newOwnedItem],
    }));
    
    return { success: true, message: `You purchased ${item.name}! ${item.emoji}` };
  }, [roomState.focusPoints, ownsItem, setRoomState]);

  // Place an item on the grid
  const placeItem = useCallback((itemId: string, gridPosition: number): boolean => {
    if (!ownsItem(itemId)) return false;
    
    // Check if position is occupied
    const isOccupied = roomState.placedItems.some(p => p.gridPosition === gridPosition);
    if (isOccupied) return false;
    
    // Remove item from any previous position
    const newPlacedItems = roomState.placedItems.filter(p => p.itemId !== itemId);
    
    // Add to new position
    const newPlacement: PlacedItem = { itemId, gridPosition };
    
    setRoomState(prev => ({
      ...prev,
      placedItems: [...newPlacedItems, newPlacement],
    }));
    
    return true;
  }, [ownsItem, roomState.placedItems, setRoomState]);

  // Remove an item from the grid
  const removeItemFromGrid = useCallback((gridPosition: number): void => {
    setRoomState(prev => ({
      ...prev,
      placedItems: prev.placedItems.filter(p => p.gridPosition !== gridPosition),
    }));
  }, [setRoomState]);

  // Get item at a specific grid position
  const getItemAtPosition = useCallback((gridPosition: number): RoomItem | null => {
    const placed = roomState.placedItems.find(p => p.gridPosition === gridPosition);
    if (!placed) return null;
    const allItems = [...SHOP_ITEMS, ...SEASONAL_ITEMS];
    return allItems.find(i => i.id === placed.itemId) || null;
  }, [roomState.placedItems]);

  // Get owned items that are not placed
  const unplacedOwnedItems = useMemo(() => {
    const allItems = [...SHOP_ITEMS, ...SEASONAL_ITEMS];
    const placedItemIds = new Set(roomState.placedItems.map(p => p.itemId));
    return roomState.ownedItems
      .filter(o => !placedItemIds.has(o.itemId))
      .map(o => allItems.find(i => i.id === o.itemId))
      .filter((i): i is RoomItem => i !== undefined);
  }, [roomState.ownedItems, roomState.placedItems]);

  // Check if a sharing reward has been claimed
  const hasClaimedReward = useCallback((rewardType: ClaimedReward['type']): boolean => {
    return roomState.claimedRewards.some(r => r.type === rewardType);
  }, [roomState.claimedRewards]);

  // Claim a sharing reward
  const claimSharingReward = useCallback((rewardType: ClaimedReward['type']): { success: boolean; points: number } => {
    if (hasClaimedReward(rewardType)) {
      return { success: false, points: 0 };
    }

    const reward = Object.values(SHARING_REWARDS).find(r => r.type === rewardType);
    if (!reward) {
      return { success: false, points: 0 };
    }

    const newReward: ClaimedReward = {
      type: rewardType,
      claimedAt: Date.now(),
    };

    setRoomState(prev => ({
      ...prev,
      focusPoints: prev.focusPoints + reward.points,
      lifetimeFocusPoints: prev.lifetimeFocusPoints + reward.points,
      claimedRewards: [...prev.claimedRewards, newReward],
    }));

    return { success: true, points: reward.points };
  }, [hasClaimedReward, setRoomState]);

  // Set room name
  const setRoomName = useCallback((name: string) => {
    setRoomState(prev => ({
      ...prev,
      roomName: name,
    }));
  }, [setRoomState]);

  return {
    // State
    roomName: roomState.roomName,
    focusPoints: roomState.focusPoints,
    lifetimeFocusPoints: roomState.lifetimeFocusPoints,
    totalCompletedPomodoros: roomState.totalCompletedPomodoros,
    ownedItems: roomState.ownedItems,
    placedItems: roomState.placedItems,
    unplacedOwnedItems,
    claimedRewards: roomState.claimedRewards,
    
    // Actions
    setRoomName,
    awardPoints,
    calculatePoints,
    purchaseItem,
    placeItem,
    removeItemFromGrid,
    getItemAtPosition,
    isItemUnlocked,
    ownsItem,
    hasClaimedReward,
    claimSharingReward,
  };
}
