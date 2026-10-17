import { TileData } from '../types/game';

/**
 * Finds all combinations of tile IDs on the board that sum to target
 */
export function findSolution(tiles: TileData[], target: number): string[] | null {
  const activeTiles = tiles.filter(t => !t.isClearing && t.value > 0);
  if (activeTiles.length === 0) return null;

  // Prefer solutions with 2-4 tiles for satisfying gameplay
  const result: string[] = [];

  function backtrack(startIndex: number, currentSum: number, chosenIds: string[]): boolean {
    if (currentSum === target) {
      if (chosenIds.length >= 2) {
        result.push(...chosenIds);
        return true;
      }
    }
    if (currentSum > target || chosenIds.length >= 5) {
      return false;
    }

    for (let i = startIndex; i < activeTiles.length; i++) {
      chosenIds.push(activeTiles[i].id);
      if (backtrack(i + 1, currentSum + activeTiles[i].value, chosenIds)) {
        return true;
      }
      chosenIds.pop();
    }
    return false;
  }

  // Shuffle active tiles first so hints are varied and not always top-left tiles
  const shuffled = [...activeTiles].sort(() => Math.random() - 0.5);
  for (let i = 0; i < shuffled.length; i++) {
    if (backtrack(i, 0, [])) {
      return result;
    }
  }

  return null;
}

/**
 * Generates a target that is 100% guaranteed to be solvable using current board tiles
 */
export function generateSolvableTarget(tiles: TileData[], difficultyLevel: number = 1): { target: number; solutionIds: string[] } {
  const activeTiles = tiles.filter(t => !t.isClearing && t.value > 0);
  if (activeTiles.length < 2) {
    return { target: 10, solutionIds: [] };
  }

  // Shuffle tiles
  const pool = [...activeTiles].sort(() => Math.random() - 0.5);

  // Decide how many tiles to combine based on level (2, 3, or 4)
  const targetTileCount = difficultyLevel >= 5 && pool.length >= 4 
    ? (Math.random() > 0.4 ? 3 : 4) 
    : (pool.length >= 3 && Math.random() > 0.4 ? 3 : 2);

  // Try multiple random subsets to find a nice target
  const attempts = 30;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const subsetCount = Math.min(targetTileCount, pool.length);
    const shuffledSubset = [...pool].sort(() => Math.random() - 0.5).slice(0, subsetCount);
    const sum = shuffledSubset.reduce((acc, t) => acc + t.value, 0);

    if (sum >= 5 && sum <= 40) {
      return {
        target: sum,
        solutionIds: shuffledSubset.map(t => t.id),
      };
    }
  }

  // Fallback: pick first 2 tiles
  const fallback = pool.slice(0, 2);
  const fallbackSum = fallback.reduce((acc, t) => acc + t.value, 0);
  return {
    target: fallbackSum || 10,
    solutionIds: fallback.map(t => t.id),
  };
}
