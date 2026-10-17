export type GameMode = 'classic' | 'time';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'game_over';

export interface TileData {
  id: string;
  value: number;
  row: number;
  col: number;
  isSpecial?: 'bomb' | 'multiplier' | 'freeze';
  isHinted?: boolean;
  isClearing?: boolean;
}

export interface MoveStep {
  tileId: string;
  value: number;
}

export interface GameStats {
  score: number;
  highScoreClassic: number;
  highScoreTime: number;
  clearedSetsCount: number;
  maxCombo: number;
  highestSingleSum: number;
  gamesPlayed: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  scale?: number;
}
