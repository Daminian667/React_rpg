// Defines the structured data we expect from Gemini
export enum GamePhase {
  START = 'start',
  GENDER_SELECTION = 'gender_selection',
  CLASS_SELECTION = 'class_selection',
  GAME_LOOP = 'game_loop',
  GAME_OVER = 'game_over'
}

export interface GameState {
  phase: GamePhase;
  userId: string;
  name: string;
  gender: string;
  location: string;
  class?: string; // e.g. "Warrior", "Mage"
  
  // Vitals
  hp: number;
  maxHp: number;
  level: number;
  xp: number;

  // Primary Stats
  strength: number;
  agility: number;
  intelligence: number;

  inventory: string[];
  isGameOver: boolean;
  statusEffects: string[];
}

export interface RPGResponse {
  narrative: string;
  state: GameState;
  suggestedActions: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  // If the message is from the assistant, it might include the state snapshot at that time
  gameState?: GameState;
  suggestions?: string[];
}