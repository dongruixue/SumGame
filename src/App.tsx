/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameMode, GameStatus, TileData, MoveStep, GameStats, FloatingText } from './types/game';
import { sound } from './utils/audio';
import { generateSolvableTarget, findSolution } from './utils/solver';
import { TopBar } from './components/TopBar';
import { HeaderHUD } from './components/HeaderHUD';
import { GameBoard } from './components/GameBoard';
import { ControlsBar } from './components/ControlsBar';
import { GameOverModal } from './components/GameOverModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { StatsModal } from './components/StatsModal';
import { ParticlesOverlay } from './components/ParticlesOverlay';

const ROWS = 8;
const COLS = 6;
const TIME_LIMIT = 10; // seconds for time mode

export default function App() {
  // Game Setup & State
  const [mode, setMode] = useState<GameMode>('classic');
  const [status, setStatus] = useState<GameStatus>('playing');
  const [tiles, setTiles] = useState<(TileData | null)[][]>([]);
  const [selectedSteps, setSelectedSteps] = useState<MoveStep[]>([]);
  const [target, setTarget] = useState<number>(10);
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [combo, setCombo] = useState<number>(0);
  const [hintsLeft, setHintsLeft] = useState<number>(3);
  const [bombCharge, setBombCharge] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Modals
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState<boolean>(false);
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);
  const [sessionClears, setSessionClears] = useState<number>(0);
  const [sessionMaxCombo, setSessionMaxCombo] = useState<number>(1);

  // Lifetime Stats in LocalStorage
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem('sumdrop_stats');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      score: 0,
      highScoreClassic: 0,
      highScoreTime: 0,
      clearedSetsCount: 0,
      maxCombo: 0,
      highestSingleSum: 0,
      gamesPlayed: 0,
    };
  });

  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Spawn floating text
  const addFloatingText = useCallback((text: string, x: number, y: number, color: string = '#f59e0b', scale: number = 1) => {
    const id = `float-${Date.now()}-${Math.random()}`;
    setFloatingTexts(prev => [...prev, { id, text, x, y, color, scale }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 800);
  }, []);

  // Helper: Get flat list of active tiles
  const getFlatActiveTiles = useCallback((board: (TileData | null)[][]): TileData[] => {
    const list: TileData[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const t = board[r]?.[c];
        if (t && !t.isClearing) list.push(t);
      }
    }
    return list;
  }, []);

  // Helper: Gravity drop
  const applyGravity = useCallback((board: (TileData | null)[][]): (TileData | null)[][] => {
    const nextBoard: (TileData | null)[][] = Array.from({ length: ROWS }, () =>
      Array(COLS).fill(null)
    );

    for (let c = 0; c < COLS; c++) {
      const colTiles: TileData[] = [];
      for (let r = ROWS - 1; r >= 0; r--) {
        const t = board[r][c];
        if (t && !t.isClearing) {
          colTiles.push(t);
        }
      }
      for (let i = 0; i < colTiles.length; i++) {
        const targetRow = ROWS - 1 - i;
        const originalTile = colTiles[i];
        nextBoard[targetRow][c] = {
          ...originalTile,
          row: targetRow,
          col: c,
          isHinted: false,
          isClearing: false,
        };
      }
    }
    return nextBoard;
  }, []);

  // Helper: Push row from bottom
  const pushRowFromBottom = useCallback((board: (TileData | null)[][]): {
    nextBoard: (TileData | null)[][];
    isGameOver: boolean;
  } => {
    // If any tile occupies Row 0, pushing up causes ceiling breach
    let breaches = false;
    for (let c = 0; c < COLS; c++) {
      if (board[0]?.[c] !== null) {
        breaches = true;
        break;
      }
    }

    if (breaches) {
      return { nextBoard: board, isGameOver: true };
    }

    const nextBoard: (TileData | null)[][] = Array.from({ length: ROWS }, () =>
      Array(COLS).fill(null)
    );

    // Shift existing tiles up by 1 row
    for (let r = 1; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const t = board[r][c];
        if (t) {
          nextBoard[r - 1][c] = {
            ...t,
            row: r - 1,
            col: c,
          };
        }
      }
    }

    // Generate new random tiles for the bottom row (ROWS - 1)
    for (let c = 0; c < COLS; c++) {
      const val = Math.floor(Math.random() * 9) + 1;
      const specialRand = Math.random();
      let isSpecial: TileData['isSpecial'] = undefined;
      if (specialRand < 0.05) isSpecial = 'bomb';
      else if (specialRand < 0.1) isSpecial = 'multiplier';

      nextBoard[ROWS - 1][c] = {
        id: `tile-${Date.now()}-${c}-${Math.random().toString(36).substring(2, 6)}`,
        value: val,
        row: ROWS - 1,
        col: c,
        isSpecial,
      };
    }

    sound.playRowPush();
    return { nextBoard, isGameOver: false };
  }, []);

  // Initialize a fresh game board
  const initializeGame = useCallback((targetMode: GameMode = mode) => {
    const newBoard: (TileData | null)[][] = Array.from({ length: ROWS }, () =>
      Array(COLS).fill(null)
    );

    // Fill bottom 4 rows (rows 4, 5, 6, 7)
    for (let r = 4; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const val = Math.floor(Math.random() * 9) + 1;
        const specialRand = Math.random();
        let isSpecial: TileData['isSpecial'] = undefined;
        if (specialRand < 0.04) isSpecial = 'bomb';
        else if (specialRand < 0.08) isSpecial = 'multiplier';

        newBoard[r][c] = {
          id: `init-${r}-${c}-${Math.random().toString(36).substring(2, 6)}`,
          value: val,
          row: r,
          col: c,
          isSpecial,
        };
      }
    }

    // Generate initial solvable target
    const flatList = getFlatActiveTiles(newBoard);
    const { target: newTarget } = generateSolvableTarget(flatList, 1);

    setTiles(newBoard);
    setTarget(newTarget);
    setSelectedSteps([]);
    setScore(0);
    setLevel(1);
    setCombo(0);
    setHintsLeft(3);
    setBombCharge(0);
    setTimeLeft(TIME_LIMIT);
    setStatus('playing');
    setIsGameOverOpen(false);
    setIsNewHigh(false);
    setSessionClears(0);
    setSessionMaxCombo(1);

    // Increment games played
    setStats(prev => {
      const updated = { ...prev, gamesPlayed: prev.gamesPlayed + 1 };
      localStorage.setItem('sumdrop_stats', JSON.stringify(updated));
      return updated;
    });
  }, [mode, getFlatActiveTiles]);

  // Start initial board on mount
  useEffect(() => {
    initializeGame(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check ceiling danger
  const isNearDanger = tiles[1]?.some(t => t !== null) ?? false;
  const isCriticalDanger = tiles[0]?.some(t => t !== null) ?? false;

  // Sound warning effect when entering danger
  useEffect(() => {
    if (status === 'playing' && isCriticalDanger) {
      sound.playDangerWarning();
    }
  }, [isCriticalDanger, status]);

  // Handle Game Over
  const triggerGameOver = useCallback(() => {
    setStatus('game_over');
    sound.playGameOver();
    setIsGameOverOpen(true);

    // Check if new high score
    const currentHigh = mode === 'classic' ? stats.highScoreClassic : stats.highScoreTime;
    const isNew = score > currentHigh;
    setIsNewHigh(isNew);

    setStats(prev => {
      const updated: GameStats = {
        ...prev,
        highScoreClassic: mode === 'classic' ? Math.max(prev.highScoreClassic, score) : prev.highScoreClassic,
        highScoreTime: mode === 'time' ? Math.max(prev.highScoreTime, score) : prev.highScoreTime,
        maxCombo: Math.max(prev.maxCombo, sessionMaxCombo),
        clearedSetsCount: prev.clearedSetsCount + sessionClears,
      };
      localStorage.setItem('sumdrop_stats', JSON.stringify(updated));
      return updated;
    });
  }, [mode, score, stats.highScoreClassic, stats.highScoreTime, sessionClears, sessionMaxCombo]);

  // Timer loop for Time Mode
  useEffect(() => {
    if (mode !== 'time' || status !== 'playing') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          // Time expired! Forced push row, no score awarded for this round
          setTiles(currentTiles => {
            const { nextBoard, isGameOver } = pushRowFromBottom(currentTiles);
            if (isGameOver) {
              setTimeout(() => triggerGameOver(), 100);
              return currentTiles;
            }

            // Regenerate solvable target
            const activeTiles = getFlatActiveTiles(nextBoard);
            const { target: freshTarget } = generateSolvableTarget(activeTiles, level);
            setTarget(freshTarget);
            setSelectedSteps([]);

            addFloatingText('超时增行!', window.innerWidth / 2 - 40, window.innerHeight / 2, '#f43f5e', 1.1);
            return nextBoard;
          });

          // Reset timer
          return TIME_LIMIT;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [mode, status, pushRowFromBottom, getFlatActiveTiles, level, addFloatingText, triggerGameOver]);

  // Current Sum calculation
  const currentSum = selectedSteps.reduce((acc, s) => acc + s.value, 0);
  const selectedTileIds = new Set(selectedSteps.map(s => s.tileId));

  // Handle Tile Selection Click
  const handleTileClick = useCallback((tile: TileData) => {
    if (status !== 'playing' || tile.isClearing) return;

    // Check if already selected -> unselect
    if (selectedTileIds.has(tile.id)) {
      setSelectedSteps(prev => prev.filter(s => s.tileId !== tile.id));
      sound.playDeselect();
      return;
    }

    // Add to selected
    const nextSteps = [...selectedSteps, { tileId: tile.id, value: tile.value }];
    const nextSum = nextSteps.reduce((acc, s) => acc + s.value, 0);
    setSelectedSteps(nextSteps);
    sound.playSelect(nextSteps.length - 1);

    // Check if over target
    if (nextSum > target) {
      sound.playOverLimit();
      if (navigator.vibrate) navigator.vibrate(50);
      return;
    }

    // Check if EXACT MATCH!
    if (nextSum === target) {
      const matchTileIds = new Set(nextSteps.map(s => s.tileId));

      // Calculate score and bonuses
      const tileCount = nextSteps.length;
      const countBonus = tileCount >= 3 ? (tileCount - 2) * 50 : 0;
      
      // Check special multiplier tiles in selection
      let multiplier = 1;
      let hasBombTile = false;
      let hasFreezeTile = false;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const t = tiles[r]?.[c];
          if (t && matchTileIds.has(t.id)) {
            if (t.isSpecial === 'multiplier') multiplier *= 2;
            if (t.isSpecial === 'bomb') hasBombTile = true;
            if (t.isSpecial === 'freeze') hasFreezeTile = true;
          }
        }
      }

      // Combo management
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setSessionMaxCombo(prev => Math.max(prev, nextCombo));

      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => {
        setCombo(0);
      }, 4000); // 4-second combo window

      const comboMultiplier = 1 + (nextCombo - 1) * 0.3;
      const basePoints = target * 10;
      const earnedScore = Math.round((basePoints + countBonus) * multiplier * comboMultiplier);

      setScore(prev => prev + earnedScore);
      setSessionClears(prev => prev + 1);
      setLevel(prev => Math.floor((score + earnedScore) / 1000) + 1);
      setBombCharge(prev => Math.min(100, prev + 25));

      // Audio & Haptics
      sound.playMatchSuccess();
      if (nextCombo > 1) {
        sound.playCombo(nextCombo);
      }
      if (navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }

      // Visual floating score
      addFloatingText(
        `+${earnedScore}${nextCombo > 1 ? ` (${nextCombo}x)` : ''}`,
        window.innerWidth / 2 - 30,
        window.innerHeight / 2 - 50,
        '#fbbf24',
        nextCombo > 1 ? 1.2 : 1
      );

      // Phase 1: Mark tiles as clearing (animation)
      setTiles(currentTiles => {
        return currentTiles.map(row =>
          row.map(t => {
            if (t && matchTileIds.has(t.id)) {
              return { ...t, isClearing: true };
            }
            return t;
          })
        );
      });

      // Phase 2: After 180ms animation, apply gravity and mode-specific row push
      setTimeout(() => {
        setTiles(currentTiles => {
          // Drop tiles
          let boardAfterGravity = applyGravity(currentTiles);

          // If bomb tile was in match, eliminate an extra row or surrounding
          if (hasBombTile) {
            sound.playBomb();
            // Clear top row of tiles
            for (let r = 0; r < ROWS; r++) {
              if (boardAfterGravity[r].some(t => t !== null)) {
                for (let c = 0; c < COLS; c++) {
                  boardAfterGravity[r][c] = null;
                }
                boardAfterGravity = applyGravity(boardAfterGravity);
                break;
              }
            }
          }

          let finalBoard = boardAfterGravity;

          // In Classic Mode: Push a row from bottom after each successful clear!
          if (mode === 'classic') {
            const { nextBoard, isGameOver } = pushRowFromBottom(boardAfterGravity);
            if (isGameOver) {
              setTimeout(() => triggerGameOver(), 100);
              return currentTiles;
            }
            finalBoard = nextBoard;
          } else if (mode === 'time') {
            // In Time Mode: reset timer and add freeze bonus if applicable
            setTimeLeft(TIME_LIMIT + (hasFreezeTile ? 4 : 0));
          }

          // Check if board is completely cleared (rare brilliant wipeout!)
          const activeTiles = getFlatActiveTiles(finalBoard);
          if (activeTiles.length < 3) {
            // Auto add 2 rows so player can continue smoothly
            const res1 = pushRowFromBottom(finalBoard);
            const res2 = pushRowFromBottom(res1.nextBoard);
            finalBoard = res2.nextBoard;
          }

          // Generate next guaranteed solvable target
          const remainingFlat = getFlatActiveTiles(finalBoard);
          const { target: freshTarget } = generateSolvableTarget(remainingFlat, level);
          setTarget(freshTarget);

          return finalBoard;
        });

        setSelectedSteps([]);
      }, 190);
    }
  }, [
    status,
    selectedTileIds,
    selectedSteps,
    target,
    combo,
    score,
    level,
    tiles,
    mode,
    applyGravity,
    pushRowFromBottom,
    getFlatActiveTiles,
    triggerGameOver,
    addFloatingText,
  ]);

  // Skill: Use Hint
  const handleUseHint = useCallback(() => {
    if (hintsLeft <= 0 || status !== 'playing') return;

    const flat = getFlatActiveTiles(tiles);
    const solutionIds = findSolution(flat, target);

    if (solutionIds && solutionIds.length > 0) {
      setHintsLeft(prev => prev - 1);
      sound.playSelect(2);

      const solSet = new Set(solutionIds);
      setTiles(prev =>
        prev.map(row =>
          row.map(t => {
            if (!t) return null;
            return { ...t, isHinted: solSet.has(t.id) };
          })
        )
      );

      addFloatingText('方案已高亮!', window.innerWidth / 2 - 40, window.innerHeight / 2, '#38bdf8');
    } else {
      // Re-generate solvable target if board somehow shifted
      const { target: freshTarget } = generateSolvableTarget(flat, level);
      setTarget(freshTarget);
      addFloatingText('已刷新新目标!', window.innerWidth / 2 - 40, window.innerHeight / 2, '#38bdf8');
    }
  }, [hintsLeft, status, tiles, target, level, getFlatActiveTiles, addFloatingText]);

  // Skill: Use Bomb Rescue
  const handleUseBomb = useCallback(() => {
    if (bombCharge < 100 || status !== 'playing') return;

    setBombCharge(0);
    sound.playBomb();
    if (navigator.vibrate) navigator.vibrate([80, 50, 80]);

    setTiles(currentTiles => {
      // Find the topmost occupied row and clear it
      let rowToClear = -1;
      for (let r = 0; r < ROWS; r++) {
        if (currentTiles[r].some(t => t !== null)) {
          rowToClear = r;
          break;
        }
      }

      if (rowToClear !== -1) {
        const boardWithCleared = currentTiles.map((row, r) =>
          r === rowToClear ? row.map(() => null) : row
        );
        const nextBoard = applyGravity(boardWithCleared);

        // Regenerate solvable target
        const flat = getFlatActiveTiles(nextBoard);
        const { target: freshTarget } = generateSolvableTarget(flat, level);
        setTarget(freshTarget);
        setSelectedSteps([]);

        addFloatingText('💥 炸弹消除顶行!', window.innerWidth / 2 - 60, window.innerHeight / 2, '#f43f5e', 1.2);
        return nextBoard;
      }
      return currentTiles;
    });
  }, [bombCharge, status, applyGravity, getFlatActiveTiles, level, addFloatingText]);

  // Manual Push Row
  const handleManualPushRow = useCallback(() => {
    if (status !== 'playing') return;

    setTiles(currentTiles => {
      const { nextBoard, isGameOver } = pushRowFromBottom(currentTiles);
      if (isGameOver) {
        setTimeout(() => triggerGameOver(), 100);
        return currentTiles;
      }

      // Re-evaluate target
      const flat = getFlatActiveTiles(nextBoard);
      const { target: freshTarget } = generateSolvableTarget(flat, level);
      setTarget(freshTarget);

      addFloatingText('+1 行', window.innerWidth / 2 - 20, window.innerHeight / 2, '#cbd5e1');
      return nextBoard;
    });
  }, [status, pushRowFromBottom, triggerGameOver, getFlatActiveTiles, level, addFloatingText]);

  // Clear current selection
  const handleClearSelection = useCallback(() => {
    if (selectedSteps.length > 0) {
      setSelectedSteps([]);
      sound.playDeselect();
    }
  }, [selectedSteps.length]);

  // Switch Mode
  const handleSelectMode = useCallback((newMode: GameMode) => {
    if (newMode !== mode) {
      setMode(newMode);
      initializeGame(newMode);
    }
  }, [mode, initializeGame]);

  // Sound toggle
  const handleToggleSound = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClearSelection();
      } else if (e.key === 'h' || e.key === 'H') {
        handleUseHint();
      } else if (e.key === 'b' || e.key === 'B') {
        handleUseBomb();
      } else if (e.key === 'r' || e.key === 'R') {
        initializeGame(mode);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClearSelection, handleUseHint, handleUseBomb, initializeGame, mode]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Visual floating text / combos overlay */}
      <ParticlesOverlay floatingTexts={floatingTexts} />

      {/* Top Bar Contract (Wordmark, Nav / Modes, Primary Actions) */}
      <TopBar
        mode={mode}
        onSelectMode={handleSelectMode}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onRestart={() => initializeGame(mode)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      {/* Main Game Arena */}
      <main className="flex-1 flex flex-col justify-between py-1 max-w-2xl mx-auto w-full">
        {/* HUD: Target, Formula, Score, Countdown */}
        <HeaderHUD
          mode={mode}
          target={target}
          selectedSteps={selectedSteps}
          currentSum={currentSum}
          score={score}
          highScore={mode === 'classic' ? stats.highScoreClassic : stats.highScoreTime}
          level={level}
          combo={combo}
          timeLeft={timeLeft}
          maxTime={TIME_LIMIT}
          isNearDanger={isNearDanger}
          onClearSelection={handleClearSelection}
        />

        {/* Tactile Game Board with Ceiling Hazard */}
        <GameBoard
          rows={ROWS}
          cols={COLS}
          tiles={tiles}
          selectedTileIds={selectedTileIds}
          onTileClick={handleTileClick}
          isNearDanger={isNearDanger}
          isCriticalDanger={isCriticalDanger}
        />

        {/* Action Controls & Assistance Skills */}
        <ControlsBar
          hintsLeft={hintsLeft}
          onUseHint={handleUseHint}
          bombCharge={bombCharge}
          onUseBomb={handleUseBomb}
          onManualPushRow={handleManualPushRow}
          hasSelected={selectedSteps.length > 0}
          onClearSelection={handleClearSelection}
        />
      </main>

      {/* Footer info: Quiet & Elegant */}
      <footer className="w-full py-2 px-4 text-center text-[11px] text-slate-600 border-t border-slate-900 flex items-center justify-center gap-3">
        <span>键盘快捷键：Esc 取消选择 · H 提示 · B 炸弹 · R 重开</span>
        <span aria-hidden="true">·</span>
        <span>SumDrop 数学消除益智</span>
      </footer>

      {/* Modals */}
      <GameOverModal
        isOpen={isGameOverOpen}
        score={score}
        highScore={mode === 'classic' ? stats.highScoreClassic : stats.highScoreTime}
        isNewHigh={isNewHigh}
        clearedCount={sessionClears}
        maxCombo={sessionMaxCombo}
        mode={mode}
        onPlayAgain={() => initializeGame(mode)}
        onSwitchMode={(newMode) => {
          setMode(newMode);
          initializeGame(newMode);
        }}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onResetStats={() => {
          const freshStats: GameStats = {
            score: 0,
            highScoreClassic: 0,
            highScoreTime: 0,
            clearedSetsCount: 0,
            maxCombo: 0,
            highestSingleSum: 0,
            gamesPlayed: 0,
          };
          setStats(freshStats);
          localStorage.setItem('sumdrop_stats', JSON.stringify(freshStats));
        }}
      />
    </div>
  );
}
