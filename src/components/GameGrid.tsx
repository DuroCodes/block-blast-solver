import { useState, useEffect } from "preact/hooks";
import PieceSelector from "./PieceSelector";
import SolverSteps from "./SolverSteps";
import {
  findSolution,
  type Grid,
  type Piece,
  type SolutionStep,
} from "../utils/solver";

const GRID_SIZE = 8;

interface Props {
  initialGrid?: Grid;
}

export default function GameGrid({ initialGrid }: Props) {
  const [grid, setGrid] = useState<Grid>(
    initialGrid || new Array(GRID_SIZE * GRID_SIZE).fill(false),
  );

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [solution, setSolution] = useState<SolutionStep[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCell = (index: number) => {
    const newGrid = [...grid];
    newGrid[index] = !newGrid[index];
    setGrid(newGrid);
  };

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
      const steps = findSolution(grid, pieces);
      if (!steps || steps.length === 0) {
        setError("I'm not sure how to solve this one yet, sorry!");
        setSolution([]);
      } else {
        setSolution(steps);
      }
    } catch (e) {
      setError("An error occurred while solving the puzzle");
      setSolution([]);
    }
  };

  const resetState = () => {
    setGrid(new Array(GRID_SIZE * GRID_SIZE).fill(false));
    setPieces([]);
    setSolution([]);
    setError(null);
  };

  const handleMouseDown = (index: number) => {
    setIsDragging(true);
    setDragValue(!grid[index]);
    toggleCell(index);
  };

  const handleMouseEnter = (index: number) => {
    if (isDragging) {
      const newGrid = [...grid];
      newGrid[index] = dragValue;
      setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <>
      <div className="space-y-8">
        {solution.length === 0 ? (
          <>
            <div className="p-2 md:p-4 bg-container-bg rounded-2xl shadow-lg w-fit mx-auto">
              <div className="grid grid-cols-8 bg-gray-800/50 p-[0.5px] gap-[1px] md:p-[1px] rounded-lg">
                {grid.map((filled, index) => (
                  <button
                    key={index}
                    className={`w-9 h-9 md:w-12 md:h-12 rounded-sm ${
                      filled ? "bg-cell-filled" : "bg-cell-bg"
                    } hover:brightness-110 transition-all`}
                    onMouseDown={() => handleMouseDown(index)}
                    onMouseEnter={() => handleMouseEnter(index)}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 md:gap-4 justify-center">
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
            <div className="flex justify-center">
              <button
                onClick={handleSolve}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Solve
              </button>
            </div>
          </>
        ) : (
          // Solution mode
          <>
            <SolverSteps steps={solution} pieces={pieces} />
            <div className="flex justify-center gap-4">
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={resetState}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                New
              </button>
              <button
                onClick={handleContinue}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
              >
                Continue
              </button>
            </div>
          </>
        )}
        {error && (
          <div className="text-center text-red-500 font-medium text-lg">
            {error}
          </div>
        )}
      </div>
    </>
  );
}
