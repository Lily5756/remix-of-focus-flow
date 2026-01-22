// Room Builder Gamification Types

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';
export type ItemCategory = 'essentials' | 'comfort' | 'decor' | 'special' | 'seasonal';

export interface RoomItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  category: ItemCategory;
  unlockCondition?: UnlockCondition;
  season?: Season; // Only for seasonal items
}

export interface UnlockCondition {
  type: 'pomodoros' | 'streak';
  value: number;
  description: string;
}

// Get current season based on month
export function getCurrentSeason(): Season {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'spring';   // Mar-May
  if (month >= 5 && month <= 7) return 'summer';   // Jun-Aug
  if (month >= 8 && month <= 10) return 'autumn';  // Sep-Nov
  return 'winter'; // Dec-Feb
}

export const SEASON_INFO: Record<Season, { label: string; emoji: string; description: string }> = {
  winter: { label: 'Winter Cozy', emoji: '❄️', description: 'Warm up your room!' },
  spring: { label: 'Spring Bloom', emoji: '🌸', description: 'Fresh and floral!' },
  summer: { label: 'Summer Vibes', emoji: '☀️', description: 'Bright and breezy!' },
  autumn: { label: 'Autumn Harvest', emoji: '🍂', description: 'Cozy fall feels!' },
};

export interface OwnedItem {
  itemId: string;
  purchasedAt: number;
}

export interface PlacedItem {
  itemId: string;
  gridPosition: number; // 0-15 for 4x4 grid
}

export interface RoomState {
  roomName: string;
  focusPoints: number;
  lifetimeFocusPoints: number;
  totalCompletedPomodoros: number;
  ownedItems: OwnedItem[];
  placedItems: PlacedItem[];
  hasClaimedWelcomeBonus: boolean;
  claimedRewards: ClaimedReward[];
}

export interface ClaimedReward {
  type: 'message_share' | 'social_share' | 'rating_feedback';
  claimedAt: number;
}

export const SHARING_REWARDS = {
  MESSAGE_SHARE: { type: 'message_share' as const, points: 200, label: 'Share via Message', emoji: '💬' },
  SOCIAL_SHARE: { type: 'social_share' as const, points: 500, label: 'Share on Social Media', emoji: '📱' },
  RATING_FEEDBACK: { type: 'rating_feedback' as const, points: 1000, label: 'Rate & Give Feedback', emoji: '⭐' },
};

export const WELCOME_BONUS = 1000;

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
  
  // Beds - Various styles and aesthetics
  { id: 'bed-simple', name: 'Simple Bed', emoji: '🛏️', cost: 120, category: 'comfort' },
  { id: 'bed-pink', name: 'Pink Dream Bed', emoji: '🎀', cost: 150, category: 'comfort' },
  { id: 'bed-blue', name: 'Ocean Blue Bed', emoji: '🌊', cost: 150, category: 'comfort' },
  { id: 'bed-purple', name: 'Lavender Bed', emoji: '💜', cost: 160, category: 'comfort' },
  { id: 'bed-green', name: 'Forest Bed', emoji: '🌲', cost: 160, category: 'comfort' },
  { id: 'bed-royal', name: 'Royal Canopy', emoji: '👑', cost: 250, category: 'comfort' },
  { id: 'bed-modern', name: 'Modern Platform', emoji: '🖤', cost: 200, category: 'comfort' },
  { id: 'bed-cozy', name: 'Cozy Cottage', emoji: '🧸', cost: 180, category: 'comfort' },
  { id: 'bed-sports', name: 'Sports Bed', emoji: '⚽', cost: 170, category: 'comfort' },
  { id: 'bed-gamer', name: 'Gamer Setup Bed', emoji: '🎮', cost: 220, category: 'comfort' },
  { id: 'bed-princess', name: 'Princess Bed', emoji: '👸', cost: 240, category: 'comfort' },
  { id: 'bed-space', name: 'Space Explorer', emoji: '🚀', cost: 230, category: 'comfort' },
  
  // Decor
  { id: 'clock', name: 'Wall Clock', emoji: '🕰️', cost: 70, category: 'decor' },
  { id: 'sofa', name: 'Cozy Sofa', emoji: '🛋️', cost: 180, category: 'decor' },
  { id: 'neon-sign', name: 'Neon Sign', emoji: '✨', cost: 200, category: 'decor' },
  { id: 'cat-bed', name: 'Cat Bed', emoji: '🐾', cost: 220, category: 'decor' },
  
  // Matching decor for bed themes
  { id: 'decor-fairy-lights', name: 'Fairy Lights', emoji: '💫', cost: 45, category: 'decor' },
  { id: 'decor-dreamcatcher', name: 'Dreamcatcher', emoji: '🪶', cost: 55, category: 'decor' },
  { id: 'decor-galaxy-lamp', name: 'Galaxy Lamp', emoji: '🔮', cost: 85, category: 'decor' },
  { id: 'decor-heart-pillow', name: 'Heart Pillow', emoji: '💕', cost: 40, category: 'decor' },
  { id: 'decor-sports-trophy', name: 'Sports Trophy', emoji: '🏅', cost: 65, category: 'decor' },
  { id: 'decor-gaming-chair', name: 'Gaming Chair', emoji: '🎯', cost: 95, category: 'decor' },
  { id: 'decor-crown', name: 'Wall Crown', emoji: '👑', cost: 75, category: 'decor' },
  { id: 'decor-stars', name: 'Star Garland', emoji: '⭐', cost: 50, category: 'decor' },
  
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

// Seasonal items - rotate based on time of year
export const SEASONAL_ITEMS: RoomItem[] = [
  // Winter Cozy ❄️ (Dec-Feb)
  { id: 'winter-fireplace', name: 'Cozy Fireplace', emoji: '🔥', cost: 120, category: 'seasonal', season: 'winter' },
  { id: 'winter-hot-cocoa', name: 'Hot Cocoa', emoji: '☕', cost: 45, category: 'seasonal', season: 'winter' },
  { id: 'winter-snowglobe', name: 'Snow Globe', emoji: '🔮', cost: 80, category: 'seasonal', season: 'winter' },
  { id: 'winter-blanket', name: 'Fuzzy Blanket', emoji: '🧣', cost: 55, category: 'seasonal', season: 'winter' },
  { id: 'winter-tree', name: 'Holiday Tree', emoji: '🎄', cost: 150, category: 'seasonal', season: 'winter' },
  { id: 'winter-candles', name: 'Warm Candles', emoji: '🕯️', cost: 35, category: 'seasonal', season: 'winter' },
  
  // Spring Bloom 🌸 (Mar-May)
  { id: 'spring-flowers', name: 'Cherry Blossoms', emoji: '🌸', cost: 60, category: 'seasonal', season: 'spring' },
  { id: 'spring-butterfly', name: 'Butterfly Garden', emoji: '🦋', cost: 85, category: 'seasonal', season: 'spring' },
  { id: 'spring-bunny', name: 'Bunny Plush', emoji: '🐰', cost: 70, category: 'seasonal', season: 'spring' },
  { id: 'spring-eggs', name: 'Painted Eggs', emoji: '🥚', cost: 40, category: 'seasonal', season: 'spring' },
  { id: 'spring-tulips', name: 'Tulip Vase', emoji: '🌷', cost: 50, category: 'seasonal', season: 'spring' },
  { id: 'spring-rainbow', name: 'Rainbow Decal', emoji: '🌈', cost: 95, category: 'seasonal', season: 'spring' },
  
  // Summer Vibes ☀️ (Jun-Aug)
  { id: 'summer-beach', name: 'Beach Ball', emoji: '🏖️', cost: 45, category: 'seasonal', season: 'summer' },
  { id: 'summer-lemonade', name: 'Lemonade Stand', emoji: '🍋', cost: 75, category: 'seasonal', season: 'summer' },
  { id: 'summer-palm', name: 'Mini Palm', emoji: '🌴', cost: 90, category: 'seasonal', season: 'summer' },
  { id: 'summer-sunflower', name: 'Sunflower Pot', emoji: '🌻', cost: 55, category: 'seasonal', season: 'summer' },
  { id: 'summer-hammock', name: 'Cozy Hammock', emoji: '🏝️', cost: 130, category: 'seasonal', season: 'summer' },
  { id: 'summer-icecream', name: 'Ice Cream Cone', emoji: '🍦', cost: 35, category: 'seasonal', season: 'summer' },
  
  // Autumn Harvest 🍂 (Sep-Nov)
  { id: 'autumn-pumpkin', name: 'Pumpkin Patch', emoji: '🎃', cost: 65, category: 'seasonal', season: 'autumn' },
  { id: 'autumn-leaves', name: 'Leaf Pile', emoji: '🍁', cost: 40, category: 'seasonal', season: 'autumn' },
  { id: 'autumn-pie', name: 'Warm Pie', emoji: '🥧', cost: 50, category: 'seasonal', season: 'autumn' },
  { id: 'autumn-sweater', name: 'Cozy Sweater', emoji: '🧥', cost: 70, category: 'seasonal', season: 'autumn' },
  { id: 'autumn-acorn', name: 'Acorn Basket', emoji: '🌰', cost: 35, category: 'seasonal', season: 'autumn' },
  { id: 'autumn-crow', name: 'Friendly Crow', emoji: '🐦‍⬛', cost: 85, category: 'seasonal', season: 'autumn' },
];

// Combined items for shop
export function getAvailableShopItems(): RoomItem[] {
  const currentSeason = getCurrentSeason();
  const seasonalForNow = SEASONAL_ITEMS.filter(item => item.season === currentSeason);
  return [...SHOP_ITEMS, ...seasonalForNow];
}

export const GRID_SIZE = 16; // 4x4 grid
export const GRID_COLS = 4;

// Points configuration
export const POINTS_CONFIG = {
  BASE_SESSION: 10,
  REFLECTION_BONUS: 2,
  FIRST_OF_DAY_BONUS: 5,
};
