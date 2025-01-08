import { useState, useEffect } from "preact/hooks";
import PieceSelector from "./PieceSelector";
import SolverSteps from "./SolverSteps";
import { useGrid } from "../hooks/useGrid";
import { Grid } from "./Grid";
import {
  solve,
  type Grid as GridType,
  type Piece,
  type SolutionStep,
} from "../utils/solver";

const GRID_SIZE = 8;

interface Props {
  initialGrid?: GridType;
}

export default function GameGrid({ initialGrid }: Props) {
  const { grid, setGrid, handleMouseDown, handleMouseEnter } = useGrid(
    initialGrid || new Array(GRID_SIZE * GRID_SIZE).fill(false),
  );

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [solution, setSolution] = useState<SolutionStep[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handlePieceChange = (piece: Piece) => {
    setPieces((current) => {
      const newPieces = [...current];
      const index = newPieces.findIndex((p) => p.id === piece.id);

      if (index >= 0) {
        newPieces[index] = piece;
      } else {
        newPieces.push(piece);
      }

      return newPieces;
    });
  };

  const handleSolve = () => {
    setError(null);
    try {
      const steps = solve(grid, pieces);
      if (!steps) {
        setError("No solution was found with these pieces.");
        setSolution([]);
      } else if (steps.length === 0) {
        setError("No pieces were placed on the board.");
        setSolution([]);
      } else {
        setSolution(steps);
      }
    } catch (e) {
      setError("An unexpected error occurred while solving the board");
      setSolution([]);
    }
  };

  const resetState = () => {
    setGrid(new Array(GRID_SIZE * GRID_SIZE).fill(false));
    setPieces([]);
    setSolution([]);
    setError(null);
  };

  const handleContinue = () => {
    const lastStep = solution[solution.length - 1];
    window.scrollTo({ top: 0, behavior: "smooth" });

    setPieces([]);
    setSolution([]);
    setError(null);
    setGrid(lastStep.resultingGrid);
  };

  const handleBack = () => {
    setSolution([]);
    setError(null);
  };

  return (
    <>
      <div class="space-y-8">
        {solution.length === 0 ? (
          <>
            <div class="p-2 md:p-4 bg-container-bg rounded-2xl w-fit mx-auto">
              <Grid
                size={GRID_SIZE}
                cells={grid}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
              />
            </div>

            <div class="flex gap-2 md:gap-4 justify-center">
              <PieceSelector
                key={`piece-${solution.length}-0`}
                id={0}
                onChange={handlePieceChange}
              />
              <PieceSelector
                key={`piece-${solution.length}-1`}
                id={1}
                onChange={handlePieceChange}
              />
              <PieceSelector
                key={`piece-${solution.length}-2`}
                id={2}
                onChange={handlePieceChange}
              />
            </div>
            <div class="flex justify-center">
              <button
                onClick={handleSolve}
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Solve
              </button>
            </div>
          </>
        ) : (
          <>
            <SolverSteps steps={solution} pieces={pieces} />
            <div class="flex justify-center gap-4">
              <button
                onClick={handleBack}
                class="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={resetState}
                class="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                New
              </button>
              <button
                onClick={handleContinue}
                class="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
              >
                Continue
              </button>
            </div>
          </>
        )}
        {error && (
          <div class="text-center text-red-500 font-medium text-lg">
            {error}
          </div>
        )}
      </div>
    </>
  );
}
