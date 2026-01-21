// Room Builder Gamification Types

export interface RoomItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  category: 'essentials' | 'comfort' | 'decor' | 'special';
  unlockCondition?: UnlockCondition;
}

export interface UnlockCondition {
  type: 'pomodoros' | 'streak';
  value: number;
  description: string;
}

export interface OwnedItem {
  itemId: string;
  purchasedAt: number;
}

export interface PlacedItem {
  itemId: string;
  gridPosition: number; // 0-15 for 4x4 grid
}

export interface RoomState {
  focusPoints: number;
  lifetimeFocusPoints: number;
  totalCompletedPomodoros: number;
  ownedItems: OwnedItem[];
  placedItems: PlacedItem[];
}

export interface PointsEarned {
  base: number;
  reflectionBonus: number;
  firstOfDayBonus: number;
  total: number;
}

// Shop item catalog
export const SHOP_ITEMS: RoomItem[] = [
  // Essentials
  { id: 'small-plant', name: 'Small Plant', emoji: '🌿', cost: 25, category: 'essentials' },
  { id: 'rug', name: 'Cozy Rug', emoji: '🧶', cost: 30, category: 'essentials' },
  { id: 'poster', name: 'Wall Poster', emoji: '🖼️', cost: 35, category: 'essentials' },
  { id: 'desk-lamp', name: 'Desk Lamp', emoji: '💡', cost: 40, category: 'essentials' },
  
  // Comfort
  { id: 'chair', name: 'Comfy Chair', emoji: '🪑', cost: 60, category: 'comfort' },
  { id: 'desk', name: 'Study Desk', emoji: '🖥️', cost: 80, category: 'comfort' },
  { id: 'bookshelf', name: 'Bookshelf', emoji: '📚', cost: 90, category: 'comfort' },
  { id: 'big-plant', name: 'Big Plant', emoji: '🪴', cost: 100, category: 'comfort' },
  
  // Decor
  { id: 'clock', name: 'Wall Clock', emoji: '🕰️', cost: 70, category: 'decor' },
  { id: 'sofa', name: 'Cozy Sofa', emoji: '🛋️', cost: 180, category: 'decor' },
  { id: 'neon-sign', name: 'Neon Sign', emoji: '✨', cost: 200, category: 'decor' },
  { id: 'cat-bed', name: 'Cat Bed', emoji: '🐾', cost: 220, category: 'decor' },
  
  // Special (locked)
  { 
    id: 'golden-trophy', 
    name: 'Golden Trophy', 
    emoji: '🏆', 
    cost: 150, 
    category: 'special',
    unlockCondition: { type: 'pomodoros', value: 5, description: 'Complete 5 Pomodoros' }
  },
  { 
    id: 'starry-ceiling', 
    name: 'Starry Ceiling', 
    emoji: '🌌', 
    cost: 250, 
    category: 'special',
    unlockCondition: { type: 'streak', value: 7, description: '7-day streak' }
  },
  { 
    id: 'rain-window', 
    name: 'Rain Window', 
    emoji: '🌧️', 
    cost: 300, 
    category: 'special',
    unlockCondition: { type: 'pomodoros', value: 20, description: 'Complete 20 Pomodoros' }
  },
  { 
    id: 'zen-garden', 
    name: 'Zen Garden', 
    emoji: '🪨', 
    cost: 350, 
    category: 'special',
    unlockCondition: { type: 'streak', value: 14, description: '14-day streak' }
  },
];

export const GRID_SIZE = 16; // 4x4 grid
export const GRID_COLS = 4;

// Points configuration
export const POINTS_CONFIG = {
  BASE_SESSION: 10,
  REFLECTION_BONUS: 2,
  FIRST_OF_DAY_BONUS: 5,
};
