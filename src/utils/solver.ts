export type Grid = boolean[];
export type Position = [x: number, y: number];

export interface Piece {
  id: number;
  pattern: boolean[];
}

export interface SolutionStep {
  pieceId: number;
  position: Position;
  intermediateGrid: Grid;
  resultingGrid: Grid;
  score: number;
  clearedLines: {
    rows: number[];
    cols: number[];
  };
}

const GRID_SIZE = 8;

const canPlacePiece = (grid: Grid, piece: Piece, pos: Position) => {
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const pieceIdx = y * 5 + x;
      const gridIdx = (pos[1] + y) * GRID_SIZE + (pos[0] + x);

      if (
        piece.pattern[pieceIdx] &&
        (pos[1] + y >= GRID_SIZE || pos[0] + x >= GRID_SIZE || grid[gridIdx])
      ) {
        return false;
      }
    }
  }
  return true;
};

const placePiece = (grid: Grid, piece: Piece, pos: Position) => {
  const newGrid = [...grid];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const pieceIdx = y * 5 + x;
      const gridIdx = (pos[1] + y) * GRID_SIZE + (pos[0] + x);
      if (piece.pattern[pieceIdx]) {
        newGrid[gridIdx] = true;
      }
    }
  }
  return newGrid;
};

const calculateClears = (grid: Grid) => {
  const rows: number[] = [];
  const cols: number[] = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    if (
      Array.from({ length: GRID_SIZE }).every((_, x) => grid[y * GRID_SIZE + x])
    ) {
      rows.push(y);
    }
  }

  for (let x = 0; x < GRID_SIZE; x++) {
    if (
      Array.from({ length: GRID_SIZE }).every((_, y) => grid[y * GRID_SIZE + x])
    ) {
      cols.push(x);
    }
  }

  return { rows, cols };
};

const applyClears = (
  grid: Grid,
  clears: { rows: number[]; cols: number[] },
) => {
  const newGrid = [...grid];

  for (const row of clears.rows) {
    for (let x = 0; x < GRID_SIZE; x++) {
      newGrid[row * GRID_SIZE + x] = false;
    }
  }

  for (const col of clears.cols) {
    for (let y = 0; y < GRID_SIZE; y++) {
      newGrid[y * GRID_SIZE + col] = false;
    }
  }

  return newGrid;
};

const countPieceSquares = (piece: Piece) =>
  piece.pattern.filter(Boolean).length;

const calculateScore = (
  clears: { rows: number[]; cols: number[] },
  pieceSquares: number,
) => {
  const totalLines = clears.rows.length + clears.cols.length;
  const baseScore = pieceSquares;

  if (totalLines === 0) return baseScore;

  const comboMultiplier = totalLines === 1 ? 1 : totalLines === 2 ? 1.5 : 2;
  const lineScore = totalLines * 100 * comboMultiplier;

  return Math.floor(baseScore + lineScore);
};

const countMissingInLine = (grid: Grid, lineIndex: number, isRow: boolean) => {
  let missing = 0;
  for (let i = 0; i < GRID_SIZE; i++) {
    const idx = isRow ? lineIndex * GRID_SIZE + i : i * GRID_SIZE + lineIndex;
    if (!grid[idx]) missing++;
  }
  return missing;
};

const findPotentialLines = (grid: Grid) => {
  const rows: { index: number; missing: number }[] = [];
  const cols: { index: number; missing: number }[] = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    const missing = countMissingInLine(grid, y, true);
    if (missing > 0 && missing <= 5) {
      rows.push({ index: y, missing });
    }
  }

  for (let x = 0; x < GRID_SIZE; x++) {
    const missing = countMissingInLine(grid, x, false);
    if (missing > 0 && missing <= 5) {
      cols.push({ index: x, missing });
    }
  }

  return { rows, cols };
};

const calculateLineCompletionScore = (
  grid: Grid,
  piece: Piece,
  pos: Position,
) => {
  const potentialLines = findPotentialLines(grid);
  let completionScore = 0;

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (!piece.pattern[y * 5 + x]) continue;

      const gridY = pos[1] + y;
      const gridX = pos[0] + x;
      if (gridY >= GRID_SIZE || gridX >= GRID_SIZE) continue;

      const rowInfo = potentialLines.rows.find((r) => r.index === gridY);
      if (rowInfo) completionScore += (GRID_SIZE - rowInfo.missing + 1) * 50;

      const colInfo = potentialLines.cols.find((c) => c.index === gridX);
      if (colInfo) completionScore += (GRID_SIZE - colInfo.missing + 1) * 50;
    }
  }

  return completionScore;
};

const tryPlacement = (grid: Grid, piece: Piece, pos: Position) => {
  if (!canPlacePiece(grid, piece, pos)) return null;

  const intermediateGrid = placePiece(grid, piece, pos);
  const clears = calculateClears(intermediateGrid);
  const pieceSquares = countPieceSquares(piece);

  const completionScore = calculateLineCompletionScore(grid, piece, pos);
  const baseScore = calculateScore(clears, pieceSquares);
  const totalScore = baseScore + completionScore;

  const finalGrid = applyClears(intermediateGrid, clears);

  return {
    pieceId: piece.id,
    position: pos,
    intermediateGrid,
    resultingGrid: finalGrid,
    score: totalScore,
    clearedLines: clears,
  };
};

const hasLineClears = (grid: Grid) => {
  const clears = calculateClears(grid);
  return clears.rows.length > 0 || clears.cols.length > 0;
};

const findAllValidPlacements = (grid: Grid, piece: Piece) => {
  const placements: SolutionStep[] = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const step = tryPlacement(grid, piece, [x, y]);
      if (step) {
        placements.push(step);
      }
    }
  }

  return placements;
};

const permutations = <T>(items: T[]): T[][] =>
  items.length === 0
    ? [[]]
    : items.flatMap((item, i) =>
        permutations([...items.slice(0, i), ...items.slice(i + 1)]).map(
          (perm) => [item, ...perm],
        ),
      );

export const solve = (initialGrid: Grid, pieces: Piece[]): SolutionStep[] => {
  if (pieces.length === 0) return [];
  if (hasLineClears(initialGrid)) {
    const clears = calculateClears(initialGrid);
    const clearedGrid = applyClears(initialGrid, clears);
    return solve(clearedGrid, pieces);
  }

  const tryWithPieces = (
    currentGrid: Grid,
    remainingPieces: Piece[],
  ): SolutionStep[] | null => {
    if (remainingPieces.length === 0) return [];

    const currentPiece = remainingPieces[0];
    const placements = findAllValidPlacements(currentGrid, currentPiece);

    placements.sort((a, b) => b.score - a.score);

    for (const placement of placements) {
      const nextGrid = hasLineClears(placement.intermediateGrid)
        ? placement.resultingGrid
        : placement.intermediateGrid;

      const remainingSolution = tryWithPieces(
        nextGrid,
        remainingPieces.slice(1),
      );

      if (remainingSolution !== null) {
        return [placement, ...remainingSolution];
      }
    }

    return null;
  };

  const piecePermutations = permutations(pieces);
  let bestSolution: SolutionStep[] | null = null;
  let bestScore = -1;

  for (const piecePerm of piecePermutations) {
    const solution = tryWithPieces(initialGrid, piecePerm);
    if (solution) {
      const totalScore = solution.reduce((sum, step) => sum + step.score, 0);
      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestSolution = solution;
      }
    }
  }

  if (!bestSolution) throw new Error("No solution found");
  return bestSolution;
};
